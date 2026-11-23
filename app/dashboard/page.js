"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import VendorOverview from "@/components/dashboard/VendorOverview";
import CustomerOverview from "@/components/dashboard/CustomerOverview";

export default function DashboardOverviewPage() {
  const { me } = useDashboard();

  if (me.role === "vendor") return <VendorOverview />;
  if (me.role === "customer") return <CustomerOverview />;

  // Admin Overview পরের ধাপে আসবে
  return (
    <div className="rounded-xl border bg-card p-8">
      <h1 className="text-2xl font-bold">Welcome, {me.name}</h1>
      <p className="mt-2 text-muted-foreground">Your admin overview will appear here soon.</p>
    </div>
  );
}