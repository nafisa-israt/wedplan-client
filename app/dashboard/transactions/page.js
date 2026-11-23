"use client";

import { useEffect, useState } from "react";
import { Loader2, Receipt } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function TransactionsPage() {
  const [data, setData] = useState({ transactions: [], totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/admin/transactions", { auth: true })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setError("");
    setReloadKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          Subscription payments made by vendors. These records are read-only.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-700">{error}</p>
          <Button className="mt-4" onClick={retry}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Total Transactions" value={data.transactions.length} icon={Receipt} />
            <StatCard
              label="Total Revenue"
              value={`$${data.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              icon={Receipt}
            />
          </div>

          {data.transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
              <Receipt className="h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Payments will appear here when vendors upgrade to Premium.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Vendor</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((t) => (
                    <tr key={t._id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{t.vendor?.name || "Unknown vendor"}</p>
                        <p className="text-xs text-muted-foreground">{t.vendor?.email}</p>
                      </td>
                      <td className="px-4 py-3 capitalize">{t.plan}</td>
                      <td className="px-4 py-3 font-medium">
                        {Number(t.amount).toFixed(2)} {String(t.currency || "usd").toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3">{formatShortDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}