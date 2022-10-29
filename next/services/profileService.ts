import { supabase } from "../lib/supabaseClient";
import {
  Profile,
  TOP_EMOJIS_VIEW,
  TOP_GIVERS_TO_USER_VIEW,
} from "../model.types";

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
  profile: Profile;
  count: number;
}

export const getTopGiversToUser = async (user_id: string) => {
  const { data, error } = await supabase.rpc<"top_count_givers", TopGiver[]>(
    TOP_GIVERS_TO_USER_VIEW,
    {
      user_id,
    }
  );

  return { data, error };
};
