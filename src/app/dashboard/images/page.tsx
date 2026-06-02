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

export default function ImageModerationPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [stats, setStats] = useState({ approved: 0, rejected: 0 });

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

  useEffect(() => {
    if (token) fetchPending();
  }, [token, fetchPending]);

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
              Modération des Images Catalogue
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Approuvez ou refusez les images soumises par les salons pour la bibliothèque communautaire.
            </p>
          </div>

          {/* Session Stats */}
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
        </div>

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
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" style={{ fontSize: 36 }}>
                        zoom_in
                      </span>
                    </div>
                    {/* Type badge */}
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
