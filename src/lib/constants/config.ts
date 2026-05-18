export const APP_NAME = 'AI Merch Factory';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const DESIGN_STATUS = {
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const SUPABASE_TABLES = {
  PROFILES: 'profiles',
  DESIGNS: 'designs',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  AUDIT_LOGS: 'audit_logs',
} as const;

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
} as const;

export const API_ENDPOINTS = {
  PRINTFUL: 'https://api.printful.com',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  HUGGINGFACE_FLUX: 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev',
} as const;
