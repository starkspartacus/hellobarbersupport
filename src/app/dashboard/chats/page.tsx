"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatItem from "@/components/chat/ChatItem";
import ChatBubble from "@/components/chat/ChatBubble";
import CustomerDetails from "@/components/chat/CustomerDetails";
import { useSupportStore } from "@/store/useSupportStore";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ActiveChatsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const adminName = session?.user?.name || "Agent";
  const adminInitials = adminName.substring(0, 2).toUpperCase();

  const activeChats = useSupportStore((state) => state.activeChats);
  const fetchActiveChats = useSupportStore((state) => state.fetchActiveChats);
  const selectedChat = useSupportStore((state) => state.selectedChat);
  const selectChat = useSupportStore((state) => state.selectChat);
  const messages = useSupportStore((state) => state.messages);
  const sendMessage = useSupportStore((state) => state.sendMessage);
  const resolveTicket = useSupportStore((state) => state.resolveTicket);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (token) {
      fetchActiveChats(token);
    }
  }, [token, fetchActiveChats]);

  const handleChatSelect = (id: string) => {
    const chat = activeChats.find((c: any) => c._id === id);
    if (chat && token) {
      selectChat(chat, token);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedChat || !token) return;
    sendMessage(selectedChat._id, inputValue, token);
    setInputValue("");
  };

  const handleResolveTicket = () => {
    if (selectedChat && token) {
      resolveTicket(selectedChat._id, token);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const mapToChatItem = (chat: any) => {
    return {
      id: chat._id,
      customerName: chat.client ? `${chat.client.firstName} ${chat.client.lastName}` : "Utilisateur inconnu",
      initials: chat.client ? chat.client.firstName[0] + chat.client.lastName[0] : "U",
      lastMessage: `Ticket ID: ${chat._id.substring(0, 8)}`,
      status: chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now",
      isActive: selectedChat?._id === chat._id,
      tags: ["Support"]
    };
  };

  const mappedChats = activeChats.map(mapToChatItem);
  const activeMappedChat = selectedChat ? mapToChatItem(selectedChat) : null;

  return (
    <DashboardLayout>
      <div className="flex flex-1 p-md gap-md overflow-hidden bg-background h-[calc(100vh-64px)]">
        
        {/* Column 1: Assigned Chats List */}
        <aside className="w-full max-w-[320px] hidden lg:flex flex-col bg-surface border border-outline-variant rounded-lg shadow-soft overflow-hidden shrink-0">
          <div className="p-md border-b border-outline-variant bg-surface flex justify-between items-center shrink-0">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Assigned</h2>
            <div className="flex gap-xs">
              <button className="p-1.5 text-on-surface-variant hover:bg-surface-container-low rounded-md transition-colors">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-surface divide-y divide-outline-variant/50">
            {mappedChats.length > 0 ? (
              mappedChats.map(chat => (
                <ChatItem 
                  key={chat.id} 
                  chat={chat} 
                  onClick={handleChatSelect} 
                />
              ))
            ) : (
              <div className="p-4 text-center text-on-surface-variant text-body-sm">
                Aucun chat actif.
              </div>
            )}
          </div>
        </aside>

        {/* Column 2: Active Chat Window */}
        <section className="flex-1 flex flex-col bg-surface border border-outline-variant rounded-lg shadow-soft overflow-hidden min-w-0">
          {activeMappedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface shrink-0 h-16">
                <div className="flex items-center gap-sm">
                  <div className="w-2 h-2 bg-tertiary-container rounded-full animate-pulse"></div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{activeMappedChat.customerName}</h2>
                </div>
                <div className="flex items-center gap-md">
                  <button onClick={handleResolveTicket} className="flex items-center gap-xs px-lg py-1.5 bg-error text-on-error hover:bg-on-error-container rounded-md font-label-md text-label-md transition-colors shadow-sm active:scale-95">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span className="hidden sm:block">Clôturer le chat</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-lg bg-[#FAFBFC]">
                {messages.map((msg: any, idx: number) => {
                  const isAgent = msg.senderModel === "SupportTech" || msg.senderModel === "Admin";
                  const mappedMsg = {
                    id: msg._id,
                    sender: isAgent ? "agent" as const : "customer" as const,
                    text: msg.text,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    initials: isAgent ? adminInitials : activeMappedChat.initials,
                    customerAvatar: undefined
                  };
                  const showAvatar = idx === 0 || messages[idx - 1].senderModel !== msg.senderModel;
                  return <ChatBubble key={msg._id} message={mappedMsg} showAvatar={showAvatar} />;
                })}
              </div>

              {/* Chat Input Area */}
              <div className="p-md bg-surface border-t border-outline-variant shrink-0">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-sm">
                  <textarea 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none font-body-md text-body-md p-md min-h-[80px]" 
                    placeholder="Type a message..." 
                    rows={2}
                  ></textarea>
                  <div className="flex justify-between items-center p-2 bg-surface-container-lowest rounded-b-lg">
                    <div className="flex gap-1"></div>
                    <div className="flex items-center gap-sm">
                      <span className="font-label-sm text-label-sm text-outline mr-2 hidden sm:inline">Press Enter to send</span>
                      <button 
                        onClick={handleSendMessage}
                        className="flex items-center justify-center bg-primary text-on-primary hover:bg-on-primary-fixed-variant p-2 rounded-md transition-colors active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 text-center">
              <span className="material-symbols-outlined text-[64px] opacity-50 mb-4">chat</span>
              <h3 className="font-headline-sm">Aucun chat sélectionné</h3>
              <p className="font-body-md mt-2 max-w-md">Sélectionnez une conversation dans la liste de gauche pour commencer à discuter.</p>
            </div>
          )}
        </section>

        {/* Column 3: Customer Details */}
        {activeMappedChat && <CustomerDetails />}
      </div>
    </DashboardLayout>
  );
}
