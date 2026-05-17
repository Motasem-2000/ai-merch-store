'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import type { User, SupabaseClient } from '@supabase/supabase-js';

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const supabaseRef = useRef<SupabaseClient | null>(null);

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createSupabaseBrowserClient();
    }
    return supabaseRef.current;
  }

  useEffect(() => {
    getSupabase().auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      setLoadingUser(false);
    });
  }, []);

  const handleSignOut = async () => {
    await getSupabase().auth.signOut();
    setUser(null);
    router.refresh();
  };

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
        <div className="flex justify-end">
          {loadingUser ? null : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          )}
        </div>
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
