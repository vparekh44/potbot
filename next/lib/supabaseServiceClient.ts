import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (supabaseUrl == null || supabaseServiceKey == null) {
  throw Error(`[Supabase] Failed initialize supabase service client`);
}

export const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
