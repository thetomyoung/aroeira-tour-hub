export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      awards: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          kind: string
          player_id: string | null
          round_no: number
          value: number | null
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          kind: string
          player_id?: string | null
          round_no?: number
          value?: number | null
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          kind?: string
          player_id?: string | null
          round_no?: number
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      fixtures: {
        Row: {
          created_at: string
          format: string
          id: string
          result: string | null
          round_no: number
          side_a: string[]
          side_b: string[]
          sort_order: number
          tee_time: string | null
        }
        Insert: {
          created_at?: string
          format?: string
          id?: string
          result?: string | null
          round_no?: number
          side_a?: string[]
          side_b?: string[]
          sort_order?: number
          tee_time?: string | null
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          result?: string | null
          round_no?: number
          side_a?: string[]
          side_b?: string[]
          sort_order?: number
          tee_time?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          trip_year: number
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          trip_year?: number
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          trip_year?: number
          url?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          current_form: string
          driving_distance: number
          favourite_club: string
          handicap: number
          handicap_index: number
          id: string
          name: string
          photo_url: string | null
          previous_wins: number
          ryder_record: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          current_form?: string
          driving_distance?: number
          favourite_club?: string
          handicap?: number
          handicap_index?: number
          id?: string
          name: string
          photo_url?: string | null
          previous_wins?: number
          ryder_record?: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          current_form?: string
          driving_distance?: number
          favourite_club?: string
          handicap?: number
          handicap_index?: number
          id?: string
          name?: string
          photo_url?: string | null
          previous_wins?: number
          ryder_record?: string
          sort_order?: number
        }
        Relationships: []
      }
      scores: {
        Row: {
          created_at: string
          gross: number
          hole: number
          id: string
          player_id: string
          round_no: number
        }
        Insert: {
          created_at?: string
          gross: number
          hole: number
          id?: string
          player_id: string
          round_no: number
        }
        Update: {
          created_at?: string
          gross?: number
          hole?: number
          id?: string
          player_id?: string
          round_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          is_captain: boolean
          player_id: string
          team: string
        }
        Insert: {
          id?: string
          is_captain?: boolean
          player_id: string
          team: string
        }
        Update: {
          id?: string
          is_captain?: boolean
          player_id?: string
          team?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
