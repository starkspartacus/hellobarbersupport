"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import HistoryCard from "@/components/history/HistoryCard";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { formatDuration } from "@/lib/utils/formatDuration";

export default function HistoryPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchHistory();
      
      // Setup realtime listener for history
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7700';
      const socketUrl = baseURL.replace('/api', '') + '/chat';
      const socket = io(socketUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
      });

      socket.on('chatUpdated', () => {
        fetchHistory(); // Refresh history when a chat is resolved
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/chat/admin/conversations?status=resolved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryItems(res.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapToHistoryCard = (chat: any) => {
    const name = chat.ownerName || "Utilisateur inconnu";
    const initials = name !== "Utilisateur inconnu" ? name.substring(0, 2).toUpperCase() : "U";
    
    // Gamification: Determine resolution speed class
    const start = new Date(chat.createdAt).getTime();
    const end = new Date(chat.resolvedAt || chat.updatedAt).getTime();
    const durationMs = end - start;
    const durationMins = Math.floor(durationMs / 60000);
    
    let durationText = formatDuration(durationMins);
    let colorClass = "bg-surface-container-highest text-on-surface"; // default
    
    if (durationMins < 10) {
      colorClass = "bg-primary-container text-on-primary-container"; // Fast resolution (gamified reward)
      durationText = `⚡ ${durationText} (Éclair)`;
    } else if (durationMins > 60) {
      colorClass = "bg-error-container text-on-error-container"; // Slow
    }

    const chatId = chat.id || chat._id;
    return {
      id: chatId,
      clientName: name,
      initials: initials,
      issue: chat.ownerRole === 'salon' ? "Support Salon" : "Support Client",
      description: "Discussion terminée",
      ticketId: chatId.substring(0, 8),
      date: chat.resolvedAt ? new Date(chat.resolvedAt).toLocaleDateString() : new Date().toLocaleDateString(),
      duration: durationText,
      agentName: chat.supportId ? "Technicien assigné" : "Agent",
      status: "Résolu",
      colorClass: colorClass
    };
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-md p-lg">
        {/* Page Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-md border-b border-surface-variant">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">Historique des conversations</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Consultez les conversations résolues et archivées.</p>
          </div>
          
          <div className="flex flex-wrap gap-sm">
            {/* Filters */}
            <div className="relative">
              <select className="appearance-none bg-surface border border-outline-variant rounded-md px-3 py-2 pr-8 font-body-sm text-body-sm focus:outline-none focus:border-primary text-on-surface">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>Cette année</option>
                <option>Période personnalisée...</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">calendar_today</span>
            </div>
          </div>
        </div>

        {/* Chat History List */}
        <div className="grid grid-cols-1 gap-sm">
          {isLoading ? (
            <div className="text-center p-8">Chargement...</div>
          ) : historyItems.length > 0 ? (
            historyItems.map(chat => (
              <HistoryCard key={chat.id || chat._id} item={mapToHistoryCard(chat)} />
            ))
          ) : (
            <div className="text-center p-xl text-on-surface-variant bg-surface rounded-lg border border-outline-variant border-dashed">
              Aucun historique trouvé.
            </div>
          )}
        </div>

        {/* Pagination */}
        {historyItems.length > 0 && (
          <div className="flex justify-center items-center gap-md pt-md pb-lg">
            <button className="px-3 py-1 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm disabled:opacity-50" disabled>Précédent</button>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Page 1 sur 1</span>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm disabled:opacity-50" disabled>Suivant</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
