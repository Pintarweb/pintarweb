export interface HuntLog {
  id: string;
  category?: string;
  location?: string;
  sources?: string;
  max_leads?: number;
  leads_found?: number;
  created_at?: string;
}
