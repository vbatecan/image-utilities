export function validateImageFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return { ok: false, error: "Unsupported file type" } as const;
  }
  if (file.size > 15 * 1024 * 1024) {
    return { ok: false, error: "File too large (max 15MB)" } as const;
  }
  return { ok: true } as const;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
