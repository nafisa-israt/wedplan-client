"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Check, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

const freeFeatures = [
  "Maximum 3 active services",
  "Basic vendor dashboard",
  "Booking request management",
];

const premiumFeatures = [
  "Unlimited active services",
  "Premium Vendor badge",
  "All Free plan features",
];

function Feature({ text }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <Check className="h-4 w-4 text-primary" />
      {text}
    </li>
  );
}

export default function SubscriptionPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/stripe/status", { auth: true })
      .then((d) => {
        if (cancelled) return;
        setStatus(d);
        setError("");
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

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const data = await apiFetch("/api/stripe/checkout", { method: "POST", auth: true });
      if (!data?.url) throw new Error("Could not start the payment");
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || "Could not start the payment");
      setUpgrading(false);
    }
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

  if (!status) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPremium = status.plan === "premium";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">
          Your current plan:{" "}
          <span className="font-semibold capitalize text-primary">{status.plan}</span>
          {isPremium && status.expiresAt && (
            <>
              {" "}
              ({status.cancelAtPeriodEnd ? "ends" : "renews"} on {formatShortDate(status.expiresAt)})
            </>
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={`rounded-xl border bg-card p-6 ${!isPremium ? "border-primary" : ""}`}>
          <h2 className="text-xl font-semibold">Free Plan</h2>
          <p className="mt-1 text-3xl font-bold">$0</p>
          <ul className="mt-4 space-y-2">
            {freeFeatures.map((f) => (
              <Feature key={f} text={f} />
            ))}
          </ul>
          <Button variant="outline" className="mt-6 w-full" disabled>
            {isPremium ? "Free plan" : "Current plan"}
          </Button>
        </div>

        <div className={`rounded-xl border bg-card p-6 ${isPremium ? "border-primary" : ""}`}>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Premium Plan</h2>
            <BadgeCheck className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-1 text-3xl font-bold">
            $9.99<span className="text-sm font-normal text-muted-foreground"> / month</span>
          </p>
          <ul className="mt-4 space-y-2">
            {premiumFeatures.map((f) => (
              <Feature key={f} text={f} />
            ))}
          </ul>
          <Button
            className="mt-6 w-full"
            disabled={isPremium || upgrading}
            onClick={handleUpgrade}
          >
            {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPremium ? "Current plan" : upgrading ? "Redirecting to Stripe..." : "Upgrade to Premium"}
          </Button>
        </div>
      </div>
    </div>
  );
}