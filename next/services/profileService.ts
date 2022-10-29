import { supabase } from "../lib/supabaseClient";
import { TOP_EMOJIS_VIEW } from "../model.types";

export const getTopEmojisOnUser = async (user_id: string) => {
  const { data, error } = await supabase.functions.invoke(TOP_EMOJIS_VIEW, {
    body: { user_id },
  });

  return { data, error };
};

export const getTopGiversToUser = async (user_id: string) => {
  const { data, error } = await supabase.functions.invoke(TOP_EMOJIS_VIEW, {
    body: { user_id },
  });

  return { data, error };
};
