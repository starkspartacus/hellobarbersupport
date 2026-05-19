export interface Ticket {
  id: string;
  clientName: string;
  clientInitials: string;
  clientType: "VIP Customer" | "Standard" | "Nouveau Client";
  subject: string;
  description: string;
  category: string;
  priority: "critical" | "high" | "normal";
  waitTime: string;
}

export const queueTickets: Ticket[] = [
  {
    id: "1",
    clientName: "Marie Dubois",
    clientInitials: "MS",
    clientType: "VIP Customer",
    subject: "Problème de facturation - Double prélèvement",
    description: "Le client signale avoir été débité deux fois pour son abonnement annuel ce matin.",
    category: "Billing",
    priority: "critical",
    waitTime: "12m 45s",
  },
  {
    id: "2",
    clientName: "Jean Lefèvre",
    clientInitials: "JL",
    clientType: "Standard",
    subject: "Connexion impossible au portail",
    description: "Erreur 500 lors de la tentative de connexion depuis l'application mobile iOS.",
    category: "Technique",
    priority: "high",
    waitTime: "5m 20s",
  },
  {
    id: "3",
    clientName: "Sophie Martin",
    clientInitials: "SM",
    clientType: "Nouveau Client",
    subject: "Information sur la politique de retour",
    description: "Souhaite connaître les délais exacts pour un retour produit sans frais.",
    category: "Question",
    priority: "normal",
    waitTime: "2m 10s",
  },
  {
    id: "4",
    clientName: "Antoine Laurent",
    clientInitials: "AL",
    clientType: "Standard",
    subject: "Demande de changement d'adresse d'expédition",
    description: "Commande #98234 pas encore expédiée, besoin urgent de modifier la livraison.",
    category: "Logistique",
    priority: "normal",
    waitTime: "1m 05s",
  }
];

export const queueStats = {
  criticalWait: 3,
  totalInQueue: 12,
  avgWaitTime: "4m 12s"
};
