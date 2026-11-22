"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    setOpen(false);
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

  const go = (path) => {
    setOpen(false);
    router.push(path);
  };

  const linkClass = (href) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      pathname === href ? "text-primary" : "text-foreground/70"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Heart className="h-5 w-5 fill-current" />
          WedPlan
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar>
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => go("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => go("/dashboard/profile")}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin" className={buttonVariants({ variant: "ghost" })}>
                Sign In
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-3 border-t bg-background px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block ${linkClass(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
          {isPending ? null : user ? (
            <div className="space-y-3 border-t pt-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button onClick={() => go("/dashboard")} className="block text-sm">
                Dashboard
              </button>
              <button onClick={() => go("/dashboard/profile")} className="block text-sm">
                Profile Settings
              </button>
              <button onClick={handleLogout} className="block text-sm text-red-600">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 border-t pt-3">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "outline" })}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={buttonVariants()}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}