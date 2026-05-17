'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError('Product not found.');
        else setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner className="py-32" />;

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <h1 className="text-2xl font-bold text-destructive">{error ?? 'Product not found'}</h1>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <Link href="/products" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-lg">
              No Image Available
            </div>
          )}
        </div>
        <Card>
          <CardContent className="space-y-6 p-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold text-purple-600 mt-2">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}
            <div>
              <p className="text-sm font-medium mb-1">
                Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </p>
            </div>
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <label htmlFor="qty" className="text-sm font-medium">Quantity:</label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (v >= 1 && v <= product.stock) setQuantity(v);
                  }}
                  className="w-20"
                />
              </div>
            )}
            <Button
              size="lg"
              className="w-full"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              {added ? 'Added!' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
