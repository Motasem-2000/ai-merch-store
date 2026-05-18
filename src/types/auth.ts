export type UserRole = 'customer' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export type PermissionAction =
  | 'view_products'
  | 'create_product'
  | 'edit_product'
  | 'delete_product'
  | 'view_orders'
  | 'edit_order'
  | 'view_analytics'
  | 'manage_users'
  | 'view_audit_logs';

export const PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  customer: ['view_products', 'view_orders'],
  admin: [
    'view_products',
    'create_product',
    'edit_product',
    'delete_product',
    'view_orders',
    'edit_order',
    'view_analytics',
    'manage_users',
    'view_audit_logs',
  ],
  moderator: [
    'view_products',
    'edit_product',
    'view_orders',
    'edit_order',
    'view_audit_logs',
  ],
};
