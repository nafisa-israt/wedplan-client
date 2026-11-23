"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Loader2, Package, Receipt, Store, UserRound, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export default function AdminOverview() {
  const { me } = useDashboard();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/stats", { auth: true })
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
        <p className="text-muted-foreground">Platform summary at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Registered Users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Total Vendors" value={stats.totalVendors} icon={Store} />
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={UserRound} />
        <StatCard label="Total Services" value={stats.totalServices} icon={Package} />
        <StatCard label="Pending Services" value={stats.pendingServices} icon={Clock} />
        <StatCard label="Total Transactions" value={stats.totalTransactions} icon={Receipt} />
      </div>

      {stats.pendingServices > 0 && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border bg-rose-50/60 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold">
              {stats.pendingServices} service(s) are waiting for your review
            </p>
            <p className="text-sm text-muted-foreground">
              Approve them so customers can see and book them.
            </p>
          </div>
          <Link href="/dashboard/manage-services" className={buttonVariants()}>
            Review Services
          </Link>
        </div>
      )}
    </div>
  );
}