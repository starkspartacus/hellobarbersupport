import { ChatMessage } from "@/lib/mocks/chat";

interface ChatBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
}

export default function ChatBubble({ message, showAvatar = true }: ChatBubbleProps) {
  if (message.sender === "system") {
    return (
      <div className="flex justify-center">
        <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-label-sm text-label-sm">
          {message.text}
        </span>
      </div>
    );
  }

  const isAgent = message.sender === "agent";

  return (
    <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[80%] ${isAgent ? "self-end items-end" : "items-start"}`}>
      <div className={`flex items-end gap-2 ${isAgent ? "flex-row-reverse" : ""}`}>
        
        {/* Avatar */}
        {showAvatar ? (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-[10px] shrink-0 ${
            isAgent ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
          }`}>
            {message.initials}
          </div>
        ) : (
          <div className="w-6 h-6 shrink-0"></div>
        )}

        {/* Bubble */}
        <div className={`p-3 rounded-2xl font-body-md text-body-md shadow-sm ${
          isAgent 
            ? "bg-primary-container text-on-primary-container rounded-br-sm" 
            : "bg-surface border border-outline-variant text-on-surface rounded-bl-sm"
        }`}>
          {message.text}
        </div>
      </div>

      {/* Time */}
      <span className={`font-label-sm text-label-sm text-outline ${isAgent ? "mr-8" : "ml-8"}`}>
        {message.time}
      </span>
    </div>
  );
}
