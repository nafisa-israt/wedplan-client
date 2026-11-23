"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, MapPin, SearchX } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/dashboard/StatusBadge";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function ManageServicesPage() {
  const [filters, setFilters] = useState({ search: "", status: "all", category: "all" });
  const [query, setQuery] = useState(filters);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setQuery(filters), 400);
    return () => clearTimeout(t);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (query.search.trim()) params.set("search", query.search.trim());
    if (query.status !== "all") params.set("status", query.status);
    if (query.category !== "all") params.set("category", query.category);

    apiFetch(`/api/admin/services?${params.toString()}`, { auth: true })
      .then((d) => {
        if (cancelled) return;
        setServices(d.services);
        setError("");
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
  }, [query, reloadKey]);

  const updateFilter = (name, value) => {
    setLoading(true);
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const retry = () => {
    setLoading(true);
    setError("");
    setReloadKey((k) => k + 1);
  };

  const changeStatus = async (id, status) => {
    setBusyId(id);
    try {
      const res = await apiFetch(`/api/admin/services/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
      });
      setServices((list) => list.map((s) => (s._id === id ? { ...s, status } : s)));
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
      await apiFetch(`/api/admin/services/${id}`, { method: "DELETE", auth: true });
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
      <div>
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <p className="text-muted-foreground">
          Review pending services and manage everything published on the platform.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
        <Input
          placeholder="Search by service name"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <select
          className={selectClass}
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          className={selectClass}
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">No services found</p>
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
                    className="h-28 w-full rounded-lg object-cover sm:w-40"
                  />
                )}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{s.serviceName}</h3>
                    <StatusBadge status={s.status} />
                    {!s.isActive && (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.category}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Vendor:</span>{" "}
                    {s.vendor?.name || "Unknown"}{" "}
                    <span className="text-xs text-muted-foreground">({s.vendor?.email})</span>
                  </p>
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
                <Button
                  size="sm"
                  disabled={busyId === s._id || s.status === "approved"}
                  onClick={() => changeStatus(s._id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === s._id || s.status === "rejected"}
                  onClick={() => changeStatus(s._id, "rejected")}
                >
                  {s.status === "approved" ? "Unpublish (Reject)" : "Reject"}
                </Button>

                {confirmId === s._id ? (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === s._id}
                      onClick={() => handleDelete(s._id)}
                    >
                      Yes, delete
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="destructive" onClick={() => setConfirmId(s._id)}>
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