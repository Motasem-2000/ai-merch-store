import { NextRequest } from 'next/server';
import { createStoreProduct, createOrder } from '@/lib/printful';
import { printfulCreateOrderSchema } from '@/lib/validations';
import { errorResponse, ValidationError, AppError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = printfulCreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const { variantId, designImageUrl, title, price, shipping } = parsed.data;

    const productRes = await createStoreProduct(
      designImageUrl,
      variantId,
      title,
      price,
    );
    if (!productRes.result) {
      throw new AppError('Failed to create product on Printful', 502);
    }

    const orderRes = await createOrder(variantId, shipping);
    return Response.json({
      order: orderRes.result,
      product: productRes.result,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
