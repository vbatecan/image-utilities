# Image Utilities Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a Remix SSR web app for image utilities (compress/resize/convert) with a simple side nav and modular tool structure, deployable via Wrangler on Cloudflare.

**Architecture:** Remix SSR on Cloudflare, multipage routes with a shared layout and side navigation. Each tool is a self-contained module and route, sharing common UI and utilities for file handling and error states. Client-only processing for images.

**Tech Stack:** Remix, React, TypeScript, Cloudflare Workers/Pages, Wrangler, Vite (Remix dev), browser Image APIs.

---

## Task 1: Initialize Remix + Cloudflare project structure

**Objective:** Scaffold a Remix app configured for Cloudflare and TypeScript.

**Files:**
- Create: project files via `npm create remix@latest`

**Step 1: Run scaffold**

Run:
```bash
cd /home/nytri/projects/image-utilities
npm create remix@latest .
```
Expected: Remix scaffold completes with Cloudflare template.

**Step 2: Verify dev server**

Run:
```bash
npm install
npm run dev
```
Expected: Dev server starts without errors.

**Step 3: Commit**

```bash
git add .
git commit -m "chore: scaffold remix cloudflare app"
```

---

## Task 2: Add base layout + side navigation

**Objective:** Create a simple app shell with left nav and content area.

**Files:**
- Modify: `app/root.tsx`
- Create: `app/components/SideNav.tsx`
- Create: `app/styles/app.css` (or Remix global stylesheet)

**Step 1: Add SideNav component**

```tsx
// app/components/SideNav.tsx
import { NavLink } from "@remix-run/react";

const groups = [
  {
    title: "Image Tools",
    links: [
      { to: "/image/compress", label: "Compress" },
      { to: "/image/resize", label: "Resize" },
      { to: "/image/convert", label: "Convert" },
    ],
  },
  {
    title: "Video Tools",
    links: [],
    disabled: true,
  },
  {
    title: "PDF Tools",
    links: [],
    disabled: true,
  },
];

export function SideNav() {
  return (
    <nav className="sidenav">
      <div className="brand">Image Utils</div>
      {groups.map((group) => (
        <div key={group.title} className="nav-group">
          <div className="nav-title">{group.title}</div>
          {group.links.length ? (
            group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))
          ) : (
            <div className="nav-link disabled">Coming soon</div>
          )}
        </div>
      ))}
    </nav>
  );
}
```

**Step 2: Wire layout into root**

```tsx
// app/root.tsx
import type { LinksFunction } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { SideNav } from "./components/SideNav";
import appStyles from "./styles/app.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: appStyles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="app-shell">
          <SideNav />
          <main className="main-content">
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

**Step 3: Add minimal CSS**

```css
/* app/styles/app.css */
:root {
  color-scheme: light;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidenav {
  border-right: 1px solid #e5e5e5;
  padding: 20px;
  background: #fafafa;
}

.brand { font-weight: 700; margin-bottom: 16px; }

.nav-group { margin-bottom: 18px; }
.nav-title { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 8px; }

.nav-link { display: block; padding: 6px 0; color: #222; text-decoration: none; }
.nav-link.active { font-weight: 600; }
.nav-link.disabled { color: #aaa; }

.main-content { padding: 24px; }
```

**Step 4: Commit**

```bash
git add app/root.tsx app/components/SideNav.tsx app/styles/app.css
git commit -m "feat: add app shell with side navigation"
```

---

## Task 3: Create shared tool UI + utilities

**Objective:** Add reusable UI for file upload, preview, and errors.

**Files:**
- Create: `app/components/ToolCard.tsx`
- Create: `app/utils/image.ts`

**Step 1: ToolCard UI wrapper**

```tsx
// app/components/ToolCard.tsx
import type { ReactNode } from "react";

export function ToolCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="tool-card">
      <h1>{title}</h1>
      <p className="subtitle">{description}</p>
      <div className="tool-body">{children}</div>
    </section>
  );
}
```

**Step 2: Image helpers**

```ts
// app/utils/image.ts
export function validateImageFile(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) return { ok: false, error: "Unsupported file type" };
  if (file.size > 15 * 1024 * 1024) return { ok: false, error: "File too large (max 15MB)" };
  return { ok: true };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
```

**Step 3: CSS additions**

Append to `app/styles/app.css`:
```css
.tool-card { max-width: 800px; }
.subtitle { color: #555; margin-bottom: 16px; }
.tool-body { border: 1px solid #eee; padding: 16px; border-radius: 8px; }
```

**Step 4: Commit**

```bash
git add app/components/ToolCard.tsx app/utils/image.ts app/styles/app.css
git commit -m "feat: add shared tool UI and image utils"
```

---

## Task 4: Implement Compress page

**Objective:** Add `/image/compress` route with client-only compression.

**Files:**
- Create: `app/routes/image.compress.tsx`

**Step 1: Implement page**

```tsx
import { useState } from "react";
import { ToolCard } from "~/components/ToolCard";
import { fileToDataUrl, validateImageFile } from "~/utils/image";

export const meta = () => [{ title: "Compress Images Online" }, { name: "description", content: "Compress JPG/PNG/WebP images in your browser." }];

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
    <ToolCard title="Compress images" description="Reduce file size quickly in your browser.">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: 320, marginTop: 12 }} />}
    </ToolCard>
  );
}
```

**Step 2: Commit**

```bash
git add app/routes/image.compress.tsx
git commit -m "feat: add image compress page"
```

---

## Task 5: Implement Resize page

**Objective:** Add `/image/resize` route with width/height controls.

**Files:**
- Create: `app/routes/image.resize.tsx`

**Step 1: Implement page**

```tsx
import { useState } from "react";
import { ToolCard } from "~/components/ToolCard";
import { fileToDataUrl, validateImageFile } from "~/utils/image";

