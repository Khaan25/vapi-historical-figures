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
      historicalFigures: {
        Row: {
          bio: string
          category: Database["public"]["Enums"]["categories"]
          createdAt: string
          dateOfBirth: string
          dateOfDeath: string
          description: string
          id: string
          imageUrl: string
          name: string
          notableWork: string
        }
        Insert: {
          bio: string
          category: Database["public"]["Enums"]["categories"]
          createdAt?: string
          dateOfBirth: string
          dateOfDeath: string
          description: string
          id?: string
          imageUrl: string
          name: string
          notableWork: string
        }
        Update: {
          bio?: string
          category?: Database["public"]["Enums"]["categories"]
          createdAt?: string
          dateOfBirth?: string
          dateOfDeath?: string
          description?: string
          id?: string
          imageUrl?: string
          name?: string
          notableWork?: string
        }
        Relationships: []
      }
      quizQuestions: {
        Row: {
          created_at: string | null
          historicalFigureId: string
          id: string
          question: string
          quizId: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          historicalFigureId: string
          id?: string
          question: string
          quizId?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          historicalFigureId?: string
          id?: string
          question?: string
          quizId?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_historical_figure_id_fkey"
            columns: ["historicalFigureId"]
            isOneToOne: false
            referencedRelation: "historicalFigures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizQuestions_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          historicalFigureId: string
          id: string
          type: Database["public"]["Enums"]["quizType"]
          updated_at: string | null
          userId: string
        }
        Insert: {
          created_at?: string | null
          historicalFigureId: string
          id?: string
          type: Database["public"]["Enums"]["quizType"]
          updated_at?: string | null
          userId: string
        }
        Update: {
          created_at?: string | null
          historicalFigureId?: string
          id?: string
          type?: Database["public"]["Enums"]["quizType"]
          updated_at?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_historicalFigureId_fkey"
            columns: ["historicalFigureId"]
            isOneToOne: false
            referencedRelation: "historicalFigures"
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
      categories:
        | "scientists"
        | "artists"
        | "philosophers"
        | "leaders"
        | "others"
      difficulty_type: "easy" | "medium" | "hard"
      mood_type: "positive" | "neutral" | "negative"
      quizType: "ai" | "manual"
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
    Enums: {
      categories: [
        "scientists",
        "artists",
        "philosophers",
        "leaders",
        "others",
      ],
      difficulty_type: ["easy", "medium", "hard"],
      mood_type: ["positive", "neutral", "negative"],
      quizType: ["ai", "manual"],
    },
  },
} as const
