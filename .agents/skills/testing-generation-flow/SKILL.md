---
name: testing-generation-flow
description: Test the AI Merch Store image generation flow end-to-end. Use when verifying changes to the /api/generate route, prompt enhancement, or image display UI.
---

## Devin Secrets Needed

These are repo-scoped secrets stored at `/run/repo_secrets/Motasem-2000/ai-merch-store/.env.secrets`:

- `GEMINI_API_KEY` — Google Gemini API key for prompt enhancement
- `HF_API_KEY` — Hugging Face API key for FLUX.1 image generation
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key

## Setup

1. Source repo secrets if available: `source /run/repo_secrets/Motasem-2000/ai-merch-store/.env.secrets`
2. Create `.env.local` with the 4 env vars above
3. Run `npm install` then `npm run dev`
4. App runs at http://localhost:3000

## Architecture Notes

- **Prompt enhancement**: Uses Gemini (`gemini-2.0-flash`) to refine user prompts. Falls back to raw prompt if Gemini fails or quota is exhausted.
- **Image generation**: Uses HF Inference API via `router.huggingface.co` with `FLUX.1-schnell`. The older `api-inference.huggingface.co` endpoint and `FLUX.1-dev` model are deprecated.
- **DB persistence**: Supabase `designs` table requires `user_id NOT NULL`. Without an auth flow, inserts will fail and the app returns designs without DB persistence via fallback.

## Testing the Generation Flow

1. Navigate to http://localhost:3000
2. Verify homepage loads: title "AI Merch Factory", input field, disabled "Create Magic" button
3. Type a prompt (e.g., "A panda DJ mixing tracks in neon Tokyo")
4. Verify "Create Magic" button becomes enabled
5. Click "Create Magic"
6. Verify button shows "Generating..." during request
7. Verify "Your Unique Design" card appears with generated image
8. Verify "Print This on a Product" button appears
9. Test a second generation without page reload to verify state resets correctly

## Known Issues to Watch For

- Gemini free-tier quota might be exhausted — check server logs for `RESOURCE_EXHAUSTED` warnings. The app should still work using raw prompts.
- If HF returns 404/410, the model endpoint may have changed again. Check https://huggingface.co/docs for current Inference API URLs.
- Supabase insert failures are expected without auth — verify the fallback returns the design anyway (HTTP 200 with design data).
- `FLUX.1-schnell` does not support `guidance_scale` — do not add it to parameters.
