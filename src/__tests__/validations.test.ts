import { describe, it, expect } from 'vitest';
import {
  generateSchema,
  recommendationsSchema,
  checkoutSchema,
  productSchema,
  printfulCreateOrderSchema,
} from '@/lib/validations';

describe('generateSchema', () => {
  it('accepts valid prompt', () => {
    const result = generateSchema.safeParse({ prompt: 'A cat in space' });
    expect(result.success).toBe(true);
  });

  it('rejects empty prompt', () => {
    const result = generateSchema.safeParse({ prompt: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing prompt', () => {
    const result = generateSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects prompt over 1000 chars', () => {
    const result = generateSchema.safeParse({ prompt: 'a'.repeat(1001) });
    expect(result.success).toBe(false);
  });
});

describe('recommendationsSchema', () => {
  it('accepts valid product names array', () => {
    const result = recommendationsSchema.safeParse({ productNames: ['Product A'] });
    expect(result.success).toBe(true);
  });

  it('rejects empty array', () => {
    const result = recommendationsSchema.safeParse({ productNames: [] });
    expect(result.success).toBe(false);
  });

  it('rejects non-array', () => {
    const result = recommendationsSchema.safeParse({ productNames: 'not an array' });
    expect(result.success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('accepts valid checkout data', () => {
    const result = checkoutSchema.safeParse({
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing fullName', () => {
    const result = checkoutSchema.safeParse({
      address: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty city', () => {
    const result = checkoutSchema.safeParse({
      fullName: 'John',
      address: '123 Main St',
      city: '',
      postalCode: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('productSchema', () => {
  it('accepts valid product data', () => {
    const result = productSchema.safeParse({
      name: 'Cool Shirt',
      price: 29.99,
      stock: 10,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative price', () => {
    const result = productSchema.safeParse({
      name: 'Cool Shirt',
      price: -5,
      stock: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative stock', () => {
    const result = productSchema.safeParse({
      name: 'Cool Shirt',
      price: 29.99,
      stock: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty name', () => {
    const result = productSchema.safeParse({
      name: '',
      price: 29.99,
      stock: 10,
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional description', () => {
    const result = productSchema.safeParse({
      name: 'Cool Shirt',
      description: 'A really cool shirt',
      price: 29.99,
      stock: 10,
    });
    expect(result.success).toBe(true);
  });
});

describe('printfulCreateOrderSchema', () => {
  const validOrder = {
    variantId: 123,
    designImageUrl: 'https://example.com/image.png',
    title: 'Test Product',
    price: 29.99,
    shipping: {
      name: 'John Doe',
      address1: '123 Main St',
      city: 'Anytown',
      country_code: 'US',
      zip: '12345',
      email: 'john@example.com',
    },
  };

  it('accepts valid order data', () => {
    const result = printfulCreateOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email in shipping', () => {
    const result = printfulCreateOrderSchema.safeParse({
      ...validOrder,
      shipping: { ...validOrder.shipping, email: 'not-an-email' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid country code (too long)', () => {
    const result = printfulCreateOrderSchema.safeParse({
      ...validOrder,
      shipping: { ...validOrder.shipping, country_code: 'USA' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-positive variantId', () => {
    const result = printfulCreateOrderSchema.safeParse({
      ...validOrder,
      variantId: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid design URL', () => {
    const result = printfulCreateOrderSchema.safeParse({
      ...validOrder,
      designImageUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});
