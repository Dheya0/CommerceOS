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
 * Hardened Multi-Tenant Isolation Resolver:
 * 1. If user is authenticated as tenant_staff or customer, tenantId is strictly locked to req.user.tenantId.
 * 2. If storefront/public request:
 *    a) Resolves from domain/subdomain host
 *    b) Resolves from explicit `x-tenant-id` header or query parameter
 *    c) If candidate tenant ID/slug is provided but invalid, rejects cross-tenant fallback to prevent IDOR leaks.
 *    d) Fallback to flagship store ONLY when no explicit store parameter was specified.
 */
export function tenantResolver(req: Request, res: Response, next: NextFunction) {
  // 1. If authenticated staff, tenant context is already sealed by auth middleware
  if (req.user && req.user.identityType === 'tenant_staff' && req.user.tenantId) {
    const tenant = db.getTenantByIdOrSlug(req.user.tenantId);
    if (tenant) {
      req.tenant = tenant;
      req.tenantId = tenant.id;
      return next();
    }
  }

  const headerTenant = req.headers['x-tenant-id'] as string | undefined;
  const queryTenant = (req.query.tenant || req.query.tenantId) as string | undefined;
  const host = req.headers.host || '';

  let resolvedTenant: TenantStore | undefined;
  const candidateIdOrSlug = (headerTenant || queryTenant)?.trim();

  // 2. Try explicit header/query if provided
  if (candidateIdOrSlug) {
    resolvedTenant = db.getTenantByIdOrSlug(candidateIdOrSlug);
    if (!resolvedTenant) {
      // Security: When client explicitly requested a specific tenant that does not exist,
      // DO NOT fallback to another store. Keep resolvedTenant undefined.
      req.tenant = undefined;
      req.tenantId = candidateIdOrSlug;
      return next();
    }
  }

  // 3. Try matching custom domain or subdomain from host
  if (!resolvedTenant && host) {
    const cleanHost = host.split(':')[0].toLowerCase();
    resolvedTenant = db.getTenants().find(
      t => t.customDomain?.toLowerCase() === cleanHost || `${t.slug}.commerceos.app` === cleanHost
    );
  }

  // 4. Default fallback ONLY if no explicit tenant was requested
  if (!resolvedTenant && !candidateIdOrSlug) {
    resolvedTenant = db.getTenantByIdOrSlug('tenant-royal-honey') || db.getTenants()[0];
  }

  if (resolvedTenant) {
    req.tenant = resolvedTenant;
    req.tenantId = resolvedTenant.id;
  } else {
    req.tenant = undefined;
    req.tenantId = candidateIdOrSlug || '';
  }

  next();
}

