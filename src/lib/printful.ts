const PRINTFUL_API_URL = 'https://api.printful.com';

const headers = () => ({
  'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
  'Content-Type': 'application/json',
});

export async function getCatalogProducts() {
  const res = await fetch(`${PRINTFUL_API_URL}/catalog/products`, { headers: headers() });
  return res.json();
}

export async function getProductVariants(productId: number) {
  const res = await fetch(`${PRINTFUL_API_URL}/catalog/products/${productId}/variants`, {
    headers: headers(),
  });
  return res.json();
}

export async function createStoreProduct(
  designImageUrl: string,
  variantId: number,
  title: string,
  price: number
) {
  const res = await fetch(`${PRINTFUL_API_URL}/store/products`, {
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

export async function createOrder(
  variantId: number,
  shippingInfo: {
    name: string;
    address1: string;
    city: string;
    country_code: string;
    zip: string;
    email: string;
  }
) {
  const res = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      recipient: shippingInfo,
      items: [{ variant_id: variantId, quantity: 1 }],
    }),
  });
  return res.json();
}

export async function getShippingRates(variantId: number, countryCode: string) {
  const res = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      recipient: { country_code: countryCode },
      items: [{ variant_id: variantId, quantity: 1 }],
    }),
  });
  return res.json();
}
