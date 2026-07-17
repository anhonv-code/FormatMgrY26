import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    return <p className="text-red-600 text-sm">Failed to load products: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors">
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-400 py-8">No products yet.</p>
        )}
        {products?.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{p.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {p.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
            {p.description && (
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{p.description}</p>
            )}
            <p className="mt-3 text-lg font-bold text-brand-700">
              ${(p.price / 100).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
