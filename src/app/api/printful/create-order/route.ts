import { NextRequest, NextResponse } from 'next/server';
import { createStoreProduct, createOrder } from '@/lib/printful';

export async function POST(req: NextRequest) {
  const { variantId, designImageUrl, title, price, shipping } = await req.json();

  const productRes = await createStoreProduct(designImageUrl, variantId, title, price);
  if (!productRes.result) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }

  const orderRes = await createOrder(variantId, shipping);
  return NextResponse.json({ order: orderRes.result, product: productRes.result });
}
