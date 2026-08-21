import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { TenantStore } from '../../src/types';

// Extend Express Request to include resolved tenant
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantStore;
      tenantId?: string;
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

  let matchedTenant: TenantStore | undefined;

  // 1. Check Header
  if (headerTenant) {
    matchedTenant = db.getTenantByIdOrSlug(headerTenant);
  }

  // 2. Check Query
  if (!matchedTenant && queryTenant) {
    matchedTenant = db.getTenantByIdOrSlug(queryTenant);
  }

  // 3. Check Host / Custom Domain
  if (!matchedTenant && host) {
    const cleanHost = host.split(':')[0].toLowerCase();
    matchedTenant = db.getTenants().find(t => 
      t.domain.toLowerCase() === cleanHost || 
      (t.customDomain && t.customDomain.toLowerCase() === cleanHost)
    );
  }

  // 4. Default fallback to flagship store
  if (!matchedTenant) {
    const all = db.getTenants();
    matchedTenant = all[0];
  }

  if (matchedTenant) {
    req.tenant = matchedTenant;
    req.tenantId = matchedTenant.id;
  }

  next();
}
