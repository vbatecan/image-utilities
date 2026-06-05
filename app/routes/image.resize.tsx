import { useState } from "react";
import { ToolCard } from "~/components/ToolCard";
import { fileToDataUrl, validateImageFile } from "~/utils/image";

export const meta = () => [
  { title: "Resize Images Online" },
  {
    name: "description",
    content: "Resize JPG/PNG/WebP images in your browser.",
  },
];

export default function ResizePage() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const v = validateImageFile(file);
    if (!v.ok) return setError(v.error!);
    const url = await fileToDataUrl(file);
    setPreview(url);
  }

  return (
    <ToolCard
      title="Resize images"
      description="Set custom width and height instantly."
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: 320, marginTop: 12 }}
        />
      )}
    </ToolCard>
  );
}
