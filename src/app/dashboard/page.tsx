"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/queue/StatCard";
import QueueCard from "@/components/queue/QueueCard";
import { useSupportStore } from "@/store/useSupportStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function QueuePage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  
  const queue = useSupportStore((state) => state.queue);
  const fetchQueue = useSupportStore((state) => state.fetchQueue);
  const takeTicket = useSupportStore((state) => state.takeTicket);

  useEffect(() => {
    if (token) {
      fetchQueue(token);
    }
  }, [token, fetchQueue]);

  const handleTakeTicket = (id: string) => {
    if (token) {
      takeTicket(id, token);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-md p-lg">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Incoming Requests Queue</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Unassigned tickets requiring immediate attention.</p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs px-md py-sm bg-surface border border-outline-variant rounded-md text-on-surface font-label-md hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          <StatCard 
            title="Critical Wait" 
            value={0} 
            icon="warning" 
            type="critical" 
          />
          <StatCard 
            title="Total in Queue" 
            value={queue.length} 
            icon="inbox" 
            type="info" 
          />
          <StatCard 
            title="Avg Wait Time" 
            value="--" 
            icon="timer" 
            type="time" 
          />
        </div>

        {/* Queue List */}
        <div className="space-y-sm">
          {queue.length > 0 ? (
            queue.map((ticket: any) => (
              <QueueCard 
                key={ticket._id} 
                ticket={{
                  id: ticket._id,
                  clientInitials: ticket.client ? ticket.client.firstName[0] + ticket.client.lastName[0] : "U",
                  clientName: ticket.client ? `${ticket.client.firstName} ${ticket.client.lastName}` : "Utilisateur inconnu",
                  clientType: "Standard",
                  category: "Demande",
                  subject: "Demande d'assistance",
                  description: `Ticket ID: ${ticket._id}`,
                  waitTime: "En attente",
                  priority: "normal"
                }} 
                onTakeTicket={handleTakeTicket}
              />
            ))
          ) : (
            <div className="text-center p-xl text-on-surface-variant bg-surface rounded-lg border border-outline-variant border-dashed">
              Aucun ticket en file d'attente. Bon travail !
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
