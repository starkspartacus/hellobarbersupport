"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

interface PendingVideo {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  salonName: string;
  tenantId: string;
  reports: number;
  createdAt: string;
}

export default function VideoModerationPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ approved: 0, rejected: 0 });

  const fetchPending = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/reported-tutorials/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setPendingVideos(items);
    } catch (error) {
      console.error("Erreur chargement vidéos en attente", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPending();
  }, [token, fetchPending]);

  const handleReview = async (id: string, status: "APPROVED" | "REJECTED", tenantId: string) => {
    if (!token || processingIds.has(id)) return;
    setProcessingIds((prev) => new Set(prev).add(id));

    try {
      await axiosInstance.post(
        `/reported-tutorials/${id}/review`,
        { status, tenantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Animate out, then remove
      setTimeout(() => {
        setPendingVideos((prev) => prev.filter((v) => v._id !== id));
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
      console.error("Erreur modération vidéo", error);
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-md p-md md:p-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-md border-b border-surface-variant">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
                video_library
              </span>
              Modération des Vidéos
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Vidéos signalées plusieurs fois par les clients et en attente d'un examen par le support.
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
        {!isLoading && pendingVideos.length > 0 && (
          <div className="flex items-center gap-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <span className="material-symbols-outlined text-red-400" style={{ fontSize: 20 }}>warning</span>
            <span className="text-red-400 font-bold text-sm">
              {pendingVideos.length} vidéo{pendingVideos.length > 1 ? "s" : ""} signalée{pendingVideos.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-md">
            <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <p className="text-on-surface-variant text-sm">Chargement des vidéos...</p>
          </div>
        ) : pendingVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
            {pendingVideos.map((video) => {
              const isProcessing = processingIds.has(video._id);

              return (
                <div
                  key={video._id}
                  className={`group relative bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col transition-all duration-400 ${
                    isProcessing ? "scale-95 opacity-0" : "hover:shadow-lg hover:border-primary/30"
                  }`}
                  style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
                >
                  {/* Image */}
                  <div className="relative aspect-[9/16] bg-surface-container-high overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                      <a href={video.videoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-primary rounded-full p-3 hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 36 }}>
                          play_arrow
                        </span>
                      </a>
                    </div>
                    {/* Type badge */}
                    <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border backdrop-blur-sm bg-red-500/80 text-white border-red-500/20`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>report</span>
                      {video.reports} signalements
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-2">
                    <div>
                      <p className="font-title-sm text-on-surface font-bold truncate">{video.title}</p>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">
                        Salon : {video.salonName}
                      </p>
                      {video.createdAt && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {new Date(video.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleReview(video._id, "REJECTED", video.tenantId)}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/15 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        Bannir
                      </button>
                      <button
                        onClick={() => handleReview(video._id, "APPROVED", video.tenantId)}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-500 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                        Rétablir
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
                sentiment_very_satisfied
              </span>
            </div>
            <div>
              <p className="font-title-lg text-on-surface font-bold">Aucun signalement</p>
              <p className="text-on-surface-variant text-sm mt-1">
                Aucune vidéo n'a été signalée pour le moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
