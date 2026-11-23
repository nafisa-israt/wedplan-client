"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarX, Loader2, MapPin } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatEventDate, formatShortDate } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/bookings/my", { auth: true })
      .then((d) => {
        if (!cancelled) setBookings(d.bookings);
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

  const handleCancel = async (id) => {
    setBusyId(id);
    try {
      const res = await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH", auth: true });
      setBookings((list) => list.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
      setReloadKey((k) => k + 1);
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Track the booking requests you have sent.</p>
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
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <CalendarX className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">You have no booking requests yet</p>
          <Link href="/services" className={buttonVariants()}>
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {b.service?.image ? (
                  <img
                    src={b.service.image}
                    alt={b.service.name}
                    className="h-28 w-full rounded-lg object-cover sm:w-40"
                  />
                ) : (
                  <div className="h-28 w-full rounded-lg bg-muted sm:w-40" />
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{b.service?.name || "Service no longer available"}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">Vendor: {b.vendor?.name || "Unknown"}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Event date:</span>{" "}
                    {formatEventDate(b.eventDate)}
                  </p>
                  <p className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> {b.eventLocation}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested on {formatShortDate(b.createdAt)}
                  </p>
                </div>
              </div>

              {expandedId === b._id && (
                <div className="mt-4 space-y-1 rounded-lg bg-muted/40 p-4 text-sm">
                  <p>
                    <span className="font-medium">Your message:</span>{" "}
                    {b.message || "No message provided"}
                  </p>
                  {b.service?.category && (
                    <p>
                      <span className="font-medium">Category:</span> {b.service.category}
                    </p>
                  )}
                  {b.service?.price != null && (
                    <p>
                      <span className="font-medium">Service price:</span> $
                      {Number(b.service.price).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === b._id ? null : b._id)}
                >
                  {expandedId === b._id ? "Hide Details" : "View Details"}
                </Button>

                {b.status === "pending" &&
                  (confirmId === b._id ? (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busyId === b._id}
                        onClick={() => handleCancel(b._id)}
                      >
                        {busyId === b._id ? "Cancelling..." : "Yes, cancel"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                        Keep it
                      </Button>
                    </>
                  ) : (
                    <Button variant="destructive" size="sm" onClick={() => setConfirmId(b._id)}>
                      Cancel Request
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}