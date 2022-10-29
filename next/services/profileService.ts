import { supabase } from "../lib/supabaseClient";
import { TOP_EMOJIS_VIEW, TOP_GIVERS_TO_USER_VIEW } from "../model.types";

export interface TopEmoji {
  emoji: string;
  count: number;
}

export const getTopEmojisOnUser = async (user_id: string) => {
  const { data, error } = await supabase.rpc<"top_emoji_received", TopEmoji[]>(
    TOP_EMOJIS_VIEW,
    { user_id }
  );

  return { data, error };
};

export interface TopGiver {
  giver_name: string;
  giver_image: string;
  giver_wallet: string;
  count: number;
}

export const getTopGiversToUser = async (target_id: string) => {
  const { data, error } = await supabase.rpc<"top_count_givers", TopGiver[]>(
    TOP_GIVERS_TO_USER_VIEW,
    {
      target_id,
    }
  );

  return { data, error };
};
