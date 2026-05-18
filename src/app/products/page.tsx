'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductSkeleton } from '@/components/loading-spinner';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(0, PAGE_SIZE - 1)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) {
          setProducts(data);
          if (data.length < PAGE_SIZE) setHasMore(false);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoadMore = useCallback(async () => {
    setLoadingMore(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(products.length, products.length + PAGE_SIZE - 1);

    if (!error && data) {
      setProducts((prev) => [...prev, ...data]);
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoadingMore(false);
  }, [products.length]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-8">
        <h1 className="mb-8 text-3xl font-bold">Products</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <p className="text-muted-foreground text-lg">
          No products yet. Please add some in Supabase.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <Link href={`/products/${product.id}`}>
              <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-t-xl">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center">
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
              {product.stock <= 0 && <p className="text-destructive text-sm">Out of stock</p>}
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

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
