"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import ServiceForm from "@/components/dashboard/ServiceForm";

export default function AddServicePage() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    await apiFetch("/api/vendor/services", { method: "POST", body: values, auth: true });
    toast.success("Service submitted! It will appear publicly after admin approval.");
    router.push("/dashboard/my-services");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Service</h1>
        <p className="text-muted-foreground">
          New services stay pending until an admin approves them.
        </p>
      </div>
      <ServiceForm submitLabel="Submit Service" onSubmit={handleSubmit} />
    </div>
  );
}