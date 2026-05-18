import { describe, it, expect } from 'vitest';
import {
  generateSchema,
  recommendationsSchema,
  checkoutSchema,
  productSchema,
  printfulCreateOrderSchema,
} from '@/lib/validations';

describe('generateSchema', () => {
  it('accepts a valid prompt', () => {
    const result = generateSchema.safeParse({ prompt: 'A cool design' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty prompt', () => {
    const result = generateSchema.safeParse({ prompt: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a prompt over 1000 characters', () => {
    const result = generateSchema.safeParse({ prompt: 'x'.repeat(1001) });
    expect(result.success).toBe(false);
  });
});

describe('recommendationsSchema', () => {
  it('accepts valid product names array', () => {
    const result = recommendationsSchema.safeParse({
      productNames: ['T-Shirt'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty array', () => {
    const result = recommendationsSchema.safeParse({ productNames: [] });
    expect(result.success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('accepts valid shipping info', () => {
    const result = checkoutSchema.safeParse({
      fullName: 'John',
      address: '123 St',
      city: 'NYC',
      postalCode: '10001',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing full name', () => {
    const result = checkoutSchema.safeParse({
      fullName: '',
      address: '123 St',
      city: 'NYC',
      postalCode: '10001',
    });
    expect(result.success).toBe(false);
  });
});

describe('productSchema', () => {
  it('accepts valid product data', () => {
    const result = productSchema.safeParse({
      name: 'Mug',
      price: 12.99,
      stock: 50,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative price', () => {
    const result = productSchema.safeParse({
      name: 'Mug',
      price: -5,
      stock: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative stock', () => {
    const result = productSchema.safeParse({
      name: 'Mug',
      price: 12.99,
      stock: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe('printfulCreateOrderSchema', () => {
  it('accepts a complete valid order', () => {
    const result = printfulCreateOrderSchema.safeParse({
      variantId: 42,
      designImageUrl: 'https://example.com/img.png',
      title: 'Cool Tee',
      price: 29.99,
      shipping: {
        name: 'Jane',
        address1: '456 Ave',
        city: 'LA',
        country_code: 'US',
        zip: '90001',
        email: 'jane@example.com',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email in shipping', () => {
    const result = printfulCreateOrderSchema.safeParse({
      variantId: 42,
      designImageUrl: 'https://example.com/img.png',
      title: 'Cool Tee',
      price: 29.99,
      shipping: {
        name: 'Jane',
        address1: '456 Ave',
        city: 'LA',
        country_code: 'US',
        zip: '90001',
        email: 'not-an-email',
      },
    });
    expect(result.success).toBe(false);
  });
});
