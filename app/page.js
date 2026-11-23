
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Flower2,
  Heart,
  MapPin,
  Sparkles,
  Utensils,
} from "lucide-react";

const categories = [
  {
    title: "Wedding Venues",
    description: "Find the perfect space for your celebration.",
    icon: MapPin,
    category: "Wedding Venues",
  },
  {
    title: "Photography & Videography",
    description: "Capture every beautiful moment forever.",
    icon: Camera,
    category: "Photography & Videography",
  },
  {
    title: "Decoration & Florist",
    description: "Create an atmosphere that feels like you.",
    icon: Flower2,
    category: "Decoration & Florist",
  },
  {
    title: "Catering Services",
    description: "Make every guest's experience memorable.",
    icon: Utensils,
    category: "Catering Services",
  },
  {
    title: "Makeup & Styling",
    description: "Discover artists for your special day.",
    icon: Sparkles,
    category: "Makeup & Styling",
  },
  {
    title: "Wedding Fashion",
    description: "Explore outfits for your celebration.",
    icon: Heart,
    category: "Wedding Fashion",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore services",
    description: "Browse wedding services and discover options for your celebration.",
  },
  {
    number: "02",
    title: "Choose your vendors",
    description: "Explore service details and find the right fit for your plans.",
  },
  {
    number: "03",
    title: "Make your booking",
    description: "Send booking requests and keep your plans organised.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-white">

      {/* HERO SECTION */}
      <section className="relative isolate min-h-[600px] bg-[#29191e]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#211419]/90 via-[#211419]/65 to-[#211419]/20" />

        <div className="mx-auto flex min-h-[600px] max-w-7xl items-center px-5 py-20 sm:px-8">
          <div className="max-w-2xl text-white">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-100">
              <Heart className="h-3.5 w-3.5 fill-current" />
              Your day, beautifully planned
            </p>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Every love story deserves a{" "}
              <span className="text-rose-200">beautiful</span> beginning.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Discover wedding services, explore vendors and bring every
              little detail of your big day together — all in one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Explore Services <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#29191e]"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-200" />
                Everything in one place
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-200" />
                Plan at your pace
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">
            Find what you need
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl">
            Everything for your special day
          </h2>

          <p className="mt-4 leading-7 text-gray-500">
            From the venue to the final details, discover the services
            that bring your wedding vision to life.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ title, description, icon: Icon, category }) => (
            <Link
              key={title}
              href={`/services?category=${encodeURIComponent(category)}`}
              className="group rounded-2xl border border-rose-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/70"
            >
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>

              <h3 className="text-lg font-semibold text-[#2b2023]">
                {title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                {description}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-rose-700">
                Explore category
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#fbf5f4]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#e8d5d2]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
                Made for your moments
              </p>
              <p className="mt-1 text-lg font-semibold text-[#2b2023]">
                The details matter.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">
              Simple steps, lovely plans
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl">
              A little less stress. A lot more celebration.
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              WedPlan helps you discover services and organise your
              wedding planning journey without searching everywhere.
            </p>

            <div className="mt-9 space-y-7">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-bold text-rose-700">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="font-semibold text-[#2b2023]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#2b2023] px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Start exploring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#2b2023] px-7 py-14 text-center text-white sm:px-12 sm:py-16">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <Heart className="mx-auto h-8 w-8 text-rose-200" />

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-rose-200">
              Your story starts here
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to plan a day to remember?
            </h2>

            <p className="mt-4 leading-7 text-white/70">
              Take the first step. Explore wedding services and start
              shaping your celebration.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Browse Wedding Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
