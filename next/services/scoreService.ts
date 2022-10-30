import { supabase } from "../lib/supabaseClient";
const emojiUnicode = require("emoji-unicode");

export const getUserReactionsReceived = async (user_id: string) => {
  const { data: discordData, error: discordError } = await supabase
    .from("discord_integrations")
    .select("discord_id")
    .eq("user_id", user_id)
    .single();

  if (!discordError && discordData) {
    const { data, error } = await supabase
      .from("reactions")
      .select("emoji")
      .eq("receiver_id", discordData.discord_id);

    if (!error && data) {
      const emojis = data.map((info) => info.emoji);
      const score = scoreCalculator(emojis);
      return score;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export const scoreCalculator = (emojiList: string[]) => {
  let value = 0;
  for (let emoji of emojiList) {
    if (emojiUnicode(emoji) == "1f44d") {
      value++;
    } else if (emojiUnicode(emoji) == "1f44e") {
      value--;
    }
  }
  return value;
};
