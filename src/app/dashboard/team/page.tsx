"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import { z } from "zod";

const createTechSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  passwordHash: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  countryCode: z.string().min(2, "Le code pays est requis (ex: fr, ci)"),
  phoneNumber: z.string().min(8, "Numéro de téléphone requis"),
});

export default function TeamPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const userRole = (session?.user as any)?.role;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    countryCode: "fr",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      await axiosInstance.post('/users/support-tech', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("Technicien support créé avec succès !");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        passwordHash: "",
        countryCode: "fr",
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
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
                <label className="block font-label-md text-on-surface-variant">Mot de passe temporaire</label>
                <input 
                  type="password"
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Minimum 6 caractères"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="block font-label-md text-on-surface-variant">Code Pays</label>
                <select 
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="fr">France (FR)</option>
                  <option value="ci">Côte d'Ivoire (CI)</option>
                  <option value="sn">Sénégal (SN)</option>
                  <option value="be">Belgique (BE)</option>
                  <option value="ch">Suisse (CH)</option>
                  <option value="ca">Canada (CA)</option>
                </select>
              </div>
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

            <div className="pt-sm flex justify-end">
              <button 
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-xs w-full md:w-auto bg-primary text-on-primary py-sm px-xl rounded-full font-label-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
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
