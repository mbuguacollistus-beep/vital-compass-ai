export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      care_network: {
        Row: {
          access_level: string
          caregiver_id: string
          expires_at: string | null
          granted_at: string
          id: string
          patient_id: string
          relationship: string
        }
        Insert: {
          access_level: string
          caregiver_id: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          patient_id: string
          relationship: string
        }
        Update: {
          access_level?: string
          caregiver_id?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          patient_id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_network_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          allergens: string[] | null
          category: string
          created_at: string
          dietary_restrictions: string[] | null
          health_benefits: string[] | null
          id: string
          name: string
          nutritional_info: Json | null
        }
        Insert: {
          allergens?: string[] | null
          category: string
          created_at?: string
          dietary_restrictions?: string[] | null
          health_benefits?: string[] | null
          id?: string
          name: string
          nutritional_info?: Json | null
        }
        Update: {
          allergens?: string[] | null
          category?: string
          created_at?: string
          dietary_restrictions?: string[] | null
          health_benefits?: string[] | null
          id?: string
          name?: string
          nutritional_info?: Json | null
        }
        Relationships: []
      }
      food_recommendations: {
        Row: {
          created_at: string
          date_recommended: string
          dietary_goals: string[] | null
          id: string
          is_favorite: boolean | null
          meal_type: string | null
          patient_id: string
          patient_rating: number | null
          reasoning: string | null
          recommendation_type: string
          recommended_foods: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_recommended?: string
          dietary_goals?: string[] | null
          id?: string
          is_favorite?: boolean | null
          meal_type?: string | null
          patient_id: string
          patient_rating?: number | null
          reasoning?: string | null
          recommendation_type: string
          recommended_foods: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_recommended?: string
          dietary_goals?: string[] | null
          id?: string
          is_favorite?: boolean | null
          meal_type?: string | null
          patient_id?: string
          patient_rating?: number | null
          reasoning?: string | null
          recommendation_type?: string
          recommended_foods?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_recommendations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_providers: {
        Row: {
          created_at: string
          department: string | null
          hospital_id: string | null
          id: string
          license_number: string
          specialty: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          hospital_id?: string | null
          id?: string
          license_number: string
          specialty?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          hospital_id?: string | null
          id?: string
          license_number?: string
          specialty?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "healthcare_providers_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      medical_visits: {
        Row: {
          created_at: string
          diagnosis: string | null
          hospital_id: string | null
          id: string
          patient_id: string
          provider_id: string | null
          reason_code: string | null
          treatment_notes: string | null
          updated_at: string
          visit_date: string
          visit_type: string
          vitals: Json | null
        }
        Insert: {
          created_at?: string
          diagnosis?: string | null
          hospital_id?: string | null
          id?: string
          patient_id: string
          provider_id?: string | null
          reason_code?: string | null
          treatment_notes?: string | null
          updated_at?: string
          visit_date: string
          visit_type: string
          vitals?: Json | null
        }
        Update: {
          created_at?: string
          diagnosis?: string | null
          hospital_id?: string | null
          id?: string
          patient_id?: string
          provider_id?: string | null
          reason_code?: string | null
          treatment_notes?: string | null
          updated_at?: string
          visit_date?: string
          visit_type?: string
          vitals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_visits_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_visits_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "healthcare_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_logs: {
        Row: {
          calories_consumed: number | null
          created_at: string
          date_consumed: string
          food_consumed: Json
          id: string
          meal_type: string
          notes: string | null
          patient_id: string
        }
        Insert: {
          calories_consumed?: number | null
          created_at?: string
          date_consumed?: string
          food_consumed: Json
          id?: string
          meal_type: string
          notes?: string | null
          patient_id: string
        }
        Update: {
          calories_consumed?: number | null
          created_at?: string
          date_consumed?: string
          food_consumed?: Json
          id?: string
          meal_type?: string
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          allergies: string[] | null
          created_at: string
          current_medications: string[] | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          medical_conditions: string[] | null
          patient_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          current_medications?: string[] | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          medical_conditions?: string[] | null
          patient_number?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          current_medications?: string[] | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          medical_conditions?: string[] | null
          patient_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          hospital_id: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          hospital_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          hospital_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      wellbeing_entries: {
        Row: {
          created_at: string
          date_recorded: string
          id: string
          notes: string | null
          patient_id: string
          score: number
          symptoms: string | null
        }
        Insert: {
          created_at?: string
          date_recorded?: string
          id?: string
          notes?: string | null
          patient_id: string
          score: number
          symptoms?: string | null
        }
        Update: {
          created_at?: string
          date_recorded?: string
          id?: string
          notes?: string | null
          patient_id?: string
          score?: number
          symptoms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wellbeing_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "patient" | "doctor" | "nurse" | "hospital_admin" | "caregiver"
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
    Enums: {
      user_role: ["patient", "doctor", "nurse", "hospital_admin", "caregiver"],
    },
  },
} as const
