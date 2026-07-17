export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  shell_cafe: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string | null;
          phone: string | null;
          notes: string | null;
          loyalty_points: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          loyalty_points?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          loyalty_points?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          customer_id: string;
          status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
          total: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          customer_id: string;
          status?: "pending" | "preparing" | "ready" | "completed" | "cancelled";
          total: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          customer_id?: string;
          status?: "pending" | "preparing" | "ready" | "completed" | "cancelled";
          total?: number;
          notes?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
        };
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          is_available: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description?: string | null;
          price: number;
          category: string;
          is_available?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          is_available?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
