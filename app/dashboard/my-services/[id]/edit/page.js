"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ServiceForm from "@/components/dashboard/ServiceForm";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiFetch(`/api/vendor/services/${id}`, { auth: true })
      .then((d) => !cancelled && setService(d.service))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    await apiFetch(`/api/vendor/services/${id}`, { method: "PUT", body: values, auth: true });
    toast.success("Service updated successfully");
    router.push("/dashboard/my-services");
  };

  if (error) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</p>;
  }
  if (!service) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Service</h1>
      <ServiceForm initial={service} submitLabel="Save Changes" onSubmit={handleSubmit} />
    </div>
  );
}