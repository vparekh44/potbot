import { NextApiRequest, NextApiResponse } from "next";
import withJwtAuth from "../../../middleware/withJwtAuth";

/* Wrap to lib comp */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (supabaseUrl == null || supabaseServiceKey == null) {
  throw Error(`[Supabase] Failed initialize supabase admin client`);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function handler(req: NextApiRequest, res: NextApiResponse) {

  // JWT handling

  // insert supabase function to get information from the user
  const { data} = await supabaseAdmin
    .from("reactions")
    .select("sender_id, receiver_id, emoji, server_id")
    // .eq("id", achievementId)
    // .eq("owner_id", userId)
    // .single();

  console.log(data)

  // return the information about the user.
  res.status(200).json({ error: false });
}

export default handler;
