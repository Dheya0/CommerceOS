import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { TenantStore } from '../../src/types';

// Extend Express Request to include resolved tenant
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantStore;
      tenantId: string;
    }
  }
}

/**
 * Resolves active tenant from:
 * 1. `x-tenant-id` header
 * 2. `tenant` or `tenantId` query param
 * 3. Hostname / subdomain / custom domain
 * 4. Fallback to first active flagship tenant
 */
export function tenantResolver(req: Request, res: Response, next: NextFunction) {
  const headerTenant = req.headers['x-tenant-id'] as string | undefined;
  const queryTenant = (req.query.tenant || req.query.tenantId) as string | undefined;
  const host = req.headers.host || '';

  let resolvedTenant: TenantStore | undefined;

  // 1. Try explicit header/query if provided
  const candidateIdOrSlug = headerTenant || queryTenant;
  if (candidateIdOrSlug) {
    resolvedTenant = db.getTenantByIdOrSlug(candidateIdOrSlug);
  }

  // 2. Try matching custom domain or subdomain from host
  if (!resolvedTenant && host) {
    const cleanHost = host.split(':')[0].toLowerCase();
    resolvedTenant = db.getTenants().find(
      t => t.customDomain?.toLowerCase() === cleanHost || `${t.slug}.commerceos.app` === cleanHost
    );
  }

  // 3. Fallback to default flagship store
  if (!resolvedTenant) {
    resolvedTenant = db.getTenantByIdOrSlug('tenant-royal-honey') || db.getTenants()[0];
  }

  if (resolvedTenant) {
    req.tenant = resolvedTenant;
    req.tenantId = resolvedTenant.id;
  } else {
    req.tenantId = 'tenant-royal-honey';
  }

  next();
}
