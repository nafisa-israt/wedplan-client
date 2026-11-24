"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Flower2,
  Heart,
  MapPin,
  MessageSquareHeart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  Wallet,
} from "lucide-react";

// ⚠️ services পেজে যে env নাম ব্যবহার করেছেন সেটাই বসান
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://wedplan-server-kr5y.onrender.com";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const viewProps = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } };

const categories = [
  { title: "Wedding Venues", description: "Find the perfect space for your celebration.", icon: MapPin, category: "Wedding Venues" },
  { title: "Photography & Videography", description: "Capture every beautiful moment forever.", icon: Camera, category: "Photography & Videography" },
  { title: "Decoration & Florist", description: "Create an atmosphere that feels like you.", icon: Flower2, category: "Decoration & Florist" },
  { title: "Catering Services", description: "Make every guest's experience memorable.", icon: Utensils, category: "Catering Services" },
  { title: "Makeup & Styling", description: "Discover artists for your special day.", icon: Sparkles, category: "Makeup & Styling" },
  { title: "Wedding Fashion", description: "Explore outfits for your celebration.", icon: Heart, category: "Wedding Fashion" },
];

const whyChoose = [
  { icon: BadgeCheck, title: "Verified Vendors", description: "Every service is reviewed and approved by our admin team before it goes live." },
  { icon: Search, title: "Easy Discovery", description: "Search, filter by category or location, and sort by price to find your match fast." },
  { icon: Wallet, title: "Transparent Pricing", description: "See prices upfront with no hidden surprises while you plan your budget." },
  { icon: MessageSquareHeart, title: "Simple Booking", description: "Send a booking request in seconds and track its status from your dashboard." },
  { icon: ShieldCheck, title: "Secure Platform", description: "Role-based access and secure Stripe payments keep your data and money safe." },
  { icon: Heart, title: "Made for Your Day", description: "Everything you need for your celebration, organised beautifully in one place." },
];

const steps = [
  { number: "01", title: "Explore services", description: "Browse wedding services and discover options for your celebration." },
  { number: "02", title: "Choose your vendors", description: "Explore service details and find the right fit for your plans." },
  { number: "03", title: "Make your booking", description: "Send booking requests and keep your plans organised." },
];

const testimonials = [
  { name: "Ayesha & Rahim", text: "We found our photographer and decorator in one afternoon. Booking was effortless and everything felt organised.", role: "Newlyweds" },
  { name: "Tanvir Ahmed", text: "As a vendor, WedPlan brought me genuine customers. Managing booking requests from my dashboard is very easy.", role: "Wedding Photographer" },
  { name: "Nusrat Jahan", text: "Comparing prices and locations side by side saved us so much time and stress. Highly recommended!", role: "Bride-to-be" },
];

function getVendorName(service) {
  return (
    service.vendorName ||
    service.vendor?.businessName ||
    service.vendor?.name ||
    service.businessName ||
    "WedPlan Vendor"
  );
}

function getImage(service) {
  if (Array.isArray(service.images) && service.images.length > 0) {
    const first = service.images[0];
    return typeof first === "string" ? first : first?.url;
  }
  return service.image || null;
}

function ServiceSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white">
      <div className="h-48 animate-pulse bg-rose-50" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-rose-50" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-rose-50" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-rose-50" />
      </div>
    </div>
  );
}

