"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BadgeCheck, Loader2, MapPin, ShieldAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  // Private route: লগইন না থাকলে Sign In-এ পাঠাও
  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/signin?redirect=${encodeURIComponent(`/services/${id}`)}`);
    }
  }, [isPending, session, id, router]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(`/api/services/${id}`);
        if (!cancelled) setService(res.service);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load service");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, session]);

  if (isPending || !session || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">Service not available</h1>
        <p className="mt-2 text-muted-foreground">{error || "This service could not be found."}</p>
        <Link href="/services" className={`${buttonVariants()} mt-6`}>
          Back to Services
        </Link>
      </div>
    );
  }

  const user = session.user;
  const vendor = service.vendor;
  const vendorName = vendor?.businessName || vendor?.name || "Vendor";
  const isOwner = service.vendorId === user.id;
  const isAdmin = user.role === "admin";

  let bookingBlockReason = "";
  if (isAdmin) bookingBlockReason = "Admins cannot submit booking requests.";
  else if (isOwner) bookingBlockReason = "You cannot book your own service.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">
        ← Back to services
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            {service.images?.[activeImage] && (
              <img
                src={service.images[activeImage]}
                alt={service.serviceName}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {service.images?.length > 1 && (
            <div className="mt-3 flex gap-3">
              {service.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-24 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`${service.serviceName} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {service.category}
          </span>
          <h1 className="text-3xl font-bold">{service.serviceName}</h1>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {service.location}
          </div>

          <p className="text-3xl font-bold text-primary">
            ${Number(service.price).toLocaleString()}
          </p>

          <div>
            <h2 className="mb-1 font-semibold">Description</h2>
            <p className="whitespace-pre-line text-muted-foreground">{service.description}</p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border p-4">
            <Avatar>
              <AvatarImage src={vendor?.image || undefined} alt={vendorName} />
              <AvatarFallback>{vendorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground">Vendor</p>
              <p className="flex items-center gap-1 font-medium">
                {vendorName}
                {vendor?.isPremium && <BadgeCheck className="h-4 w-4 text-primary" title="Premium Vendor" />}
              </p>
            </div>
          </div>

          {/* Booking (পরের ধাপে আসল form বসবে) */}
          <div className="rounded-xl border bg-rose-50/50 p-4">
            <h2 className="mb-2 font-semibold">Book this service</h2>
            {bookingBlockReason ? (
              <p className="text-sm text-muted-foreground">{bookingBlockReason}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Booking form will appear here in the next step.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}