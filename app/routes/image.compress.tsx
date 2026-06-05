import { useState } from "react";
import { ToolCard } from "~/components/ToolCard";
import { fileToDataUrl, validateImageFile } from "~/utils/image";

export const meta = () => [
  { title: "Compress Images Online" },
  {
    name: "description",
    content: "Compress JPG/PNG/WebP images in your browser.",
  },
];

export default function CompressPage() {
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
      title="Compress images"
      description="Reduce file size quickly in your browser."
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
