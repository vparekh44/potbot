import { supabase } from "../lib/supabaseClient";
import { ReactionsResponse } from "../model.types";

export const getEmojisFromDb = async () => {
  const { data, error } = await supabase
    .from<"reactions", ReactionsResponse>("reactions")
    .select("*");

  return { data, error };
};
