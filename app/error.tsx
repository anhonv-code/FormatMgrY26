"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
      >
        Try again
      </button>
    </main>
  );
}
