"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CircleCheck, CircleX, ClipboardList, Clock, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export default function CustomerOverview() {
  const { me } = useDashboard();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/bookings/stats", { auth: true })
      .then((d) => {
        if (!cancelled) setStats(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setError("");
    setReloadKey((k) => k + 1);
  };

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-700">{error}</p>
        <Button className="mt-4" onClick={retry}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {me.name}</h1>
        <p className="text-muted-foreground">Here is a summary of your booking requests.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Booking Requests" value={stats.total} icon={ClipboardList} />
        <StatCard label="Pending Bookings" value={stats.pending} icon={Clock} />
        <StatCard label="Accepted Bookings" value={stats.accepted} icon={CircleCheck} />
        <StatCard label="Rejected Bookings" value={stats.rejected} icon={CircleX} />
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border bg-rose-50/60 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <CalendarCheck className="h-4 w-4 text-primary" /> Planning your wedding?
          </p>
          <p className="text-sm text-muted-foreground">
            Browse trusted vendors and send booking requests.
          </p>
        </div>
        <Link href="/services" className={buttonVariants()}>
          Browse Services
        </Link>
      </div>
    </div>
  );
}