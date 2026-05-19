import { ActiveChat } from "@/lib/mocks/chat";

interface ChatItemProps {
  chat: ActiveChat;
  onClick?: (id: string) => void;
}

export default function ChatItem({ chat, onClick }: ChatItemProps) {
  return (
    <div 
      onClick={() => onClick?.(chat.id)}
      className={`p-md cursor-pointer transition-colors flex gap-sm relative ${
        chat.isActive 
          ? "bg-primary-fixed/20 border-l-4 border-primary" 
          : "hover:bg-surface-container-low border-l-4 border-transparent"
      }`}
    >
      <div className="relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-headline-sm text-headline-sm ${
          chat.isActive ? "bg-secondary-container text-on-secondary-container" : 
          "bg-tertiary-container text-on-tertiary-container"
        }`}>
          {chat.initials}
        </div>
        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-surface rounded-full ${
          chat.isActive ? "bg-tertiary-container" : "bg-outline"
        }`}></span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="font-label-md text-label-md text-on-surface truncate">{chat.customerName}</span>
          <span className={`font-label-sm text-label-sm ${chat.isActive ? "text-primary" : "text-on-surface-variant"}`}>
            {chat.status}
          </span>
        </div>
        <p className={`font-body-sm text-body-sm truncate ${chat.isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
          {chat.lastMessage}
        </p>
        
        {chat.tags && chat.tags.length > 0 && (
          <div className="flex gap-xs mt-sm">
            {chat.tags.map((tag, i) => (
              <span key={i} className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] ${
                tag === 'Urgent' 
                  ? 'bg-error-container text-on-error-container' 
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
