export interface HistoryItem {
  id: string;
  clientName: string;
  ticketId: string;
  issue: string;
  initials: string;
  status: "Clos" | string;
  date: string;
  description: string;
  duration: string;
  agentName: string;
  colorClass: string;
}

export const historyItems: HistoryItem[] = [
  {
    id: "h1",
    clientName: "Acme Corp",
    ticketId: "#8924",
    issue: "Login Issue",
    initials: "AC",
    status: "Clos",
    date: "Oct 24, 14:30",
    description: "Client was unable to access the dashboard after password reset. Guided through clearing browser cache and re-issuing reset link. Issue resolved successfully.",
    duration: "14 mins",
    agentName: "Me",
    colorClass: "bg-secondary-container text-on-secondary-container"
  },
  {
    id: "h2",
    clientName: "GlobalTech",
    ticketId: "#8911",
    issue: "Billing Inquiry",
    initials: "GT",
    status: "Clos",
    date: "Oct 24, 11:15",
    description: "Question regarding pro-rated charges on the October invoice. Explained the mid-month tier upgrade calculations. Sent detailed PDF breakdown.",
    duration: "8 mins",
    agentName: "Sarah J.",
    colorClass: "bg-tertiary-container text-on-tertiary-container"
  },
  {
    id: "h3",
    clientName: "Widget Ltd",
    ticketId: "#8890",
    issue: "API Rate Limits",
    initials: "WL",
    status: "Clos",
    date: "Oct 23, 16:45",
    description: "Client hitting rate limits prematurely. Identified bug in their retry logic causing spike in requests. Provided documentation on exponential backoff implementation.",
    duration: "32 mins",
    agentName: "Me",
    colorClass: "bg-primary-container text-on-primary-container"
  }
];
