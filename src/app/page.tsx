'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Merch Factory
          </h1>
          <p className="text-xl text-gray-600">
            Describe your idea, and we&apos;ll turn it into a unique physical product.
          </p>
        </div>
        <Card className="p-6 space-y-4">
          <div className="flex gap-4">
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
            <Button className="w-full" size="lg">
              Print This on a Product
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
}
