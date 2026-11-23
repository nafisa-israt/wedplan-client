"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export default function ProfilePage() {
  const { me, refreshMe } = useDashboard();
  const [name, setName] = useState(me.name || "");
  const [businessName, setBusinessName] = useState(me.businessName || "");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) return toast.error("Please choose an image file");
      if (imageFile.size > 4 * 1024 * 1024) return toast.error("Image must be smaller than 4MB");
    }

    setLoading(true);
    try {
      const updates = { name: name.trim() };
      if (imageFile) updates.image = await uploadImage(imageFile);
      if (me.role === "vendor") updates.businessName = businessName.trim();

      const { error } = await authClient.updateUser(updates);
      if (error) throw new Error(error.message || "Failed to update profile");

      await refreshMe();
      setImageFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Update your personal information.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={me.image || undefined} alt={me.name} />
            <AvatarFallback>{me.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {me.role === "vendor" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business name" />
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={me.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={me.role} disabled className="capitalize" />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}