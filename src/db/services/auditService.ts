import { db } from '../index.ts';
import { auditLogs } from '../schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface CreateAuditLogParams {
  tenantId: string;
  action: string;
  performedBy: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Log an administrative or transactional action into PostgreSQL
   */
  static async record(params: CreateAuditLogParams): Promise<void> {
    try {
      const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await db.insert(auditLogs).values({
        id,
        tenantId: params.tenantId,
        action: params.action,
        performedBy: params.performedBy,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        createdAt: new Date()
      });
    } catch (err) {
      console.error('[AuditService] Failed to write audit log to PostgreSQL:', err);
    }
  }

  /**
   * Fetch recent audit logs for a specific tenant (strictly tenant-scoped)
   */
  static async getLogsByTenant(tenantId: string, limitCount = 50) {
    try {
      return await db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.tenantId, tenantId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limitCount);
    } catch (err) {
      console.error('[AuditService] Failed to fetch audit logs:', err);
      return [];
    }
  }
}
