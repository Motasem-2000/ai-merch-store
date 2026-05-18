import { describe, it, expect } from 'vitest';
import { hasPermission, requirePermission, isAdmin } from '@/lib/auth/permissions';

describe('permissions', () => {
  describe('hasPermission', () => {
    it('grants admin all permissions', () => {
      expect(hasPermission('admin', 'create_product')).toBe(true);
      expect(hasPermission('admin', 'delete_product')).toBe(true);
      expect(hasPermission('admin', 'manage_users')).toBe(true);
      expect(hasPermission('admin', 'view_audit_logs')).toBe(true);
    });

    it('restricts customer to view-only permissions', () => {
      expect(hasPermission('customer', 'view_products')).toBe(true);
      expect(hasPermission('customer', 'view_orders')).toBe(true);
      expect(hasPermission('customer', 'create_product')).toBe(false);
      expect(hasPermission('customer', 'delete_product')).toBe(false);
      expect(hasPermission('customer', 'manage_users')).toBe(false);
    });

    it('grants moderator edit but not delete or manage permissions', () => {
      expect(hasPermission('moderator', 'edit_product')).toBe(true);
      expect(hasPermission('moderator', 'view_audit_logs')).toBe(true);
      expect(hasPermission('moderator', 'delete_product')).toBe(false);
      expect(hasPermission('moderator', 'manage_users')).toBe(false);
    });
  });

  describe('requirePermission', () => {
    it('does not throw for a valid permission', () => {
      expect(() => requirePermission('admin', 'create_product')).not.toThrow();
    });

    it('throws UnauthorizedError when role is undefined', () => {
      expect(() => requirePermission(undefined, 'create_product')).toThrow(
        'Authentication required',
      );
    });

    it('throws ForbiddenError when role lacks permission', () => {
      expect(() => requirePermission('customer', 'delete_product')).toThrow(
        'Missing permission: delete_product',
      );
    });
  });

  describe('isAdmin', () => {
    it('returns true for admin role', () => {
      expect(isAdmin('admin')).toBe(true);
    });

    it('returns false for customer role', () => {
      expect(isAdmin('customer')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isAdmin(undefined)).toBe(false);
    });
  });
});
