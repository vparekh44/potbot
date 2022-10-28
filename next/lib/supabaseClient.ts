import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl == null || supabaseAnonKey == null) {
  throw Error(`[Supabase]: Failed initialize anon client for supabaseUrl: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
