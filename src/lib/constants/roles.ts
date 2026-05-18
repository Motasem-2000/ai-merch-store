import type { UserRole } from '@/types/auth';

export const ADMIN_ROLES: UserRole[] = ['admin'];

export const MODERATOR_ROLES: UserRole[] = ['admin', 'moderator'];

export const DEFAULT_ROLE: UserRole = 'customer';
