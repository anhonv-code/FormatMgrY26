import type { User } from "@supabase/supabase-js";
import SignOutButton from "./SignOutButton";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{user.email}</span>
        <SignOutButton />
      </div>
    </header>
  );
}
