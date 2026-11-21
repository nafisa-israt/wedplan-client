import { NextResponse } from "next/server";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "File must be an image" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: "Image must be smaller than 4MB" }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });
    }

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json({ message: "Failed to upload image" }, { status: 502 });
    }

    return NextResponse.json({ url: data.data.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
  }
}