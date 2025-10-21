import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LikeRequest {
  id: string;
  user_id: string;
  uid: string;
  player_name: string;
  likes_before: number;
  likes_after: number;
  likes_added: number;
  status: number;
  response_data: any;
  created_at: string;
}

export interface AutoLike {
  id: string;
  uid: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string;
  created_at: string;
  created_by: string | null;
}

export interface AutoLikeHistory {
  id: string;
  auto_like_id: string | null;
  uid: string;
  player_name: string;
  likes_before: number;
  likes_after: number;
  likes_added: number;
  status: number;
  response_data: any;
  executed_at: string;
  sent_at: string;
  created_at: string;
  total_count?: number;
}
