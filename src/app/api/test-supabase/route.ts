import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      success: false,
      error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env.local file.',
    }, { status: 500 });
  }

  try {
    const supabase = createClient(url, key);
    const { error } = await supabase.from('products').select('id').limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Supabase query failed: ${error.message}. Make sure you have run schema.sql in the Supabase SQL Editor.`,
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection is working!',
      time: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: `Connection failed: ${message}. Verify your Supabase URL and anon key.`,
    }, { status: 502 });
  }
}
