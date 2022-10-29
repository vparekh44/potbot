import { supabase } from "../lib/supabaseClient";
import { Database } from "../database.types";
import {
  Profile,
  TOP_EMOJIS_VIEW,
  TOP_GIVERS_TO_USER_VIEW,
} from "../model.types";

export const getTopEmojisOnUser = async (user_id: string) => {
  const { data, error } = await supabase.rpc(TOP_EMOJIS_VIEW, { user_id });

  return { data, error };
};

interface TopGiver {
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

  debugger;

  return { data, error };
};
