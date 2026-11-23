"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Loader2,
  Package,
  PlusCircle,
  Receipt,
  ShieldOff,
  UserCog,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DashboardContext } from "@/components/dashboard/DashboardContext";

const overview = { href: "/dashboard", label: "Overview", icon: LayoutDashboard };
const profile = { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog };

const navByRole = {
  vendor: [
    overview,
    { href: "/dashboard/my-services", label: "My Services", icon: Package },
    { href: "/dashboard/add-service", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/booking-requests", label: "Booking Requests", icon: CalendarCheck },
    { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
    profile,
  ],
  customer: [
    overview,
    { href: "/dashboard/my-bookings", label: "My Bookings", icon: CalendarCheck },
    profile,
  ],
  admin: [
    overview,
    { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
    { href: "/dashboard/manage-services", label: "Manage Services", icon: ListChecks },
    { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
    profile,
  ],
};

function isAllowed(pathname, items) {
  return items.some((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.href || pathname.startsWith(item.href + "/")
  );
}

const Loader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [me, setMe] = useState(null);
  const [error, setError] = useState(null);

  const loadMe = useCallback(async () => {
    try {
      const data = await apiFetch("/api/me", { auth: true });
      setMe(data.user);
      setError(null);
    } catch (err) {
      setError({ message: err.message, status: err.status });
    }
  }, []);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!isPending && !session) router.replace("/signin");
  }, [isPending, session, router]);

    useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    apiFetch("/api/me", { auth: true })
      .then((data) => {
        if (cancelled) return;
        setMe(data.user);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError({ message: err.message, status: err.status });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const items = me ? navByRole[me.role] || navByRole.customer : [];
  const allowed = me ? isAllowed(pathname, items) : true;

  // অন্য role-এর পেজ URL-এ টাইপ করে ঢুকতে চাইলে Overview-তে ফেরত
  useEffect(() => {
    if (me && !allowed) router.replace("/dashboard");
  }, [me, allowed, router]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  if (isPending || !session) return <Loader />;

  if (error) {
    const blocked = error.status === 403;
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldOff className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">
          {blocked ? "Account blocked" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-3">
          {!blocked && <Button onClick={loadMe}>Try Again</Button>}
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  if (!me || !allowed) return <Loader />;

  const linkClass = (href) => {
    const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
    return active
      ? "bg-primary text-primary-foreground"
      : "text-foreground/70 hover:bg-muted";
  };

  const isPremium = me.subscriptionPlan === "premium";

  return (
    <DashboardContext.Provider value={{ me, refreshMe: loadMe }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-20 rounded-xl border bg-card p-4">
            <div className="mb-4 border-b pb-4">
              <p className="truncate font-semibold">{me.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                  {me.role}
                </span>
                {me.role === "vendor" && isPremium && (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <BadgeCheck className="h-3.5 w-3.5" /> Premium
                  </span>
                )}
              </div>
            </div>
            <nav className="space-y-1">
              {items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${linkClass(href)}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile nav */}
        <nav className="flex gap-2 overflow-x-auto pb-1 md:hidden">
          {items.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${linkClass(href)}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </DashboardContext.Provider>
  );
}