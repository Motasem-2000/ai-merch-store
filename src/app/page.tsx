'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const cartItems = useCartStore((s) => s.items);

  useEffect(() => {
    if (cartItems.length === 0) return;
    const names = cartItems.map((i) => i.name);
    fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productNames: names }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendations) setRecommendations(data.recommendations);
      })
      .catch(() => {});
  }, [cartItems]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.design) {
        setGeneratedImage(data.design.image_url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Merch Factory
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Describe your idea, and we&apos;ll turn it into a unique physical product.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="e.g., A cat wearing a wizard hat in Van Gogh style"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 text-lg"
            />
            <Button
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              size="lg"
            >
              {isGenerating ? 'Generating...' : 'Create Magic'}
            </Button>
          </div>
        </Card>

        {generatedImage && (
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Unique Design</h2>
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src={generatedImage}
                alt="Generated design"
                fill
                className="object-contain rounded-lg"
                unoptimized
              />
            </div>
            <Link href="/select-product">
              <Button className="w-full" size="lg">
                Print This on a Product
              </Button>
            </Link>
          </Card>
        )}

        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Browse All Products
            </Button>
          </Link>
        </div>

        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="block">
                    <Card className="p-3 hover:ring-2 hover:ring-purple-500 transition-all">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">${Number(p.price).toFixed(2)}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
