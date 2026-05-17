import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

async function enhancePromptWithGemini(userPrompt: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, using raw prompt');
    return userPrompt;
  }
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert prompt engineer for image generation. Take a user's description and refine it into a vivid, artistic, high-quality prompt suitable for FLUX.1. Add details about lighting, color palette, art style, composition, and mood. Return only the refined prompt, nothing else.\n\nUser description: "${userPrompt}"`
            }]
          }]
        }),
      }
    );
    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    console.warn('Gemini returned unexpected response, using raw prompt:', JSON.stringify(data.error ?? data));
    return userPrompt;
  } catch (err) {
    console.warn('Gemini enhancement failed, using raw prompt:', err);
    return userPrompt;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const enhancedPrompt = await enhancePromptWithGemini(prompt);

    const imageRes = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: { width: 1024, height: 1024 },
      }),
    });

    if (!imageRes.ok) {
      throw new Error(`Image generation failed: ${imageRes.statusText}`);
    }

    const imageBlob = await imageRes.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const design: Record<string, unknown> = {
      prompt,
      enhanced_prompt: enhancedPrompt,
      image_url: imageUrl,
      status: 'completed',
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
          .from('designs')
          .insert(design)
          .select()
          .single();
        if (!error && data) {
          return NextResponse.json({ design: data });
        }
        console.warn('Supabase insert failed, returning design without DB save:', error?.message);
      } catch (dbErr) {
        console.warn('Supabase error, returning design without DB save:', dbErr);
      }
    }

    return NextResponse.json({ design });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while generating your design.' },
      { status: 500 }
    );
  }
}
