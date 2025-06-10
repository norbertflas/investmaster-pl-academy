export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievement_definitions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rarity: string | null
          requirements: Json | null
          reward_badge: string | null
          reward_xp: number | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rarity?: string | null
          requirements?: Json | null
          reward_badge?: string | null
          reward_xp?: number | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string | null
          requirements?: Json | null
          reward_badge?: string | null
          reward_xp?: number | null
          title?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          earned_at: string
          id: string
          user_id: string
          xp_reward: number | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          earned_at?: string
          id?: string
          user_id: string
          xp_reward?: number | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          earned_at?: string
          id?: string
          user_id?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          asset_class: string | null
          category: string
          content: Json
          created_at: string
          description: string | null
          difficulty_level: string | null
          id: string
          market: string | null
          title: string
          updated_at: string
        }
        Insert: {
          asset_class?: string | null
          category: string
          content: Json
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          market?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          asset_class?: string | null
          category?: string
          content?: Json
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          market?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_hours: number | null
          id: string
          is_premium: boolean | null
          order_index: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          is_premium?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          is_premium?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_news: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          impact_level: string | null
          published_at: string | null
          relevant_symbols: string[] | null
          sentiment: string | null
          source: string | null
          summary: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          impact_level?: string | null
          published_at?: string | null
          relevant_symbols?: string[] | null
          sentiment?: string | null
          source?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          impact_level?: string | null
          published_at?: string | null
          relevant_symbols?: string[] | null
          sentiment?: string | null
          source?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          order_index: number | null
          quiz_questions: Json | null
          title: string
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          order_index?: number | null
          quiz_questions?: Json | null
          title: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          order_index?: number | null
          quiz_questions?: Json | null
          title?: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data_cache: {
        Row: {
          created_at: string | null
          data: Json
          data_type: string
          expires_at: string
          id: string
          symbol: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          data_type: string
          expires_at: string
          id?: string
          symbol: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          data_type?: string
          expires_at?: string
          id?: string
          symbol?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          experience_level: string | null
          first_name: string | null
          id: string
          investment_goals: string[] | null
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          experience_level?: string | null
          first_name?: string | null
          id: string
          investment_goals?: string[] | null
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          experience_level?: string | null
          first_name?: string | null
          id?: string
          investment_goals?: string[] | null
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_portfolios: {
        Row: {
          cash: number | null
          created_at: string | null
          id: string
          name: string
          positions: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cash?: number | null
          created_at?: string | null
          id?: string
          name?: string
          positions?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cash?: number | null
          created_at?: string | null
          id?: string
          name?: string
          positions?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string | null
          module_id: string
          score: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          module_id: string
          score?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string | null
          module_id?: string
          score?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          certificates_earned: number | null
          id: string
          last_activity: string | null
          level: number | null
          modules_completed: number | null
          streak_days: number | null
          total_xp: number | null
          user_id: string
        }
        Insert: {
          certificates_earned?: number | null
          id?: string
          last_activity?: string | null
          level?: number | null
          modules_completed?: number | null
          streak_days?: number | null
          total_xp?: number | null
          user_id: string
        }
        Update: {
          certificates_earned?: number | null
          id?: string
          last_activity?: string | null
          level?: number | null
          modules_completed?: number | null
          streak_days?: number | null
          total_xp?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_level: {
        Args: { total_xp: number }
        Returns: number
      }
      check_achievements: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      clean_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_stats: {
        Args: {
          p_user_id: string
          p_xp_gained?: number
          p_lesson_completed?: boolean
          p_course_completed?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
