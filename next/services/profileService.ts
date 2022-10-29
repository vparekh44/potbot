import { supabase } from "../lib/supabaseClient";
import { TOP_EMOJIS_VIEW, TOP_GIVERS_TO_USER_VIEW } from "../model.types";

export const getTopEmojisOnUser = async (user_id: string) => {
  const { data, error } = await supabase.rpc(TOP_EMOJIS_VIEW, { user_id });

  return { data, error };
};

export const getTopGiversToUser = async (user_id: string) => {
  const { data, error } = await supabase.rpc(TOP_GIVERS_TO_USER_VIEW, {
    user_id,
  });

  return { data, error };
};
