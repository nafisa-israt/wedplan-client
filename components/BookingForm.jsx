"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function BookingForm({ serviceId, role }) {
  const router = useRouter();
  const [form, setForm] = useState({ eventDate: "", eventLocation: "", message: "" });
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.eventDate) return toast.error("Please choose your event date");
    if (form.eventDate < today) return toast.error("Event date cannot be in the past");
    if (!form.eventLocation.trim()) return toast.error("Please enter the event location");

    setLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        auth: true,
        body: {
          serviceId,
          eventDate: form.eventDate,
          eventLocation: form.eventLocation.trim(),
          message: form.message.trim(),
        },
      });
      toast.success("Booking request sent! The vendor will review it soon.");
      if (role === "customer") {
        router.push("/dashboard/my-bookings");
      } else {
        setForm({ eventDate: "", eventLocation: "", message: "" });
      }
    } catch (err) {
      toast.error(err.message || "Failed to send booking request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventDate">Event Date</Label>
        <Input
          id="eventDate"
          name="eventDate"
          type="date"
          min={today}
          value={form.eventDate}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventLocation">Event Location</Label>
        <Input
          id="eventLocation"
          name="eventLocation"
          value={form.eventLocation}
          onChange={handleChange}
          placeholder="Where will the event take place?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional Message (optional)</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className={fieldClass}
          placeholder="Tell the vendor about your requirements"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Sending request..." : "Send Booking Request"}
      </Button>
    </form>
  );
}