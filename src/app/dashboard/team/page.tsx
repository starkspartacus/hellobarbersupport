"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import { z } from "zod";

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

const createTechSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.enum(["support", "admin", "super_admin"]),
  countryCode: z.string().min(2, "Le code pays est requis"),
  phoneNumber: z.string().min(8, "Numéro de téléphone requis"),
});

export default function TeamPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const userRole = (session?.user as any)?.role;

  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "support",
    countryCode: "cote_d_ivoire", // valeur initiale de fallback
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Récupérer la liste des pays depuis le backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get<Country[]>("/countries");
        setCountries(response.data);
        if (response.data.length > 0) {
          // Par défaut, essayer de trouver la Côte d'Ivoire ou prendre le premier pays
          const defaultCountry = response.data.find(c => c.code === "cote_d_ivoire") || response.data[0];
          setFormData(prev => ({
            ...prev,
            countryCode: defaultCountry.code
          }));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des pays:", err);
      }
    };
    fetchCountries();
  }, []);

  // Only allow Super Admin and Admin
  if (userRole !== "super_admin" && userRole !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-xl text-center text-on-surface-variant">
          Accès refusé. Vous n'avez pas les droits nécessaires.
        </div>
      </DashboardLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      createTechSchema.parse(formData);

      // On ajoute un passwordHash généré de manière sécurisée pour passer la validation du backend
      const payload = {
        ...formData,
        passwordHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "!"
      };

      await axiosInstance.post('/users/support-tech', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("Technicien créé avec succès ! Un e-mail contenant son code OTP de première connexion lui a été envoyé.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "support",
        countryCode: countries[0]?.code || "cote_d_ivoire",
        phoneNumber: "",
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError((err as any).errors[0].message);
      } else {
        setError(err?.response?.data?.message || "Erreur lors de la création.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-md p-lg">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Gestion de l'équipe Support</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Ajoutez de nouveaux techniciens pour gérer les tickets de support.
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-outline-variant p-lg">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-md">Nouveau Technicien</h3>
          
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-body-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-[#E6F4EA] text-[#137333] p-3 rounded-lg text-body-sm mb-4 border border-[#CEEAD6]">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="block font-label-md text-on-surface-variant">Prénom</label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Ex: Jean"
                />
              </div>
              <div className="space-y-xs">
                <label className="block font-label-md text-on-surface-variant">Nom</label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Ex: Dupont"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div className="space-y-xs md:col-span-2">
                <label className="block font-label-md text-on-surface-variant">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Ex: jean@support.com"
                />
              </div>
              <div className="space-y-xs">
                <label className="block font-label-md text-on-surface-variant">Code Pays</label>
                <select 
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.phoneCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-md">
              <div className="space-y-xs">
                <label className="block font-label-md text-on-surface-variant">Numéro de téléphone</label>
                <input 
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Ex: 0612345678"
                />
              </div>
            </div>

            {/* Sélection du Rôle et des Droits d'Accès */}
            <div className="border-t border-outline-variant pt-lg mt-lg space-y-md">
              <div>
                <h4 className="font-title-md text-title-md text-on-surface font-semibold">Rôle et Permissions d'Accès</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Choisissez le rôle du technicien. Ses permissions d'accès au support en seront automatiquement déduites.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                {/* Option Support */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "support" })}
                  className={`flex flex-col items-start text-left p-md rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.role === "support"
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`p-xs rounded-lg mb-sm flex items-center justify-center ${formData.role === "support" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  </div>
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">Conseiller Support</span>
                  <span className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                    Accès standard aux chats, identités et catalogue de photos/vidéos.
                  </span>
                </button>

                {/* Option Admin */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`flex flex-col items-start text-left p-md rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.role === "admin"
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`p-xs rounded-lg mb-sm flex items-center justify-center ${formData.role === "admin" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  </div>
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">Administrateur</span>
                  <span className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                    Accès complet + gestion et création de l'équipe support.
                  </span>
                </button>

                {/* Option Super Admin */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "super_admin" })}
                  className={`flex flex-col items-start text-left p-md rounded-xl border transition-all duration-300 cursor-pointer ${
                    formData.role === "super_admin"
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`p-xs rounded-lg mb-sm flex items-center justify-center ${formData.role === "super_admin" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[20px]">shield_person</span>
                  </div>
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">Super Admin</span>
                  <span className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                    Droits d'administration totale, configuration et gestion de l'équipe.
                  </span>
                </button>
              </div>

              {/* Liste des Permissions Visuelles */}
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md space-y-xs">
                <span className="font-label-md text-on-surface-variant block font-medium mb-1">Droits d'accès effectifs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-on-surface">Répondre aux chats de support</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-on-surface">Modérer les vidéos signalées</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-on-surface">Vérifier les identités / KYC</span>
                  </div>
                  <div className="flex items-center gap-xs transition-all duration-300">
                    <span className={`material-symbols-outlined text-[18px] ${
                      formData.role === "admin" || formData.role === "super_admin"
                        ? "text-green-600"
                        : "text-outline"
                    }`}>
                      {formData.role === "admin" || formData.role === "super_admin" ? "check_circle" : "cancel"}
                    </span>
                    <span className={`font-body-sm ${
                      formData.role === "admin" || formData.role === "super_admin"
                        ? "text-on-surface"
                        : "text-outline-variant line-through"
                    }`}>
                      Gestion de l'équipe (membres)
                    </span>
                  </div>
                  <div className="flex items-center gap-xs transition-all duration-300 sm:col-span-2">
                    <span className={`material-symbols-outlined text-[18px] ${
                      formData.role === "super_admin" ? "text-green-600" : "text-outline"
                    }`}>
                      {formData.role === "super_admin" ? "check_circle" : "cancel"}
                    </span>
                    <span className={`font-body-sm ${
                      formData.role === "super_admin" ? "text-on-surface" : "text-outline-variant line-through"
                    }`}>
                      Accès et configuration globale
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-sm flex justify-end">
              <button 
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-xs w-full md:w-auto bg-primary text-on-primary py-sm px-xl rounded-full font-label-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                )}
                Créer le technicien
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
