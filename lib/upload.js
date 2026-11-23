export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.url;
}