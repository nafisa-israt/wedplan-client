"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import VendorOverview from "@/components/dashboard/VendorOverview";
import CustomerOverview from "@/components/dashboard/CustomerOverview";
import AdminOverview from "@/components/dashboard/AdminOverview";

export default function DashboardOverviewPage() {
  const { me } = useDashboard();

  if (me.role === "vendor") return <VendorOverview />;
  if (me.role === "admin") return <AdminOverview />;
  return <CustomerOverview />;
}