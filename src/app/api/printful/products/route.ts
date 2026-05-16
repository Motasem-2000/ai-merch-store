import { NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/printful';

export async function GET() {
  const data = await getCatalogProducts();
  return NextResponse.json(data);
}
