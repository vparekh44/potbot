export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      discord_integrations: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          discord_id: string | null;
          token: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          discord_id?: string | null;
          token?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          discord_id?: string | null;
          token?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bio: string | null;
          image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          name: string;
          bio?: string | null;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          bio?: string | null;
          image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          emoji: string;
          server_id: string;
          message_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          sender_id: string;
          receiver_id: string;
          emoji: string;
          server_id: string;
          message_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          emoji?: string;
          server_id?: string;
          message_id?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          wallet_address: string;
          created_at: string;
          nonce: string;
        };
        Insert: {
          id: string;
          wallet_address: string;
          created_at?: string;
          nonce: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          created_at?: string;
          nonce?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      select_unique_guild_ids: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      top_count_givers: {
        Args: { user_id: string };
        Returns: Record<string, unknown>[];
      };
      top_emoji_received: {
        Args: { user_id: string };
        Returns: Record<string, unknown>[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
