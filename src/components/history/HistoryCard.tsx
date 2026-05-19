import { HistoryItem } from "@/lib/mocks/history";

interface HistoryCardProps {
  item: HistoryItem;
}

export default function HistoryCard({ item }: HistoryCardProps) {
  return (
    <div className="bg-surface rounded-lg border border-surface-variant p-md hover:shadow-soft transition-shadow cursor-pointer group">
      <div className="flex justify-between items-start mb-sm">
        <div className="flex items-center gap-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-md ${item.colorClass}`}>
            {item.initials}
          </div>
          <div>
            <h3 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
              {item.clientName} - {item.issue}
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Client: Jane Doe • Ticket {item.ticketId}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-xs">
          <span className="px-2 py-1 bg-surface-container-low text-on-surface-variant rounded-full font-label-sm text-label-sm border border-outline-variant flex items-center gap-xs">
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            {item.status}
          </span>
          <span className="font-label-sm text-label-sm text-outline">{item.date}</span>
        </div>
      </div>
      <div className="pl-[52px]">
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
          {item.description}
        </p>
        <div className="mt-sm flex items-center gap-md font-label-sm text-label-sm text-outline">
          <span className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">schedule</span> {item.duration}
          </span>
          <span className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">support_agent</span> Agent: {item.agentName}
          </span>
        </div>
      </div>
    </div>
  );
}
