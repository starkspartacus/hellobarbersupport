export interface ActiveChat {
  id: string;
  customerName: string;
  initials: string;
  status: "now" | string;
  lastMessage: string;
  isActive: boolean;
  tags?: string[];
}

export const activeChatsList: ActiveChat[] = [
  {
    id: "c1",
    customerName: "Alex Rivera",
    initials: "AR",
    status: "Now",
    lastMessage: "I'm having trouble applying the discount...",
    isActive: true,
    tags: ["Billing", "Urgent"]
  },
  {
    id: "c2",
    customerName: "Sarah Jenkins",
    initials: "SJ",
    status: "5m",
    lastMessage: "Has my order shipped yet? Order #49201.",
    isActive: false
  },
  {
    id: "c3",
    customerName: "Maria Garcia",
    initials: "MG",
    status: "12m",
    lastMessage: "Thank you for resolving the issue yesterday.",
    isActive: false
  }
];

export interface ChatMessage {
  id: string;
  sender: "customer" | "agent" | "system";
  text: string;
  time: string;
  initials?: string;
}

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "system",
    text: "Chat started at 10:42 AM",
    time: ""
  },
  {
    id: "m2",
    sender: "customer",
    text: "Hello, I'm trying to check out but the promo code 'SAVE20' isn't applying to my cart.",
    time: "10:43 AM",
    initials: "AR"
  },
  {
    id: "m3",
    sender: "agent",
    text: "Hi Alex! I can certainly help you with that. Let me take a quick look at your cart.",
    time: "10:44 AM",
    initials: "JD"
  },
  {
    id: "m4",
    sender: "agent",
    text: "It looks like the items in your cart are already discounted during our current sale. The 'SAVE20' code unfortunately doesn't stack with existing promotions.",
    time: "10:45 AM · Read",
    initials: "JD"
  },
  {
    id: "m5",
    sender: "customer",
    text: "Ah, I see. Okay, that makes sense. Is there any free shipping code available instead?",
    time: "10:46 AM",
    initials: "AR"
  }
];

export const customerProfile = {
  name: "Alex Rivera",
  initials: "AR",
  memberSince: "2021",
  tags: ["VIP", "Tech Gadgets"],
  email: "alex.rivera@example.com",
  phone: "+1 (555) 123-4567",
  address: "1234 Silicon Valley Blvd\nSan Jose, CA 95131",
  recentOrders: [
    { id: "ORD-88392", status: "Delivered", desc: "Wireless Noise-Cancelling H...", date: "Oct 24, 2023", price: "$299.99" },
    { id: "ORD-87104", status: "Processing", desc: "Smart Home Hub V2", date: "Today", price: "$129.50" }
  ]
};
