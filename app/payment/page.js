import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <XCircle className="h-16 w-16 text-red-500" />

      <h1 className="mt-5 text-3xl font-bold">
        Payment Cancelled
      </h1>

      <p className="mt-3 text-muted-foreground">
        Your payment was not completed. You can try again whenever you are ready.
      </p>

      <Link href="/dashboard/subscription" className="mt-6">
        <Button>Back to Subscription</Button>
      </Link>
    </div>
  );
}