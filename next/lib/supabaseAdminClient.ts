// DANGER: This client can be used only in the Next.js backend side
// because it contains Supabase service key

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (supabaseUrl == null || supabaseServiceKey == null) {
  throw Error(`[Supabase] Failed initialize supabase admin client`);
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
