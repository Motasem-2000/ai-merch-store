import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { recommendationsSchema } from '@/lib/validations';

/**
 * POST /api/recommendations
 * Accepts an array of product names (from the user's cart) and returns
 * 2-3 AI-recommended products using Google Gemini. Falls back to
 * random non-cart products when Gemini is unavailable.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = recommendationsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ recommendations: [] });
    }

    const { productNames } = parsed.data;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: allProducts } = await supabase
      .from('products')
      .select('id, name, price, image_url');

    if (!allProducts || allProducts.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    const allNames = allProducts.map((p) => p.name);
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      const otherProducts = allProducts.filter((p) => !productNames.includes(p.name));
      return NextResponse.json({
        recommendations: otherProducts.slice(0, 3),
      });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Based on these products the user has in their cart: ${JSON.stringify(productNames)}, recommend 2-3 similar products from this list: ${JSON.stringify(allNames)}. Return ONLY a JSON array of product names, nothing else. Example: ["Product A", "Product B"]`,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';

    let recommendedNames: string[];
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      recommendedNames = JSON.parse(cleaned);
    } catch {
      const otherProducts = allProducts.filter((p) => !productNames.includes(p.name));
      return NextResponse.json({
        recommendations: otherProducts.slice(0, 3),
      });
    }

    const recommendations = allProducts.filter((p) => recommendedNames.includes(p.name));

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ recommendations: [] });
  }
}
