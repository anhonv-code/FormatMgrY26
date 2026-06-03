import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

const statusColors: Record<OrderStatus, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready:     "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, customers(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-600 text-sm">Failed to load orders: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors">
          New Order
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Order", "Customer", "Status", "Total", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders?.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-500">{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {(o.customers as { name: string } | null)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  ${(o.total / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
