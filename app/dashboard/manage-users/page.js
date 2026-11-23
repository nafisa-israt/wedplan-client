"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, SearchX } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatShortDate } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/dashboard/StatusBadge";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [query, setQuery] = useState({ search: "", role: "all" });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [detail, setDetail] = useState(null);

  // টাইপ করার সময় একটু অপেক্ষা করে request পাঠায়
  useEffect(() => {
    const t = setTimeout(() => setQuery({ search, role }), 400);
    return () => clearTimeout(t);
  }, [search, role]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (query.search.trim()) params.set("search", query.search.trim());
    if (query.role !== "all") params.set("role", query.role);

    apiFetch(`/api/admin/users?${params.toString()}`, { auth: true })
      .then((d) => {
        if (cancelled) return;
        setUsers(d.users);
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

  const retry = () => {
    setLoading(true);
    setError("");
    setReloadKey((k) => k + 1);
  };

  const openDetails = async (id) => {
    setDetail({ loading: true });
    try {
      const d = await apiFetch(`/api/admin/users/${id}`, { auth: true });
      setDetail({ data: d.user });
    } catch (err) {
      setDetail(null);
      toast.error(err.message);
    }
  };

  const toggleBlock = async (u) => {
    setBusyId(u._id);
    try {
      const res = await apiFetch(`/api/admin/users/${u._id}/block`, {
        method: "PATCH",
        auth: true,
        body: { isBlocked: !u.isBlocked },
      });
      setUsers((list) =>
        list.map((x) => (x._id === u._id ? { ...x, isBlocked: res.isBlocked } : x))
      );
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const d = detail?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">View, search and block or unblock registered users.</p>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setLoading(true);
            setSearch(e.target.value);
          }}
          className="sm:col-span-2"
        />
        <select
          className={selectClass}
          value={role}
          onChange={(e) => {
            setLoading(true);
            setRole(e.target.value);
          }}
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
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
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={u.image || undefined} alt={u.name} />
                        <AvatarFallback>{u.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {u.role}
                    {u.role === "vendor" && u.subscriptionPlan === "premium" && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Premium
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                  </td>
                  <td className="px-4 py-3">{formatShortDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => openDetails(u._id)}>
                        Details
                      </Button>

                      {u.role !== "admin" &&
                        (confirmId === u._id ? (
                          <>
                            <Button
                              size="sm"
                              variant={u.isBlocked ? "default" : "destructive"}
                              disabled={busyId === u._id}
                              onClick={() => toggleBlock(u)}
                            >
                              Confirm
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant={u.isBlocked ? "default" : "destructive"}
                            onClick={() => setConfirmId(u._id)}
                          >
                            {u.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {detail.loading || !d ? (
              <div className="flex min-h-[10rem] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={d.image || undefined} alt={d.name} />
                    <AvatarFallback>{d.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold">{d.name}</p>
                    <p className="text-sm text-muted-foreground">{d.email}</p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="font-medium capitalize">{d.role}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>
                      <StatusBadge status={d.isBlocked ? "blocked" : "active"} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Joined</dt>
                    <dd className="font-medium">{formatShortDate(d.createdAt)}</dd>
                  </div>
                  {d.role === "vendor" && (
                    <>
                      <div>
                        <dt className="text-muted-foreground">Business</dt>
                        <dd className="font-medium">{d.businessName || "-"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Plan</dt>
                        <dd className="font-medium capitalize">{d.subscriptionPlan}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Services</dt>
                        <dd className="font-medium">{d.servicesCount}</dd>
                      </div>
                    </>
                  )}
                  {d.bookingsCount != null && (
                    <div>
                      <dt className="text-muted-foreground">Bookings</dt>
                      <dd className="font-medium">{d.bookingsCount}</dd>
                    </div>
                  )}
                </dl>

                <Button variant="outline" className="w-full" onClick={() => setDetail(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}