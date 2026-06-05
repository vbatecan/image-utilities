---
name: image-utilities-design
status: draft
date: 2026-06-05
owner: nytri
---

# Image Utilities Web App (Remix + Cloudflare) — Design

## Goal
Build a single website for image utilities (compress/resize/convert) using **Remix (SSR)**, with a **simple side navigation**, and a modular structure that supports adding **video** and **PDF** tools later. Deploy via **Wrangler** on Cloudflare.

## Requirements
- **SSR for SEO** on all tool routes
- **Multipage routing** with side navigation
- **Client-only image processing** (privacy + speed)
- **Modular tool architecture** to add more tools later
- **Simple, clean UI** (no unnecessary complexity)
- **Deploy to Cloudflare** using Wrangler

## Architecture (High-Level)
- **Framework:** Remix (SSR-first)
- **Hosting:** Cloudflare Workers/Pages via Wrangler
- **App shell:** Layout with side nav + main content area
- **Tool pages:** Each tool is its own route
- **Module boundaries:** Each tool lives in its own module folder with UI + logic isolated
- **Client processing:** All image operations happen in browser

## Routes & Pages
- `/` — Home (overview + links)
- `/image/compress`
- `/image/resize`
- `/image/convert`

**Nav structure:**
- Image Tools
  - Compress
  - Resize
  - Convert
- Video Tools (coming soon)
- PDF Tools (coming soon)

## Data Flow
1. User selects image(s)
2. UI reads file into memory
3. Tool module runs transform (resize/compress/convert)
4. Output preview shown
5. User downloads output

Shared utilities:
- File validation (type/size)
- Image metadata extraction
- Progress + status states

## Error Handling
- Validate file type/size before processing
- Friendly inline error messages + reset
- Warn on very large images (memory usage)

## SEO Plan
- Unique title/meta per route
- Descriptive H1/H2 content per tool
- Lightweight copy to explain each tool’s benefit

## Testing Strategy
- **Unit:** tool utils (image transform helpers)
- **Basic UI checks:** forms, file validation, error states

## Deployment
- Use Wrangler to deploy Remix app to Cloudflare
- Ensure SSR works on edge

