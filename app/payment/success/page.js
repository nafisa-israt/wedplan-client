"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600" />

      <h1 className="mt-5 text-3xl font-bold">
        Payment Successful!
      </h1>

      <p className="mt-3 text-muted-foreground">
        Thank you for upgrading to WedPlan Premium. Your subscription will
        activate after Stripe confirms the payment.
      </p>

      <Link href="/dashboard/subscription" className="mt-6">
        <Button>View Subscription</Button>
      </Link>
    </div>
  );
}