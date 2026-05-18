import { NextRequest, NextResponse } from 'next/server';
import { createStoreProduct, createOrder } from '@/lib/printful';
import { printfulCreateOrderSchema } from '@/lib/validations';

/**
 * POST /api/printful/create-order
 * Creates a Printful store product from a design and places an order.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = printfulCreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 }
      );
    }

    const { variantId, designImageUrl, title, price, shipping } = parsed.data;

    const productRes = await createStoreProduct(designImageUrl, variantId, title, price);
    if (!productRes.result) {
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    const orderRes = await createOrder(variantId, shipping);
    return NextResponse.json({ order: orderRes.result, product: productRes.result });
  } catch (error) {
    console.error('Printful order error:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
