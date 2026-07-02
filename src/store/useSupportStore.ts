import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderRole: string;
  text: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  status: 'waiting' | 'active' | 'resolved';
  ownerName?: string;
  ownerEmail?: string;
  supportId?: string;
  lastMessageAt?: string;
}

interface SupportState {
  queue: Conversation[];
  activeChats: Conversation[];
  selectedChat: Conversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  socket: Socket | null;
  
  // Actions
  fetchQueue: (token: string) => Promise<void>;
  fetchActiveChats: (token: string) => Promise<void>;
  selectChat: (chat: Conversation | null, token?: string) => void;
  fetchMessages: (conversationId: string, token: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string, token: string) => Promise<void>;
  takeTicket: (conversationId: string, token: string) => Promise<void>;
  resolveTicket: (conversationId: string, token: string) => Promise<void>;
  
  // Real-time
  initSocket: (token: string) => void;
  disconnectSocket: () => void;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  queue: [],
  activeChats: [],
  selectedChat: null,
  messages: [],
  isLoading: false,
  socket: null,

  fetchQueue: async (token) => {
    try {
      // Fetch both waiting and open tickets for the queue
      const [waitingRes, openRes] = await Promise.all([
        axiosInstance.get('/chat/admin/conversations?status=waiting', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axiosInstance.get('/chat/admin/conversations?status=open', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const combinedQueue = [...waitingRes.data, ...openRes.data];
      // Sort combined queue by oldest first
      combinedQueue.sort((a, b) => {
        const dateA = new Date(a.lastMessageAt || a.createdAt).getTime();
        const dateB = new Date(b.lastMessageAt || b.createdAt).getTime();
        return dateA - dateB; // oldest first
      });
      set({ queue: combinedQueue });
    } catch (error) {
      console.error('Failed to fetch queue', error);
    }
  },

  fetchActiveChats: async (token) => {
    try {
      const res = await axiosInstance.get('/chat/admin/conversations?status=active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ activeChats: res.data });
    } catch (error) {
      console.error('Failed to fetch active chats', error);
    }
  },

  selectChat: async (chat, token) => {
    set({ selectedChat: chat, messages: [] });
    if (chat && token) {
      await get().fetchMessages(chat.id || (chat as any)._id, token);
    }
  },

  fetchMessages: async (conversationId, token) => {
    try {
      const res = await axiosInstance.get(`/chat/admin/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ messages: res.data });
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  },

  sendMessage: async (conversationId, text, token) => {
    try {
      await axiosInstance.post(`/chat/admin/${conversationId}/messages`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally re-fetch messages or rely on socket
      await get().fetchMessages(conversationId, token);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  },

  takeTicket: async (conversationId, token) => {
    try {
      await axiosInstance.post(`/chat/admin/${conversationId}/status`, { status: 'active' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await get().fetchQueue(token);
      await get().fetchActiveChats(token);
    } catch (error) {
      console.error('Failed to take ticket', error);
    }
  },

  resolveTicket: async (conversationId, token) => {
    try {
      await axiosInstance.post(`/chat/admin/${conversationId}/status`, { status: 'resolved' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ selectedChat: null, messages: [] });
      await get().fetchActiveChats(token);
    } catch (error) {
      console.error('Failed to resolve ticket', error);
    }
  },

  initSocket: (token) => {
    const currentSocket = get().socket;
    if (currentSocket) {
      return; // Socket is already initialized
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7700';
    // Using the base URL without /api for Socket.io, and targeting the /chat namespace
    const socketUrl = baseURL.replace('/api', '') + '/chat';
    
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    // Simulate listening to events (adjust according to your backend implementation)
    socket.on('newMessage', (message: ChatMessage) => {
      const { selectedChat, messages } = get();
      if (selectedChat && (selectedChat.id === message.conversationId || (selectedChat as any)._id === message.conversationId)) {
        // Prevent duplicate messages
        const isDuplicate = messages.some((m) => m.id === message.id || (m as any)._id === message.id);
        if (!isDuplicate) {
          set({ messages: [...messages, message] });
        }
      }
    });

    socket.on('queueUpdated', () => {
      get().fetchQueue(token);
    });

    socket.on('chatUpdated', () => {
      get().fetchActiveChats(token);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));
