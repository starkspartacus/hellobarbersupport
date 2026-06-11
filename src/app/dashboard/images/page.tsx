"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

interface PendingImage {
  _id: string;
  type: "service" | "product" | "specialty";
  key: string;
  url: string;
  status: string;
  createdBySalonId?: string;
  createdAt?: string;
}

const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
  service: { label: "Prestation", icon: "content_cut", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  product: { label: "Produit", icon: "shopping_bag", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  specialty: { label: "Spécialité", icon: "star", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
};

const PREDEFINED_SPECIALTIES = [
  { key: "BRAIDS", label: "Tresses" },
  { key: "FADE", label: "Dégradé" },
  { key: "MAKEUP", label: "Makeup" },
  { key: "WEAVE", label: "Tissage / Weave" },
  { key: "COLORATION", label: "Coloration" },
  { key: "LOCS", label: "Locks / Dreadlocks" },
  { key: "NAILS", label: "Onglerie" },
  { key: "LASHES", label: "Cils" },
];

const PREDEFINED_PRODUCTS = [
  "Tissage / Perruque",
  "Mèches",
  "Soins de la barbe",
  "Soins des cheveux",
  "Coiffage et styling",
  "Rasage",
  "Coloration capillaire",
  "Accessoires salon",
  "Soins corps/visage",
  "Parfumerie",
  "Compléments alimentaires",
  "Enfants",
  "Autre"
];

const FALLBACK_PRESET_SERVICES = [
  { key: 'DEGRADE', label: 'Coiffure dégradé', vertical: 'barber' },
  { key: 'COUPE_CLASSIQUE', label: 'Coupe classique', vertical: 'barber' },
  { key: 'COUPE_BARBE', label: 'Coupe + barbe', vertical: 'barber' },
  { key: 'RASAGE_BARBE', label: 'Rasage & taille de barbe', vertical: 'barber' },
  { key: 'COIFFE_EVENEMENT', label: 'Coiffure soirée / mariage', vertical: 'coiffure' },
  { key: 'SOIN_CHEVEUX', label: 'Soin / traitement capillaire', vertical: 'coiffure' },
  { key: 'ENFANT', label: 'Coupe enfant', vertical: 'barber' },
  { key: 'SOIN_VISAGE_HOMME', label: 'Soin visage', vertical: 'barber' },
  { key: 'CORNROW_HOMME', label: 'Cornrows homme', vertical: 'coiffure' },
  { key: 'VANILLES_HOMME', label: 'Vanilles homme', vertical: 'coiffure' },
  { key: 'LOCKS_RETOUCHE_HOMME', label: 'Retouche locks homme', vertical: 'coiffure' },
  { key: 'NATTES_MIXTE', label: 'Nattes mixte (homme/femme)', vertical: 'coiffure' },
  { key: 'CROCHET_BRAIDS', label: 'Crochet braids', vertical: 'coiffure' },
  { key: 'BOX_BRAIDS_LONG', label: 'Box braids très long', vertical: 'coiffure' },
  { key: 'AUTRE', label: 'Autre (nom personnalisé ci-dessous)', vertical: 'general' },
];

export default function ImageModerationPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [activeTab, setActiveTab] = useState<"moderation" | "specialties">("moderation");

  // State pour la modération
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [stats, setStats] = useState({ approved: 0, rejected: 0 });

  // State pour la gestion des images approuvées (prestations/produits/spécialités)
  const [catalogImages, setCatalogImages] = useState<{ _id?: string; type: "service" | "product" | "specialty"; key: string; url: string }[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<"specialty" | "service" | "product">("specialty");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [newSpecialtyKey, setNewSpecialtyKey] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Nouveaux états pour le chargement des prestations dynamiques et la recherche
  const [presetServices, setPresetServices] = useState<{ key: string; label: string; vertical?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPending = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/shared-catalog-images/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setPendingImages(items);
    } catch (error) {
      console.error("Erreur chargement images en attente", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchApprovedImages = useCallback(async () => {
    if (!token) return;
    setIsLoadingCatalog(true);
    try {
      const res = await axiosInstance.get("/shared-catalog-images/all-approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data) ? res.data : [];
      setCatalogImages(items);
    } catch (error) {
      console.error("Erreur chargement des images approuvées", error);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, [token]);

  const fetchPresetMetadata = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("/tenant/services/preset-metadata", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.presetsByVertical) {
        const allPresets: { key: string; label: string; vertical: string }[] = [];
        Object.entries(res.data.presetsByVertical).forEach(([vertical, presets]: [string, any]) => {
          if (Array.isArray(presets)) {
            presets.forEach((p: any) => {
              if (p && p.key) {
                if (!allPresets.some(existing => existing.key === p.key)) {
                  allPresets.push({
                    key: p.key,
                    label: p.label || p.key,
                    vertical,
                  });
                }
              }
            });
          }
        });
        setPresetServices(allPresets);
      } else {
        setPresetServices(FALLBACK_PRESET_SERVICES);
      }
    } catch (error) {
      console.error("Erreur chargement des presets de services", error);
      setPresetServices(FALLBACK_PRESET_SERVICES);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPending();
      fetchApprovedImages();
      fetchPresetMetadata();
    }
  }, [token, fetchPending, fetchApprovedImages, fetchPresetMetadata]);

  const handleReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (!token || processingIds.has(id)) return;
    setProcessingIds((prev) => new Set(prev).add(id));

    try {
      await axiosInstance.patch(
        `/shared-catalog-images/${id}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Animate out, then remove
      setTimeout(() => {
        setPendingImages((prev) => prev.filter((img) => img._id !== id));
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setStats((prev) => ({
          ...prev,
          [status === "APPROVED" ? "approved" : "rejected"]:
            prev[status === "APPROVED" ? "approved" : "rejected"] + 1,
        }));
      }, 400);
    } catch (error) {
      console.error("Erreur modération image", error);
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleUploadImage = async (type: "service" | "product" | "specialty", key: string, file: File) => {
    if (!token) return;
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Uploader l'image
      const uploadRes = await axiosInstance.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const uploadedUrl = uploadRes.data?.url;
      if (!uploadedUrl) {
        alert("Erreur lors de l'upload de l'image.");
        return;
      }
      
      // Assigner et enregistrer en base de données (l'ancien est automatiquement purgé côté NestJS)
      await axiosInstance.post(
        "/shared-catalog-images/update-category",
        { type, key: key.toUpperCase(), url: uploadedUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchApprovedImages();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image", error);
      alert("Erreur lors de la mise à jour de l'image.");
    } finally {
      setUploadingKey(null);
    }
  };

  const onFileChange = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleUploadImage(catalogFilter, key, file);
  };

  const getDisplaySpecialties = () => {
    const dbSpecs = catalogImages.filter(img => img.type === "specialty");
    const map = new Map<string, { key: string; label: string; url: string; _id?: string }>();
    
    PREDEFINED_SPECIALTIES.forEach(spec => {
      map.set(spec.key.toUpperCase(), { key: spec.key, label: spec.label, url: "" });
    });
    
    dbSpecs.forEach(spec => {
      const normalizedKey = spec.key.toUpperCase();
      const predefined = PREDEFINED_SPECIALTIES.find(s => s.key.toUpperCase() === normalizedKey);
      map.set(normalizedKey, {
        key: spec.key,
        label: predefined ? predefined.label : spec.key,
        url: spec.url,
        _id: spec._id
      });
    });
    
    return Array.from(map.values());
  };

  const getDisplayServices = () => {
    const dbServices = catalogImages.filter(img => img.type === "service");
    const map = new Map<string, { key: string; label: string; url: string; _id?: string }>();
    
    // Ajouter les presets d'abord
    presetServices.forEach(ps => {
      map.set(ps.key.toUpperCase(), { key: ps.key, label: ps.label, url: "" });
    });
    
    // Fusionner avec la BD
    dbServices.forEach(service => {
      const normalizedKey = service.key.toUpperCase();
      const preset = presetServices.find(ps => ps.key.toUpperCase() === normalizedKey);
      map.set(normalizedKey, {
        key: service.key,
        label: preset ? preset.label : service.key,
        url: service.url,
        _id: service._id
      });
    });
    
    return Array.from(map.values());
  };

  const getDisplayProducts = () => {
    const dbProducts = catalogImages.filter(img => img.type === "product");
    const map = new Map<string, { key: string; label: string; url: string; _id?: string }>();
    
    PREDEFINED_PRODUCTS.forEach(prod => {
      map.set(prod.toUpperCase(), { key: prod, label: prod, url: "" });
    });
    
    dbProducts.forEach(prod => {
      const normalizedKey = prod.key.toUpperCase();
      const predefined = PREDEFINED_PRODUCTS.find(p => p.toUpperCase() === normalizedKey);
      map.set(normalizedKey, {
        key: prod.key,
        label: predefined || prod.key,
        url: prod.url,
        _id: prod._id
      });
    });
    
    return Array.from(map.values());
  };

  const displayedItems = 
    catalogFilter === "specialty" ? getDisplaySpecialties() :
    catalogFilter === "service" ? getDisplayServices() :
    getDisplayProducts();

  const filteredDisplayedItems = displayedItems.filter(item => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      item.key.toLowerCase().includes(query) ||
      (item.label && item.label.toLowerCase().includes(query))
    );
  });

  const getTypeInfo = (type: string) =>
    typeLabels[type] || { label: type, icon: "image", color: "bg-surface-container text-on-surface" };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-md p-md md:p-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-md border-b border-surface-variant">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
                photo_library
              </span>
              Modération & Gestion des Images
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Approuvez les suggestions de la communauté ou configurez les images de catalogue (services, produits, spécialités).
            </p>
          </div>

          {/* Actions Session / Rafraîchir */}
          {activeTab === "moderation" ? (
            <div className="flex gap-sm">
              <div className="flex items-center gap-xs px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="material-symbols-outlined text-green-400" style={{ fontSize: 18 }}>check_circle</span>
                <span className="text-green-400 font-bold text-sm">{stats.approved}</span>
              </div>
              <div className="flex items-center gap-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="material-symbols-outlined text-red-400" style={{ fontSize: 18 }}>cancel</span>
                <span className="text-red-400 font-bold text-sm">{stats.rejected}</span>
              </div>
              <button
                onClick={() => fetchPending()}
                className="flex items-center gap-xs px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fetchApprovedImages()}
              className="flex items-center gap-xs px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
              Rafraîchir
            </button>
          )}
        </div>

        {/* Système d'onglets principaux */}
        <div className="flex gap-md border-b border-surface-variant pb-1">
          <button
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center gap-2 px-md py-sm font-title-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "moderation"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-outline-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>rate_review</span>
            Images en attente
          </button>
          <button
            onClick={() => setActiveTab("specialties")}
            className={`flex items-center gap-2 px-md py-sm font-title-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "specialties"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-outline-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>collections</span>
            Gestion du Catalogue Global
          </button>
        </div>

        {/* Contenu de l'onglet actif */}
        {activeTab === "moderation" ? (
          <>
            {/* Pending Count Badge */}
            {!isLoading && pendingImages.length > 0 && (
              <div className="flex items-center gap-sm bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
                <span className="material-symbols-outlined text-amber-400" style={{ fontSize: 20 }}>pending</span>
                <span className="text-amber-300 font-bold text-sm">
                  {pendingImages.length} image{pendingImages.length > 1 ? "s" : ""} en attente de modération
                </span>
              </div>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-md">
                <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="text-on-surface-variant text-sm">Chargement des images...</p>
              </div>
            ) : pendingImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
                {pendingImages.map((img) => {
                  const info = getTypeInfo(img.type);
                  const isProcessing = processingIds.has(img._id);

                  return (
                    <div
                      key={img._id}
                      className={`group relative bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col transition-all duration-400 ${
                        isProcessing ? "scale-95 opacity-0" : "hover:shadow-lg hover:border-primary/30"
                      }`}
                      style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    >
                      {/* Image */}
                      <div
                        className="relative aspect-square bg-surface-container-high cursor-pointer overflow-hidden"
                        onClick={() => setZoomImage(img.url)}
                      >
                        <img
                          src={img.url}
                          alt={img.key}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" style={{ fontSize: 36 }}>
                            zoom_in
                          </span>
                        </div>
                        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${info.color}`}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{info.icon}</span>
                          {info.label}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3 flex flex-col gap-2">
                        <div>
                          <p className="font-title-sm text-on-surface font-bold truncate">{img.key}</p>
                          {img.createdBySalonId && (
                            <p className="text-xs text-on-surface-variant truncate mt-0.5">
                              Salon : {img.createdBySalonId}
                            </p>
                          )}
                          {img.createdAt && (
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {new Date(img.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={() => handleReview(img._id, "REJECTED")}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/15 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                            Refuser
                          </button>
                          <button
                            onClick={() => handleReview(img._id, "APPROVED")}
                            disabled={isProcessing}
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-500 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                            Approuver
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-md text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 40 }}>
                    done_all
                  </span>
                </div>
                <div>
                  <p className="font-title-lg text-on-surface font-bold">File d'attente vide</p>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Toutes les images ont été modérées. Les nouvelles soumissions apparaîtront ici.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Onglet de Gestion du Catalogue Global */
          <>
            {/* Filtres de types d'images */}
            <div className="flex gap-sm mb-md bg-surface-container/50 p-1.5 rounded-xl border border-outline-variant w-fit">
              <button
                onClick={() => setCatalogFilter("specialty")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  catalogFilter === "specialty"
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>star</span>
                Spécialités ({getDisplaySpecialties().length})
              </button>
              <button
                onClick={() => setCatalogFilter("service")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  catalogFilter === "service"
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>content_cut</span>
                Prestations ({getDisplayServices().length})
              </button>
              <button
                onClick={() => setCatalogFilter("product")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  catalogFilter === "product"
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_bag</span>
                Produits ({getDisplayProducts().length})
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-md max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher par clé ou libellé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container/50 border border-outline-variant rounded-xl text-sm text-on-surface placeholder-outline-variant focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                </button>
              )}
            </div>

            {isLoadingCatalog ? (
              <div className="flex flex-col items-center justify-center py-20 gap-md">
                <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="text-on-surface-variant text-sm">Chargement du catalogue...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
                {filteredDisplayedItems.map((spec) => (
                  <div
                    key={spec.key}
                    className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Image Preview */}
                    <div className="relative aspect-square bg-surface-container-high overflow-hidden">
                      {spec.url ? (
                        <>
                          <img
                            src={spec.url}
                            alt={spec.label}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onClick={() => setZoomImage(spec.url)}
                            loading="lazy"
                          />
                          <div
                            className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center cursor-pointer"
                            onClick={() => setZoomImage(spec.url)}
                          >
                            <span className="material-symbols-outlined text-white opacity-0 hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" style={{ fontSize: 36 }}>
                              zoom_in
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant bg-surface-container p-4 text-center">
                          <span className="material-symbols-outlined text-outline" style={{ fontSize: 48 }}>
                            image_not_supported
                          </span>
                          <p className="text-xs mt-2 font-medium">Aucune image configurée</p>
                          <p className="text-[10px] text-outline mt-1">(Redirection automatique vers repli ou génération)</p>
                        </div>
                      )}

                      {uploadingKey === spec.key && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-10">
                          <div className="w-8 h-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                          <span className="text-xs font-bold">Mise à jour...</span>
                        </div>
                      )}
                    </div>

                    {/* Info & Bouton Upload */}
                    <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <h3 className="font-title-sm text-on-surface font-bold truncate" title={spec.label}>
                          {spec.label}
                        </h3>
                        {spec.key !== spec.label && (
                          <p className="text-[10px] text-outline truncate font-mono mt-0.5" title={spec.key}>
                            Clé : {spec.key}
                          </p>
                        )}
                        <p className="text-xs text-on-surface-variant mt-1">
                          {catalogFilter === "specialty" ? "Spécialité du système" :
                           catalogFilter === "service" ? "Prestation prédéfinie" : "Catégorie de produit"}
                        </p>
                      </div>

                      <div>
                        <label className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover cursor-pointer active:scale-95 transition-all text-center">
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload</span>
                          Modifier la photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onFileChange(spec.key, e)}
                            disabled={uploadingKey !== null}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Ajout d'un élément personnalisé */}
                <div className="bg-surface border border-dashed border-outline-variant rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center gap-md min-h-[300px]">
                  {isAddingNew ? (
                    <div className="w-full space-y-md">
                      <h3 className="font-title-sm text-on-surface font-bold">
                        {catalogFilter === "specialty" ? "Nouvelle Prestation" :
                         catalogFilter === "service" ? "Nouveau Service" : "Nouveau Produit"}
                      </h3>
                      <input
                        type="text"
                        placeholder={
                          catalogFilter === "specialty" ? "Ex: Pédicure, Massage..." :
                          catalogFilter === "service" ? "Ex: Coupe homme, Lissage..." : "Ex: Shampoing, Cire..."
                        }
                        value={newSpecialtyKey}
                        onChange={(e) => setNewSpecialtyKey(e.target.value)}
                        className="w-full px-3 py-2 bg-surface border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsAddingNew(false);
                            setNewSpecialtyKey("");
                          }}
                          className="flex-1 py-2 rounded-lg border border-outline text-on-surface text-sm font-bold hover:bg-surface-container active:scale-95 transition-all"
                        >
                          Annuler
                        </button>
                        <label className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover cursor-pointer active:scale-95 transition-all">
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                          Uploader
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !newSpecialtyKey.trim()) return;
                              await handleUploadImage(catalogFilter, newSpecialtyKey.trim(), file);
                              setIsAddingNew(false);
                              setNewSpecialtyKey("");
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
                      </div>
                      <div>
                        <h3 className="font-title-sm text-on-surface font-bold">
                          {catalogFilter === "specialty" ? "Ajouter une spécialité" :
                           catalogFilter === "service" ? "Ajouter un service" : "Ajouter un produit"}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Associer une image de catalogue.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddingNew(true)}
                        className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-sm hover:bg-primary/20 transition-all active:scale-95"
                      >
                        Créer
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomImage(null)}
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomImage}
              alt="Zoom"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              style={{ animation: "scaleIn 0.25s ease-out" }}
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </DashboardLayout>
  );
}


