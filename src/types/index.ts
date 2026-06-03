import type { Database } from "./supabase";

type Tables = Database["shell_cafe"]["Tables"];

export type Customer = Tables["customers"]["Row"];
export type CustomerInsert = Tables["customers"]["Insert"];
export type CustomerUpdate = Tables["customers"]["Update"];

export type Order = Tables["orders"]["Row"];
export type OrderInsert = Tables["orders"]["Insert"];
export type OrderUpdate = Tables["orders"]["Update"];

export type OrderItem = Tables["order_items"]["Row"];
export type OrderItemInsert = Tables["order_items"]["Insert"];

export type Product = Tables["products"]["Row"];
export type ProductInsert = Tables["products"]["Insert"];
export type ProductUpdate = Tables["products"]["Update"];

export type OrderStatus = Order["status"];