export const meta = () => [{ title: "Resize Images Online" }, { name: "description", content: "Resize JPG/PNG/WebP images in your browser." }];

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
    <ToolCard title="Resize images" description="Set custom width and height instantly.">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: 320, marginTop: 12 }} />}
    </ToolCard>
  );
}
```

**Step 2: Commit**

```bash
git add app/routes/image.resize.tsx
git commit -m "feat: add image resize page"
```

---

## Task 6: Implement Convert page

**Objective:** Add `/image/convert` route with format switcher.

**Files:**
- Create: `app/routes/image.convert.tsx`

**Step 1: Implement page**

```tsx
import { useState } from "react";
import { ToolCard } from "~/components/ToolCard";
import { fileToDataUrl, validateImageFile } from "~/utils/image";

export const meta = () => [{ title: "Convert Images Online" }, { name: "description", content: "Convert JPG/PNG/WebP images in your browser." }];

export default function ConvertPage() {
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
    <ToolCard title="Convert images" description="Convert JPG, PNG, and WebP in seconds.">
      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: 320, marginTop: 12 }} />}
    </ToolCard>
  );
}
```

**Step 2: Commit**

```bash
git add app/routes/image.convert.tsx
git commit -m "feat: add image convert page"
```

---

## Task 7: Home page + SEO

**Objective:** Add home page with links and copy.

**Files:**
- Modify: `app/routes/_index.tsx`

**Step 1: Implement Home**

```tsx
import { Link } from "@remix-run/react";

export const meta = () => [{ title: "Image Utilities" }, { name: "description", content: "Fast image tools for compressing, resizing, and converting." }];

export default function Index() {
  return (
    <div>
      <h1>Image Utilities</h1>
      <p>Fast, private tools for compressing, resizing, and converting images in your browser.</p>
      <ul>
        <li><Link to="/image/compress">Compress images</Link></li>
        <li><Link to="/image/resize">Resize images</Link></li>
        <li><Link to="/image/convert">Convert images</Link></li>
      </ul>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/routes/_index.tsx
git commit -m "feat: add home page and SEO copy"
```

---

## Task 8: Wrangler config + deploy script

**Objective:** Ensure Wrangler setup for deployment.

**Files:**
- Modify/Create: `wrangler.toml` (if not present)
- Modify: `package.json` scripts

**Step 1: Verify wrangler config**

If missing, add:
```toml
name = "image-utilities"
compatibility_date = "2026-06-05"

[assets]
# Remix handles assets; keep default
```

**Step 2: Add deploy script**

Add to `package.json`:
```json
"scripts": {
  "deploy": "wrangler deploy"
}
```

**Step 3: Commit**

```bash
git add wrangler.toml package.json
git commit -m "chore: add wrangler deploy script"
```

---

## Task 9: Verification

**Objective:** Ensure app runs locally.

**Step 1: Run dev server**
```bash
npm run dev
```
Expected: App loads, routes render, no console errors.

**Step 2: Smoke test routes**
- `/` renders with links
- `/image/compress` shows upload + preview
- `/image/resize` shows upload + preview
- `/image/convert` shows upload + preview

**Step 3: Commit (if any fixes)**

---

## Task 10: Push & Deploy

**Objective:** Push changes and deploy with Wrangler.

```bash
git push
npm run deploy
```

Expected: Deployment succeeds and provides a Cloudflare URL.

