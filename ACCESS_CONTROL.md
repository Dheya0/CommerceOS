# CommerceOS — Access Control & Authorization Architecture

## 1. Zero-Trust Authorization Model
CommerceOS implements a layered, Zero-Trust authorization system ensuring that identity, tenant boundary, and object-level permissions are validated on every single HTTP request.

### A. Authentication Verification
- Authentication tokens are encoded in standard format: `cos.<base64UrlPayload>.<hmacSignature>`.
- Cryptographically signed with server secret using HMAC-SHA256.
- Contains immutable user identity, assigned role, and associated tenant ID.
- Tested against blacklist revocation repository on every request.

### B. Tenant Boundary Isolation
- **Tenant Resolver Middleware**: Extracts the current tenant from domain hostnames or authenticated token contexts.
- **Request Tenant Binding**: When accessing `/api/v1/*` routes, the authenticated user's `token.tenantId` is strictly checked against the requested resource.
- Cross-tenant requests (e.g. User from Tenant A trying to modify Tenant B's order) are strictly rejected with `403 Forbidden` and logged to the security audit trail.

### C. Role-Based Access Control (RBAC) Matrix

| Staff Role | Orders & Refunds | Products & Catalog | Customers | Marketing & Coupons | Settings & SaaS Billing | Staff Management |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Store Owner** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Store Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Order Manager** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Product Manager** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Marketing Specialist** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Support Agent** | 👁️ (Read Only) | 👁️ (Read Only) | 👁️ (Read Only) | ❌ | ❌ | ❌ |

### D. Platform Super Admin Boundary
- Platform APIs (`/api/v1/admin/*`, `/api/v1/saas/overrides`) require `identityType === 'platform_admin'`.
- Tenant store owners or merchant admins are strictly blocked from platform operations regardless of their local role.
- Any manual override requires a mandatory audit reason logged to the tamper-evident audit ledger.
