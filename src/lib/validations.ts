import { z } from 'zod';

/** Schema for the /api/generate endpoint body. */
export const generateSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt must be under 1000 characters'),
});

/** Schema for the /api/recommendations endpoint body. */
export const recommendationsSchema = z.object({
  productNames: z
    .array(z.string())
    .min(1, 'At least one product name is required'),
});

/** Schema for the /api/printful/create-order endpoint body. */
export const printfulCreateOrderSchema = z.object({
  variantId: z.number().int().positive(),
  designImageUrl: z.string().url(),
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  shipping: z.object({
    name: z.string().min(1),
    address1: z.string().min(1),
    city: z.string().min(1),
    country_code: z.string().length(2),
    zip: z.string().min(1),
    email: z.string().email(),
  }),
});

/** Schema for the checkout shipping address. */
export const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
});

/** Schema for admin product creation/update. */
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});
