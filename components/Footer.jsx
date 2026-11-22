import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-rose-50/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Heart className="h-5 w-5 fill-current" />
            WedPlan
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Discover trusted wedding vendors, compare services and book your dream wedding in one
            place.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/services" className="hover:text-primary">Browse Services</Link></li>
            <li><Link href="/signin" className="hover:text-primary">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-primary">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@wedplan.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dhaka, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Follow Us</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} WedPlan. All rights reserved.
      </div>
    </footer>
  );
}