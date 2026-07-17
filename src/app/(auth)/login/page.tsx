import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-brand-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-brand-800">Shell Cafe CRM</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