function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.services || data.data || [];
        if (!cancelled) setServices(list.slice(0, 6));
      } catch (err) {
        if (!cancelled) setError("We couldn't load services right now. Please try again shortly.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
      <motion.div variants={fadeUp} {...viewProps} className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">Featured</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl">
          Featured Wedding Services
        </h2>
        <p className="mt-4 leading-7 text-gray-500">
          Hand-picked services from approved vendors, ready for your big day.
        </p>
      </motion.div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-700">
          No services are available yet. Please check back soon.
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <motion.div variants={stagger} {...viewProps} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const id = service._id || service.id;
            const image = getImage(service);
            return (
              <motion.div
                key={id}
                variants={fadeUp}
                className="group overflow-hidden rounded-2xl border border-rose-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/70"
              >
                <div className="relative h-48 overflow-hidden bg-rose-50">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={service.serviceName || "Wedding service"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-rose-300">
                      <Heart className="h-10 w-10" />
                    </div>
                  )}
                  {service.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-700">
                      {service.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-semibold text-[#2b2023]">
                    {service.serviceName}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    {service.location || "Location not set"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">by {getVendorName(service)}</p>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-bold text-rose-700">
                      ${Number(service.price || 0).toLocaleString()}
                    </p>
                    <Link
                      href={`/services/${id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#2b2023] px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800"
        >
          View all services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative isolate min-h-[620px] bg-[#29191e]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#211419]/90 via-[#211419]/65 to-[#211419]/20" />

        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-2xl text-white"
          >
            <motion.p
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-100"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              Your day, beautifully planned
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
            >
              Every love story deserves a <span className="text-rose-200">beautiful</span> beginning.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Discover wedding services, explore vendors and bring every little detail of your big
              day together, all in one place.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Explore Wedding Services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#29191e]"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-200" />
                Everything in one place
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-200" />
                Plan at your pace
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED SERVICES (DB থেকে) */}
      <FeaturedServices />

      {/* CATEGORIES */}
      <section className="bg-[#fbf5f4]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <motion.div variants={fadeUp} {...viewProps} className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">Find what you need</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl">
              Wedding Service Categories
            </h2>
            <p className="mt-4 leading-7 text-gray-500">
              From the venue to the final details, discover the services that bring your wedding
              vision to life.
            </p>
          </motion.div>

          <motion.div variants={stagger} {...viewProps} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ title, description, icon: Icon, category }) => (
              <motion.div key={title} variants={fadeUp}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="group block h-full rounded-2xl border border-rose-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/70"
                >
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#2b2023]">{title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-rose-700">
                    Explore category
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE WEDPLAN */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <motion.div variants={fadeUp} {...viewProps} className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">The WedPlan difference</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl">
            Why Choose WedPlan?
          </h2>
          <p className="mt-4 leading-7 text-gray-500">
            We make wedding planning simpler, safer and more enjoyable for customers and vendors alike.
          </p>
        </motion.div>

        <motion.div variants={stagger} {...viewProps} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-rose-100 bg-gradient-to-b from-white to-rose-50/50 p-7"
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-[#2b2023]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#fbf5f4]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-24">
          <motion.div
            variants={fadeUp}
            {...viewProps}
            className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-[#e8d5d2]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Made for your moments</p>
              <p className="mt-1 text-lg font-semibold text-[#2b2023]">The details matter.</p>
            </div>
          </motion.div>

          <motion.div variants={stagger} {...viewProps}>
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">
              How WedPlan works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl"
            >
              A little less stress. A lot more celebration.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 leading-7 text-gray-600">
              WedPlan helps you discover services and organise your wedding planning journey without
              searching everywhere.
            </motion.p>

            <div className="mt-9 space-y-7">
              {steps.map((step) => (
                <motion.div variants={fadeUp} key={step.number} className="flex gap-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-bold text-rose-700">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#2b2023]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp}>
              <Link
                href="/services"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#2b2023] px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Start exploring <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <motion.div variants={fadeUp} {...viewProps} className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-600">Love notes</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2b2023] sm:text-4xl">
            What Our Customers Say
          </h2>
        </motion.div>

        <motion.div variants={stagger} {...viewProps} className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="rounded-2xl border border-rose-100 bg-white p-7 shadow-sm"
            >
              <div className="mb-4 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-7 text-gray-600">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 font-semibold text-rose-700">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#2b2023]">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-24">
        <motion.div
          variants={fadeUp}
          {...viewProps}
          className="relative overflow-hidden rounded-[2rem] bg-[#2b2023] px-7 py-14 text-center text-white sm:px-12 sm:py-16"
        >
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <Heart className="mx-auto h-8 w-8 text-rose-200" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-rose-200">Your story starts here</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to plan a day to remember?
            </h2>
            <p className="mt-4 leading-7 text-white/70">
              Take the first step. Explore wedding services and start shaping your celebration.
            </p>
            <Link
              href="/services"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Browse Wedding Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}