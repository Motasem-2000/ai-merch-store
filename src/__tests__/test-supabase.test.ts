import { describe, it, expect } from 'vitest';

describe('/api/test-supabase', () => {
  it('returns a JSON response with success field', async () => {
    const { GET } = await import('@/app/api/test-supabase/route');

    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    if (data.success) {
      expect(response.status).toBe(200);
      expect(data.message).toBe('Supabase connection is working!');
    } else {
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    }
  });
});
