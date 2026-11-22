"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [serverInfo, setServerInfo] = useState("Checking with server...");

  useEffect(() => {
    if (!isPending && !session) router.replace("/signin");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    apiFetch("/api/me", { auth: true })
      .then((d) => setServerInfo(`Server verified: ${d.user.email} (${d.user.role})`))
      .catch((e) => setServerInfo(`Server error: ${e.message}`));
  }, [session]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { user } = session;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <p className="mt-2 text-muted-foreground">Email: {user.email}</p>
      <p className="text-muted-foreground">
        Role: <span className="font-semibold text-primary">{user.role}</span>
      </p>
      <p className="mt-4 rounded-md border bg-muted/40 p-3 text-sm">{serverInfo}</p>
    </div>
  );
}