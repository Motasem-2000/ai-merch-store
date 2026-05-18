'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pencil, Trash2, Plus, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { supabase } from '@/lib/supabase';
import { productSchema } from '@/lib/validations';
import type { Product } from '@/types/product';
import type { UserRole } from '@/types/auth';
import type { User } from '@supabase/supabase-js';

export default function AdminProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);

      // Check admin role via profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const userRole = (profile?.role as UserRole) ?? 'customer';
      setRole(userRole);
      setAuthLoading(false);
    });
  }, [router]);

  const loadProducts = useCallback(async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user || !role) return;
    if (role !== 'admin') return;
    let cancelled = false;
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setProducts(data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, role]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true });
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    const validation = productSchema.safeParse({
      name,
      description: description || null,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    });
    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      setSaving(false);
      return;
    }

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const productData: Record<string, unknown> = {
      name,
      description: description || null,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    };
    if (imageUrl) productData.image_url = imageUrl;

    if (editingId) {
      await supabase.from('products').update(productData).eq('id', editingId);
    } else {
      await supabase.from('products').insert(productData);
    }

    resetForm();
    await loadProducts();
    setSaving(false);
  };

  const handleEdit = useCallback((product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description ?? '');
    setPrice(String(product.price));
    setStock(String(product.stock));
    setFormError(null);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Delete this product?')) return;
      await supabase.from('products').delete().eq('id', id);
      await loadProducts();
    },
    [loadProducts],
  );

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setImageFile(null);
    setFormError(null);
  };

  if (authLoading) return <LoadingSpinner className="py-32" />;
  if (!user) return null;

  // Block non-admin users
  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <ShieldAlert className="size-12 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to access the admin panel.
        </p>
        <Button onClick={() => router.push('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Admin: Manage Products</h1>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {formError && (
              <p className="text-sm text-destructive sm:col-span-2">
                {formError}
              </p>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={saving}>
                <Plus className="mr-1 size-4" />
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Product'
                    : 'Add Product'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground">No products yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${Number(p.price).toFixed(2)} · Stock: {p.stock}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleEdit(p)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-muted/50">
        <CardContent className="space-y-2 p-4">
          <h3 className="font-semibold">Supabase Storage Setup</h3>
          <p className="text-sm text-muted-foreground">
            To enable image uploads, create a bucket named{' '}
            <code className="font-mono text-foreground">product-images</code> in
            Supabase Storage with public access. Then add this policy in the SQL
            Editor:
          </p>
          <pre className="overflow-x-auto rounded bg-background p-3 text-xs">
            {`CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IS NOT NULL
  );`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
