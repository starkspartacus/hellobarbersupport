import { Ticket } from "@/lib/mocks/queue";

interface QueueCardProps {
  ticket: Ticket;
  onTakeTicket?: (id: string) => void;
}

export default function QueueCard({ ticket, onTakeTicket }: QueueCardProps) {
  const isCritical = ticket.priority === "critical";
  const isHigh = ticket.priority === "high";

  // Styles dynamiques basés sur la priorité
  const containerClasses = `bg-surface rounded-lg p-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md transition-shadow hover:shadow-md relative overflow-hidden ${
    isCritical ? "border border-error" : "border border-outline-variant"
  }`;

  const categoryBadgeClasses = `px-2 py-0.5 rounded-full font-label-sm text-[10px] ${
    isCritical ? "bg-error-container text-on-error-container" :
    isHigh ? "bg-secondary-container text-on-secondary-container" :
    "bg-surface-variant text-on-surface-variant"
  }`;

  return (
    <div className={containerClasses}>
      {isCritical && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}
      
      <div className={`flex-1 grid grid-cols-1 sm:grid-cols-12 gap-md items-center w-full ${isCritical ? "pl-sm" : ""}`}>
        
        {/* Client Info */}
        <div className="sm:col-span-3 flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-md font-bold shrink-0">
            {ticket.clientInitials}
          </div>
          <div className="truncate">
            <p className="font-label-md text-label-md text-on-surface truncate">{ticket.clientName}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{ticket.clientType}</p>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="sm:col-span-6">
          <div className="flex items-center gap-xs mb-0.5">
            <span className={categoryBadgeClasses}>{ticket.category}</span>
            <p className="font-body-md text-body-md text-on-surface font-medium line-clamp-1">{ticket.subject}</p>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{ticket.description}</p>
        </div>

        {/* Time Info */}
        <div className="sm:col-span-3 flex sm:justify-end items-center gap-xs">
          <span className={`material-symbols-outlined text-[18px] ${isCritical ? "text-error" : "text-on-surface-variant"}`}>
            {isCritical ? "timer" : "schedule"}
          </span>
          <span className={`font-label-md text-label-md ${isCritical ? "text-error" : "text-on-surface-variant"}`}>
            {ticket.waitTime}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => onTakeTicket?.(ticket.id)}
        className="w-full sm:w-auto px-lg py-2 bg-primary text-on-primary rounded-md font-label-md hover:bg-on-primary-fixed-variant transition-colors whitespace-nowrap shadow-sm shrink-0"
      >
        Prendre en charge
      </button>
    </div>
  );
}
