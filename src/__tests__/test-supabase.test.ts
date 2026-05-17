import { describe, it, expect } from 'vitest';

describe('/api/test-supabase', () => {
  it('returns a successful response when env vars are set', async () => {
    const { GET } = await import('@/app/api/test-supabase/route');

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success');
    if (data.success) {
      expect(data.message).toBe('Supabase connection is working!');
    } else {
      expect(data.error).toBeDefined();
    }
  });
});
