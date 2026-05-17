'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductSkeleton } from '@/components/loading-spinner';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-lg text-muted-foreground">
          No products yet. Please add some in Supabase.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-muted">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
            </Link>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-lg font-semibold">${Number(product.price).toFixed(2)}</p>
              {product.stock <= 0 && (
                <p className="text-sm text-destructive">Out of stock</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={product.stock <= 0}
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image_url: product.image_url,
                  })
                }
              >
                {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
