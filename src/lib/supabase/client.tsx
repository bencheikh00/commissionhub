import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

<<<<<<< HEAD
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
=======
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export function createClient() {
  return supabase;
>>>>>>> d68099a (feat: CommissionHub v1.0 - Plateforme complète avec back-office admin)
}
