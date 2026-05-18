import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSchema } from '@/lib/validations';

const HF_API_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';

/**
 * Enhances a user prompt using Google Gemini for better image generation results.
 * Returns the refined prompt text suitable for FLUX.1.
 */
async function enhancePromptWithGemini(userPrompt: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert prompt engineer for image generation. Take a user's description and refine it into a vivid, artistic, high-quality prompt suitable for FLUX.1. Add details about lighting, color palette, art style, composition, and mood. Return only the refined prompt, nothing else.\n\nUser description: "${userPrompt}"`,
              },
            ],
          },
        ],
      }),
    }
  );
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * POST /api/generate
 * Accepts a text prompt, enhances it via Gemini, generates an image via FLUX.1,
 * and stores the design in Supabase.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { prompt } = parsed.data;
    const enhancedPrompt = await enhancePromptWithGemini(prompt);

    const imageRes = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: { width: 1024, height: 1024, guidance_scale: 7.5 },
      }),
    });

    if (!imageRes.ok) {
      throw new Error(`Image generation failed: ${imageRes.statusText}`);
    }

    const imageBlob = await imageRes.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
      .from('designs')
      .insert({
        prompt,
        enhanced_prompt: enhancedPrompt,
        image_url: imageUrl,
        status: 'completed',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ design: data });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while generating your design.' },
      { status: 500 }
    );
  }
}
