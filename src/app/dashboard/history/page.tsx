"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import HistoryCard from "@/components/history/HistoryCard";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";

export default function HistoryPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchHistory();
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
    return {
      id: chat._id,
      clientName: chat.client ? `${chat.client.firstName} ${chat.client.lastName}` : "Utilisateur inconnu",
      initials: chat.client ? chat.client.firstName[0] + chat.client.lastName[0] : "U",
      issue: "Demande d'assistance",
      description: `Ticket ID: ${chat._id}`,
      ticketId: chat._id.substring(0, 8),
      date: chat.resolvedAt ? new Date(chat.resolvedAt).toLocaleDateString() : new Date().toLocaleDateString(),
      duration: "Terminé",
      agentName: "Agent",
      status: "Resolved",
      colorClass: "bg-surface-container-highest text-on-surface"
    };
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-md p-lg">
        {/* Page Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md pb-md border-b border-surface-variant">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-background">Chat History</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Review resolved and archived conversations.</p>
          </div>
          
          <div className="flex flex-wrap gap-sm">
            {/* Filters */}
            <div className="relative">
              <select className="appearance-none bg-surface border border-outline-variant rounded-md px-3 py-2 pr-8 font-body-sm text-body-sm focus:outline-none focus:border-primary text-on-surface">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
                <option>Custom Range...</option>
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
              <HistoryCard key={chat._id} item={mapToHistoryCard(chat)} />
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
            <button className="px-3 py-1 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm disabled:opacity-50" disabled>Previous</button>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Page 1 of 1</span>
            <button className="px-3 py-1 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low font-label-sm text-label-sm disabled:opacity-50" disabled>Next</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
