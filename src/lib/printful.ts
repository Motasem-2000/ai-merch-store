import { API_ENDPOINTS } from '@/lib/constants/config';

const headers = () => ({
  Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
  'Content-Type': 'application/json',
});

/** Fetch the full Printful product catalog. */
export async function getCatalogProducts() {
  const res = await fetch(`${API_ENDPOINTS.PRINTFUL}/catalog/products`, {
    headers: headers(),
  });
  return res.json();
}

/** Fetch available variants for a specific Printful product. */
export async function getProductVariants(productId: number) {
  const res = await fetch(
    `${API_ENDPOINTS.PRINTFUL}/catalog/products/${productId}/variants`,
    { headers: headers() },
  );
  return res.json();
}

/** Create a new product in the connected Printful store. */
export async function createStoreProduct(
  designImageUrl: string,
  variantId: number,
  title: string,
  price: number,
) {
  const res = await fetch(`${API_ENDPOINTS.PRINTFUL}/store/products`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      sync_product: {
        name: title,
        thumbnail: designImageUrl,
      },
      sync_variants: [
        {
          variant_id: variantId,
          retail_price: price.toFixed(2),
          files: [{ url: designImageUrl }],
        },
      ],
    }),
  });
  return res.json();
}

/** Submit an order to Printful for fulfillment. */
export async function createOrder(
  variantId: number,
  shippingInfo: {
    name: string;
    address1: string;
    city: string;
    country_code: string;
    zip: string;
    email: string;
  },
) {
  const res = await fetch(`${API_ENDPOINTS.PRINTFUL}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      recipient: shippingInfo,
      items: [{ variant_id: variantId, quantity: 1 }],
    }),
  });
  return res.json();
}

/** Get estimated shipping rates for a variant to a given country. */
export async function getShippingRates(
  variantId: number,
  countryCode: string,
) {
  const res = await fetch(`${API_ENDPOINTS.PRINTFUL}/shipping/rates`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      recipient: { country_code: countryCode },
      items: [{ variant_id: variantId, quantity: 1 }],
    }),
  });
  return res.json();
}
