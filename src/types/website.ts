export type WebsiteStatus = "A attaquer" | "En cours" | "Attaqué";
export type WebsitePriority = "Basse" | "Moyenne" | "Haute";

export interface Website {
  id: string;
  url: string;
  status: WebsiteStatus;
  date_added: string;
  added_by: {
    username: string;
    avatar_url?: string;
  };
  notes?: string;
  priority: WebsitePriority;
  ecrie: boolean;
  user_name: string;
  avatar_url?: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
  dateAjout: string;
} 