"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CalendarCheck, CircleCheck, Clock, Loader2, Package } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { buttonVariants, Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export default function VendorOverview() {
  const { me } = useDashboard();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/vendor/stats", { auth: true })
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

  const isPremium = stats.plan === "premium";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {me.name}</h1>
        <p className="text-muted-foreground">Here is a summary of your vendor account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value={stats.totalServices} icon={Package} />
        <StatCard label="Active Services" value={stats.activeServices} icon={CircleCheck} />
        <StatCard label="Pending Booking Requests" value={stats.pendingBookings} icon={Clock} />
        <StatCard label="Accepted Bookings" value={stats.acceptedBookings} icon={CalendarCheck} />
        <StatCard
          label="Current Plan"
          value={isPremium ? "Premium" : "Free"}
          icon={BadgeCheck}
        />
      </div>

      {!isPremium && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border bg-rose-50/60 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold">
              Free plan: {stats.activeServices} of {stats.freeLimit} active services used
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium to publish unlimited services.
            </p>
          </div>
          <Link href="/dashboard/subscription" className={buttonVariants()}>
            Upgrade to Premium
          </Link>
        </div>
      )}
    </div>
  );
}