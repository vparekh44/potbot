import { Database } from "./database.types";

export type ProfilesResponse = Database["public"]["Tables"]["profiles"];
export type Profile = ProfilesResponse["Row"];

export type DiscordIntegrationsResponse =
  Database["public"]["Tables"]["discord_integrations"];
export type DiscordIntegration = DiscordIntegrationsResponse["Row"];

export type ReactionsResponse = Database["public"]["Tables"]["reactions"];
export type Reaction = ReactionsResponse["Row"];

export type UsersResponse = Database["public"]["Tables"]["users"];
export type User = UsersResponse["Row"];

/* VIEW RPC */

export const TOP_EMOJIS_VIEW = "top_emoji_received" as const;
export const TOP_GIVERS_TO_USER_VIEW = "top_count_givers" as const;
