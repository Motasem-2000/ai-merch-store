'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: Array<{ id: number; name: string; price: number }>;
}

export default function SelectProductPage() {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [selected, setSelected] = useState<PrintfulProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/printful/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.result || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOrder = async () => {
    if (!selected) return;
    const designImageUrl = localStorage.getItem('currentDesign');
    const res = await fetch('/api/printful/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId: selected.variants[0].id,
        designImageUrl,
        title: `Custom Design ${Date.now()}`,
        price: 39.99,
        shipping: {
          name: 'Customer Name',
          address1: '123 Main St',
          city: 'New York',
          country_code: 'US',
          zip: '10001',
          email: 'customer@example.com',
        },
      }),
    });
    const data = await res.json();
    if (data.order) alert('Order placed! ID: ' + data.order.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Product</h1>
      {loading ? (
        <p className="text-center">Loading catalog...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.slice(0, 9).map((p) => (
            <Card
              key={p.id}
              className={`p-4 cursor-pointer ${
                selected?.id === p.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelected(p)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.thumbnail_url} alt={p.name} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-semibold">{p.name}</h3>
            </Card>
          ))}
        </div>
      )}
      {selected && (
        <div className="text-center mt-8">
          <Button onClick={handleOrder} size="lg">
            Order Now
          </Button>
        </div>
      )}
    </div>
  );
}
