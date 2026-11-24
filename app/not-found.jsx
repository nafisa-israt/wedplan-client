import Link from "next/link";
import { ArrowRight, Heart, Home } from "lucide-react";

export const metadata = {
  title: "Page not found | WedPlan",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <Heart className="h-7 w-7" />
      </span>

      <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-rose-600">
        Error 404
      </p>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2b2023] sm:text-5xl">
        Page not found
      </h1>

      <p className="mt-4 max-w-md leading-7 text-gray-500">
        The page you are looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back to planning your special day.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-7 py-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
        >
          Browse Services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}