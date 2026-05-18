import { createClient } from '@supabase/supabase-js';
import { SUPABASE_TABLES } from '@/lib/constants/config';

interface AuditEntry {
  adminId: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/** Write an entry to the audit_logs table. Fails silently to avoid blocking the main operation. */
export async function createAuditLog(entry: AuditEntry): Promise<void> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    await supabase.from(SUPABASE_TABLES.AUDIT_LOGS).insert({
      admin_id: entry.adminId,
      action: entry.action,
      table_name: entry.tableName,
      record_id: entry.recordId,
      old_values: entry.oldValues ?? null,
      new_values: entry.newValues ?? null,
      ip_address: entry.ipAddress ?? null,
      user_agent: entry.userAgent ?? null,
    });
  } catch (err) {
    console.error('Audit log write failed:', err);
  }
}

/** Extract client IP from request headers. */
export function getClientIp(headers: Headers): string | null {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    null
  );
}
