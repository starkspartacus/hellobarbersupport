import { Ticket } from "@/lib/mocks/queue";

interface QueueCardProps {
  ticket: Ticket;
  onTakeTicket?: (id: string) => void;
}

export default function QueueCard({ ticket, onTakeTicket }: QueueCardProps) {
  const isCritical = ticket.priority === "critical";
  const isHigh = ticket.priority === "high";

  // Styles dynamiques basés sur la priorité avec animations de survol
  const containerClasses = `bg-surface rounded-xl p-md border shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md transition-all duration-300 hover:shadow-md hover:-translate-y-px relative overflow-hidden ${
    isCritical ? "border-error" : "border-outline-variant/60"
  }`;

  const categoryBadgeClasses = `px-2.5 py-1 rounded-full font-label-sm text-[10px] uppercase tracking-wider font-bold shadow-sm ${
    isCritical ? "bg-error-container text-on-error-container" :
    isHigh ? "bg-secondary-container text-on-secondary-container" :
    ticket.clientType === "Professionnel" ? "bg-primary-container/20 text-primary-container" :
    "bg-surface-variant text-on-surface-variant"
  }`;

  return (
    <div className={containerClasses}>
      {isCritical && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}
      
      <div className={`flex-1 grid grid-cols-1 sm:grid-cols-12 gap-md items-center w-full ${isCritical ? "pl-sm" : ""}`}>
        
        {/* Client Info */}
        <div className="sm:col-span-3 flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-surface-container-highest to-surface-container-low text-on-surface-variant flex items-center justify-center font-label-md font-bold shrink-0 shadow-inner border border-outline-variant/40">
            {ticket.clientInitials}
          </div>
          <div className="truncate">
            <p className="font-label-md text-label-md text-on-surface truncate font-semibold">{ticket.clientName}</p>
            <p className={`font-label-sm text-label-sm inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
              ticket.clientType === "Professionnel" 
                ? "bg-secondary-container text-on-secondary-container" 
                : "bg-surface-variant text-on-surface-variant"
            }`}>
              {ticket.clientType}
            </p>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="sm:col-span-6">
          <div className="flex flex-wrap items-center gap-xs mb-1">
            <span className={categoryBadgeClasses}>{ticket.category}</span>
            <p className="font-body-md text-body-md text-on-surface font-semibold line-clamp-1">{ticket.subject}</p>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{ticket.description}</p>
        </div>

        {/* Time Info */}
        <div className="sm:col-span-3 flex sm:justify-end items-center gap-xs">
          <span className={`material-symbols-outlined text-[18px] ${isCritical ? "text-error" : "text-on-surface-variant"}`}>
            {isCritical ? "timer" : "schedule"}
          </span>
          <span className={`font-label-md text-label-md font-semibold ${isCritical ? "text-error" : "text-on-surface-variant"}`}>
            {ticket.waitTime}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => onTakeTicket?.(ticket.id)}
        className="w-full sm:w-auto px-lg py-2.5 bg-primary text-on-primary rounded-lg font-label-md font-bold hover:bg-opacity-95 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-md shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Prendre en charge
      </button>
    </div>
  );
}
