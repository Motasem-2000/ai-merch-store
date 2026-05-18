import type { UserRole, PermissionAction } from '@/types/auth';
import { PERMISSIONS } from '@/types/auth';
import { ForbiddenError, UnauthorizedError } from '@/lib/errors';

/** Check whether a role includes a specific permission. */
export function hasPermission(
  userRole: UserRole,
  action: PermissionAction,
): boolean {
  return PERMISSIONS[userRole]?.includes(action) ?? false;
}

/** Throw if the role lacks a permission. */
export function requirePermission(
  userRole: UserRole | undefined,
  action: PermissionAction,
): void {
  if (!userRole) {
    throw new UnauthorizedError();
  }
  if (!hasPermission(userRole, action)) {
    throw new ForbiddenError(`Missing permission: ${action}`);
  }
}

/** Return true only for admin role. */
export function isAdmin(role: UserRole | undefined): boolean {
  return role === 'admin';
}
