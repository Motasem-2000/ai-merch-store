---
name: testing-ai-merch-store
description: Test the AI Merch Store frontend end-to-end. Use when verifying UI changes, page rendering, or form interactions.
---

# Testing AI Merch Store

## Local Dev Setup

```bash
cd /home/ubuntu/repos/ai-merch-store
npm install
npm run dev
# Dev server runs at http://localhost:3000
```

## What Can Be Tested Without API Keys

The app depends on external services (Supabase, HuggingFace FLUX.1, Gemini, Printful). Without API keys, you can still test:

- **Homepage rendering** (`/`): Title "AI Merch Factory", subtitle, input with placeholder, gradient background
- **Button disabled/enabled state**: Button should be disabled when input is empty, enabled when text is entered
- **Generate error handling**: Clicking "Create Magic" without API keys triggers a 500 from `/api/generate` — button should revert from "Generating..." to "Create Magic", no crash, no image card
- **Select-product page** (`/select-product`): Should show "Choose Your Product" heading and empty product grid when Printful API key is missing

## What Requires API Keys

- Full AI image generation flow (Gemini prompt enhancement + FLUX.1 image generation)
- Supabase design storage
- Printful product catalog display and ordering

## Devin Secrets Needed

For full end-to-end testing, the following secrets are needed:
- `HF_API_KEY` — HuggingFace API key for FLUX.1 image generation
- `GEMINI_API_KEY` — Google Gemini API key for prompt enhancement
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `PRINTFUL_API_KEY` — Printful API key for product catalog and ordering

## Known Issues / Patterns

- **Printful API error responses**: The Printful API returns `{"result": "error string"}` on auth failures, not an array. Code that consumes `data.result` must use `Array.isArray()` checks, not just `data.result || []`, to avoid TypeError when calling `.map()` on a string.
- **Gemini API error**: Without a valid key, the Gemini API returns a response without `candidates`, causing `data.candidates[0]` to throw. The server-side catch block handles this and returns a 500.

## Lint & Build

```bash
npm run lint   # ESLint
npm run build  # Next.js production build
```
