import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  errorResponse,
} from '@/lib/errors';

describe('error classes', () => {
  it('AppError has correct defaults', () => {
    const err = new AppError('test');
    expect(err.message).toBe('test');
    expect(err.statusCode).toBe(500);
    expect(err.name).toBe('AppError');
  });

  it('ValidationError is a 400', () => {
    const err = new ValidationError('bad input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('UnauthorizedError is a 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('ForbiddenError is a 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('NotFoundError is a 404', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
  });

  it('ConflictError is a 409', () => {
    const err = new ConflictError('duplicate');
    expect(err.statusCode).toBe(409);
  });
});

describe('errorResponse', () => {
  it('returns correct status for AppError', async () => {
    const res = errorResponse(new ValidationError('oops'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('oops');
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 500 for unknown errors', async () => {
    const res = errorResponse(new Error('unexpected'));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Internal server error');
  });
});
