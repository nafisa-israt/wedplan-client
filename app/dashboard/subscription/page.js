"use client";

import { useEffect, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Crown } from "lucide-react";

export default function SubscriptionPage() {
  const { me } = useDashboard();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/api/stripe/status", { auth: true })
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpgrade = async () => {
    setPaying(true);

    try {
      const data = await apiFetch("/api/stripe/checkout", {
        method: "POST",
        auth: true,
      });

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned");
      }

      window.location.assign(data.url);
    } catch (err) {
      toast.error(err.message);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPremium = status?.plan === "premium";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Subscription</h1>
        <p className="text-muted-foreground">
          Manage your WedPlan vendor subscription.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-xl font-bold">WedPlan Premium</h2>
            <p className="text-sm text-muted-foreground">
              More freedom to grow your wedding business.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            "Unlimited active services",
            "All Free plan features",
            "Premium vendor status",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 text-xl font-bold capitalize">
            {status?.plan || "free"}
          </p>

          {status?.expiresAt && (
            <p className="mt-1 text-sm text-muted-foreground">
              Expires: {new Date(status.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {isPremium ? (
          <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
            Your Premium subscription is active.
          </p>
        ) : (
          <Button
            className="mt-6 w-full"
            onClick={handleUpgrade}
            disabled={paying}
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              "Upgrade to Premium"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}