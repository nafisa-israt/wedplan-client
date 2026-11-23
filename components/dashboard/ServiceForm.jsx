"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

const MAX_IMAGES = 5;
const MAX_SIZE = 4 * 1024 * 1024;

export default function ServiceForm({ initial, submitLabel, onSubmit }) {
  const [form, setForm] = useState({
    serviceName: initial?.serviceName ?? "",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    location: initial?.location ?? "",
  });
  const [existingImages, setExistingImages] = useState(initial?.images ?? []);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const valid = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} is larger than 4MB`);
        continue;
      }
      valid.push(file);
    }
    const room = MAX_IMAGES - existingImages.length - newFiles.length;
    if (valid.length > room) toast.error(`You can add at most ${MAX_IMAGES} images`);
    setNewFiles([...newFiles, ...valid.slice(0, Math.max(room, 0))]);
  };

  const validate = () => {
    if (form.serviceName.trim().length < 3) return "Service name must be at least 3 characters";
    if (!form.category) return "Please select a category";
    if (form.description.trim().length < 20) return "Description must be at least 20 characters";
    if (!form.location.trim()) return "Location is required";
    if (!(Number(form.price) > 0)) return "Price must be greater than 0";
    if (existingImages.length + newFiles.length === 0) return "Please add at least one image";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }

    setLoading(true);
    try {
      const uploaded = await Promise.all(newFiles.map((f) => uploadImage(f)));
      await onSubmit({
        serviceName: form.serviceName.trim(),
        category: form.category,
        description: form.description.trim(),
        location: form.location.trim(),
        price: Number(form.price),
        images: [...existingImages, ...uploaded],
      });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6">
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service Name</Label>
        <Input id="serviceName" name="serviceName" value={form.serviceName} onChange={handleChange} placeholder="e.g. Golden Hour Wedding Photography" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className={`${fieldClass} h-9`}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" name="price" type="number" min="1" value={form.price} onChange={handleChange} placeholder="e.g. 1200" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Dhaka" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea id="description" name="description" rows={5} value={form.description} onChange={handleChange} className={fieldClass} placeholder="Describe your service (at least 20 characters)" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Service Images (up to {MAX_IMAGES})</Label>
        <Input id="images" type="file" accept="image/*" multiple onChange={handleFiles} />

        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {existingImages.map((url, i) => (
              <div key={url} className="relative">
                <img src={url} alt={`Image ${i + 1}`} className="h-20 w-24 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages(existingImages.filter((u) => u !== url))}
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="relative flex h-20 w-24 items-center justify-center rounded-lg border bg-muted p-1 text-center text-[11px]">
                <span className="line-clamp-3 break-all">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setNewFiles(newFiles.filter((_, idx) => idx !== i))}
                  className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}