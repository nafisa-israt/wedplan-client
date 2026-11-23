"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, MapPin, PackageOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/vendor/services", { auth: true })
      .then((d) => {
        if (!cancelled) setServices(d.services);
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

  const toggleAvailability = async (service) => {
    setBusyId(service._id);
    try {
      const res = await apiFetch(`/api/vendor/services/${service._id}/availability`, {
        method: "PATCH",
        body: { isActive: !service.isActive },
        auth: true,
      });
      setServices((list) =>
        list.map((s) => (s._id === service._id ? { ...s, isActive: res.isActive } : s))
      );
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await apiFetch(`/api/vendor/services/${id}`, { method: "DELETE", auth: true });
      setServices((list) => list.filter((s) => s._id !== id));
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Services</h1>
          <p className="text-muted-foreground">Manage the services you offer.</p>
        </div>
        <Link href="/dashboard/add-service" className={buttonVariants()}>
          Add Service
        </Link>
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
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <PackageOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">You have not added any services yet</p>
          <Link href="/dashboard/add-service" className={buttonVariants()}>
            Add your first service
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div key={s._id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {s.images?.[0] && (
                  <img
                    src={s.images[0]}
                    alt={s.serviceName}
                    className="h-32 w-full rounded-lg object-cover sm:w-44"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{s.serviceName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        statusStyles[s.status] || ""
                      }`}
                    >
                      {s.status}
                    </span>
                    {!s.isActive && (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.category}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {s.location}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ${Number(s.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {expandedId === s._id && (
                <div className="mt-4 space-y-3 rounded-lg bg-muted/40 p-4 text-sm">
                  <p className="whitespace-pre-line">{s.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${s.serviceName} ${i + 1}`}
                        className="h-20 w-28 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                  {s.status === "rejected" && (
                    <p className="text-red-600">
                      This service was rejected and is not visible to customers.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                >
                  {expandedId === s._id ? "Hide Details" : "View Details"}
                </Button>
                <Link
                  href={`/dashboard/my-services/${s._id}/edit`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Edit
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyId === s._id || s.status === "rejected"}
                  onClick={() => toggleAvailability(s)}
                >
                  {s.isActive ? "Mark Unavailable" : "Mark Available"}
                </Button>

                {confirmId === s._id ? (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={busyId === s._id}
                      onClick={() => handleDelete(s._id)}
                    >
                      Yes, delete
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="destructive" size="sm" onClick={() => setConfirmId(s._id)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}