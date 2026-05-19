"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/queue/StatCard";
import QueueCard from "@/components/queue/QueueCard";
import { useSupportStore } from "@/store/useSupportStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDuration } from "@/lib/utils/formatDuration";

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

  const calculateStats = () => {
    let criticalCount = 0;
    let totalWaitTime = 0;
    
    queue.forEach((ticket: any) => {
      const waitTimeMs = new Date().getTime() - new Date(ticket.lastMessageAt || ticket.createdAt).getTime();
      const waitMinutes = Math.floor(waitTimeMs / 60000);
      totalWaitTime += waitMinutes;
      if (waitMinutes > 30) criticalCount++;
    });

    const avgWaitTime = queue.length > 0 ? Math.floor(totalWaitTime / queue.length) : 0;
    return { criticalCount, avgWaitTime };
  };

  const { criticalCount, avgWaitTime } = calculateStats();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-md p-lg">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">File d'attente des requêtes</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Tickets non assignés nécessitant une attention immédiate.</p>
          </div>
          <div className="flex gap-sm">
            <button className="flex items-center gap-xs px-md py-sm bg-surface border border-outline-variant rounded-md text-on-surface font-label-md hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filtrer
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          <StatCard 
            title="Attente Critique (>30m)" 
            value={criticalCount} 
            icon="warning" 
            type="critical" 
          />
          <StatCard 
            title="Total en attente" 
            value={queue.length} 
            icon="inbox" 
            type="info" 
          />
          <StatCard 
            title="Temps d'attente moyen" 
            value={formatDuration(avgWaitTime)} 
            icon="timer" 
            type="time" 
          />
        </div>

        {/* Queue List */}
        <div className="space-y-sm">
          {queue.length > 0 ? (
            queue.map((ticket: any) => {
              const name = ticket.ownerName || "Utilisateur inconnu";
              const initials = name !== "Utilisateur inconnu" ? name.substring(0, 2).toUpperCase() : "U";
              
              // Gamification: Calculate wait time and set priority
              const waitTimeMs = new Date().getTime() - new Date(ticket.lastMessageAt || ticket.createdAt).getTime();
              const waitMinutes = Math.floor(waitTimeMs / 60000);
              let priority = "normal";
              if (waitMinutes > 30) priority = "critical";
              else if (waitMinutes > 10) priority = "high";
              
              return (
                <QueueCard 
                  key={ticket.id} 
                  ticket={{
                    id: ticket.id,
                    clientInitials: initials,
                    clientName: name,
                    clientType: ticket.ownerRole === 'salon' ? 'Professionnel' : 'Client',
                    category: ticket.ownerRole === 'salon' ? 'Support Salon' : 'Support Client',
                    subject: "Nouvelle demande",
                    description: `Dernier message: ${new Date(ticket.lastMessageAt || ticket.createdAt).toLocaleTimeString()}`,
                    waitTime: formatDuration(waitMinutes),
                    priority: priority as any
                  }} 
                  onTakeTicket={handleTakeTicket}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-xl text-on-surface-variant bg-surface rounded-lg border border-outline-variant border-dashed">
              <span className="material-symbols-outlined text-[48px] mb-4 text-primary">celebration</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">Excellent travail !</h3>
              <p>La file d'attente est vide. Vous êtes à jour.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
