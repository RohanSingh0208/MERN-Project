import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Habit = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  target_frequency: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes: string;
  created_at: string;
};
