"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";

export default function ServiceCard({ service }) {
  const { data: session } = authClient.useSession();

  
  const detailsPath = `/services/${service._id}`;
  const href = session
    ? detailsPath
    : `/signin?redirect=${encodeURIComponent(detailsPath)}`;

  const vendor = service.vendor;
  const vendorName = vendor?.businessName || vendor?.name || "Vendor";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {service.images?.[0] && (
          <Image
            src={service.images[0]}
            alt={service.serviceName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {service.category}
        </span>

        <h3 className="line-clamp-1 text-lg font-semibold">{service.serviceName}</h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {service.location}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            by {vendorName}
            {vendor?.isPremium && (
              <BadgeCheck className="h-4 w-4 text-primary" title="Premium Vendor" />
            )}
          </span>
          <span className="text-lg font-bold text-primary">
            ${Number(service.price).toLocaleString()}
          </span>
        </div>

        <Link href={href} className={`${buttonVariants()} mt-auto w-full`}>
          View Details
        </Link>
      </div>
    </div>
  );
}