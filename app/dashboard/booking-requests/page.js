"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inbox, Loader2, MapPin } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatEventDate, formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/vendor/bookings", { auth: true })
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

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await apiFetch(`/api/vendor/bookings/${id}/status`, {
        method: "PATCH",
        body: { status },
        auth: true,
      });
      setBookings((list) => list.map((b) => (b._id === id ? { ...b, status } : b)));
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
      setReloadKey((k) => k + 1);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Booking Requests</h1>
        <p className="text-muted-foreground">Review requests sent by customers for your services.</p>
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
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">No booking requests yet</p>
          <p className="text-sm text-muted-foreground">
            Requests will appear here once customers book your approved services.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={b.customer?.image || undefined} alt={b.customer?.name} />
                    <AvatarFallback>{b.customer?.name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{b.customer?.name || "Unknown customer"}</p>
                    <p className="text-sm text-muted-foreground">{b.customer?.email}</p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Service:</span>{" "}
                  <span className="font-medium">{b.service?.name || "Deleted service"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Event date:</span>{" "}
                  {formatEventDate(b.eventDate)}
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> {b.eventLocation}
                </p>
                <p className="text-muted-foreground">Requested on {formatShortDate(b.createdAt)}</p>
              </div>

              <p className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">
                <span className="font-medium">Customer message:</span>{" "}
                {b.message || "No message provided"}
              </p>

              {b.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" disabled={busyId === b._id} onClick={() => updateStatus(b._id, "accepted")}>
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busyId === b._id}
                    onClick={() => updateStatus(b._id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}