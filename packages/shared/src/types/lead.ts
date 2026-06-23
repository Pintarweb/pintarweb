export interface Lead {
  id: string;
  phone_normalized: string;
  business_name: string;
  category?: string;
  address?: string;
  area?: string;
  niche?: string;
  maps_url?: string;
  source?: string;
  website_url?: string;
  has_website?: number;
  whatsapp_link?: string;
  instagram_handle?: string;
  instagram_active?: number;
  tiktok_active?: number;
  google_rating?: number;
  review_count?: number;
  status?: string;
  outreach_status?: string;
  lead_score?: number;
  audit_results?: string;
  ai_pain_point?: string;
  source_links?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
