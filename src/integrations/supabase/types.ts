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
      audit_logs: {
        Row: {
          action: string
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          timestamp: string | null
          user_id: number | null
        }
        Insert: {
          action: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          timestamp?: string | null
          user_id?: number | null
        }
        Update: {
          action?: string
          id?: never
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          timestamp?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coordinates: {
        Row: {
          created_at: string | null
          destination_country: string | null
          destination_latitude: number | null
          destination_longitude: number | null
          id: string
          origin_country: string | null
          origin_latitude: number | null
          origin_longitude: number | null
        }
        Insert: {
          created_at?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          id: string
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
        }
        Update: {
          created_at?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          id?: string
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
        }
        Relationships: []
      }
      deepcal_ubzte_weight_preferences: {
        Row: {
          cost_weight: number
          created_at: string
          id: number
          is_default: boolean | null
          reliability_weight: number
          service_weight: number
          sustainability_weight: number
          time_weight: number
          updated_at: string
          user_email: string
          weight_name: string
        }
        Insert: {
          cost_weight: number
          created_at?: string
          id?: number
          is_default?: boolean | null
          reliability_weight: number
          service_weight: number
          sustainability_weight: number
          time_weight: number
          updated_at?: string
          user_email: string
          weight_name: string
        }
        Update: {
          cost_weight?: number
          created_at?: string
          id?: number
          is_default?: boolean | null
          reliability_weight?: number
          service_weight?: number
          sustainability_weight?: number
          time_weight?: number
          updated_at?: string
          user_email?: string
          weight_name?: string
        }
        Relationships: []
      }
      forwarders: {
        Row: {
          active: boolean | null
          cost_rating: number | null
          created_at: string | null
          id: string
          name: string
          reliability_rating: number | null
          time_rating: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          cost_rating?: number | null
          created_at?: string | null
          id: string
          name: string
          reliability_rating?: number | null
          time_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          cost_rating?: number | null
          created_at?: string | null
          id?: string
          name?: string
          reliability_rating?: number | null
          time_rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      oracle_logs: {
        Row: {
          feedback_comments: string | null
          feedback_score: number | null
          has_table: boolean | null
          id: string
          model_version: string | null
          oracle_response: string
          timestamp: string | null
          user_query: string
        }
        Insert: {
          feedback_comments?: string | null
          feedback_score?: number | null
          has_table?: boolean | null
          id?: string
          model_version?: string | null
          oracle_response: string
          timestamp?: string | null
          user_query: string
        }
        Update: {
          feedback_comments?: string | null
          feedback_score?: number | null
          has_table?: boolean | null
          id?: string
          model_version?: string | null
          oracle_response?: string
          timestamp?: string | null
          user_query?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: number
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: never
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: never
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      request_reference: {
        Row: {
          sn: number | null
        }
        Insert: {
          sn?: number | null
        }
        Update: {
          sn?: number | null
        }
        Relationships: []
      }
      shipment_audit_log: {
        Row: {
          description: string | null
          event_type: string | null
          id: string
          shipment_id: string | null
          timestamp: string | null
        }
        Insert: {
          description?: string | null
          event_type?: string | null
          id?: string
          shipment_id?: string | null
          timestamp?: string | null
        }
        Update: {
          description?: string | null
          event_type?: string | null
          id?: string
          shipment_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_audit_log_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          actual_delivery_date: string | null
          created_at: string | null
          delivery_status: string | null
          destination_country: string | null
          destination_latitude: number | null
          destination_longitude: number | null
          estimated_delivery_date: string | null
          freight_carrier: string | null
          id: string
          mode_of_shipment: string | null
          origin_country: string | null
          origin_latitude: number | null
          origin_longitude: number | null
          priority: string | null
          recommended_forwarder: string | null
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string | null
          delivery_status?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          estimated_delivery_date?: string | null
          freight_carrier?: string | null
          id: string
          mode_of_shipment?: string | null
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
          priority?: string | null
          recommended_forwarder?: string | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string | null
          delivery_status?: string | null
          destination_country?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          estimated_delivery_date?: string | null
          freight_carrier?: string | null
          id?: string
          mode_of_shipment?: string | null
          origin_country?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
          priority?: string | null
          recommended_forwarder?: string | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      training_logs: {
        Row: {
          accuracy: number
          data_size: number
          id: string
          model_version: string
          notes: string | null
          parameters: Json | null
          timestamp: string | null
        }
        Insert: {
          accuracy: number
          data_size: number
          id?: string
          model_version: string
          notes?: string | null
          parameters?: Json | null
          timestamp?: string | null
        }
        Update: {
          accuracy?: number
          data_size?: number
          id?: string
          model_version?: string
          notes?: string | null
          parameters?: Json | null
          timestamp?: string | null
        }
        Relationships: []
      }
      voice_training_log: {
        Row: {
          agent_id: string
          agent_response: string | null
          created_at: string | null
          feedback_comments: string | null
          feedback_score: number | null
          id: string
          session_id: string | null
          symbolic_insight_id: string | null
          timestamp: string | null
          user_message: string | null
        }
        Insert: {
          agent_id: string
          agent_response?: string | null
          created_at?: string | null
          feedback_comments?: string | null
          feedback_score?: number | null
          id?: string
          session_id?: string | null
          symbolic_insight_id?: string | null
          timestamp?: string | null
          user_message?: string | null
        }
        Update: {
          agent_id?: string
          agent_response?: string | null
          created_at?: string | null
          feedback_comments?: string | null
          feedback_score?: number | null
          id?: string
          session_id?: string | null
          symbolic_insight_id?: string | null
          timestamp?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          cloud_cover: number | null
          humidity: number | null
          id: string
          latitude: number
          longitude: number
          precipitation: number | null
          temperature: number | null
          timestamp: string | null
          visibility: number | null
          weather_description: string | null
          weather_main: string | null
          wind_speed: number | null
        }
        Insert: {
          cloud_cover?: number | null
          humidity?: number | null
          id?: string
          latitude: number
          longitude: number
          precipitation?: number | null
          temperature?: number | null
          timestamp?: string | null
          visibility?: number | null
          weather_description?: string | null
          weather_main?: string | null
          wind_speed?: number | null
        }
        Update: {
          cloud_cover?: number | null
          humidity?: number | null
          id?: string
          latitude?: number
          longitude?: number
          precipitation?: number | null
          temperature?: number | null
          timestamp?: string | null
          visibility?: number | null
          weather_description?: string | null
          weather_main?: string | null
          wind_speed?: number | null
        }
        Relationships: []
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
