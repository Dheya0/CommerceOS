# CommerceOS — Threat Model (Phase 5 Formal Architecture)

**Version:** 2.0 (Red-Team Hardened & Production Baseline)  
**Classification:** RESTRICTED / INTERNAL  
**Scope:** CommerceOS Multi-Tenant Architecture, Cloud SQL PostgreSQL, Vite/Express Ingress, SaaS Subscriptions, Payments & Edge Services.

---

## 1. Executive Summary & Objective

The objective of this Threat Model is to identify, classify, and mitigate vulnerabilities, threat actors, and attack vectors across CommerceOS prior to production release. We enforce a **Zero-Trust Boundary** where client input is never trusted, tenants cannot escape their isolation boundaries, and financial transactions adhere to deterministic, idempotent state machines.

---

## 2. Sensitive Assets & Classification

| Asset Category | Classification | Confidentiality (C) | Integrity (I) | Availability (A) | Key Protective Controls |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Identities & Passwords** | RESTRICTED | High | High | High | PBKDF2-SHA512 (100,000 iter), constant-time verify, lockout after 5 fails |
| **Session Tokens & Secrets** | RESTRICTED | High | High | High | HMAC-SHA256 tokens (`cos.<b64>.<sig>`), in-memory/DB revocation blacklist |
| **Tenant Store Data & Products** | CONFIDENTIAL | High | High | High | Tenant Resolver, DB-level `tenant_id` WHERE predicates, IDOR guards |
| **Customer PII (Name, Phone, Email)** | CONFIDENTIAL | High | High | High | Role-Based Access Control, API output sanitization, PII minimization |
| **Orders & Cart Data** | CONFIDENTIAL | Medium | High | High | Server-authoritative pricing, DB idempotency keys, atomic transactions |
| **Payments & Transactions** | RESTRICTED | High | High | High | Gateway webhook HMAC verification, legal state machine matrix, anti-tamper total calculation |
| **Refunds & Financial Adjustments** | RESTRICTED | High | High | High | Cumulative refund cap verification (`refundedAmount <= capturedAmount`), RBAC order manager requirement |
| **Inventory & Stock Reservoirs** | INTERNAL | Medium | High | High | Database row-level locking (`SELECT FOR UPDATE`), atomic decrements, negative inventory blocks |
| **SaaS Billing & Quotas** | RESTRICTED | High | High | High | Server-side quota assertions (`assertQuota`), downgrade protection, grace period automaton |
| **API Keys & Webhook Secrets** | RESTRICTED | High | High | High | Encrypted storage, prefixing (`cos_live_`), scope enforcement (`products:read`, etc.), secrets omitted from logs |
| **AI Gemini Credentials & Prompts** | RESTRICTED | High | High | High | Server-only GEMINI_API_KEY, prompt injection sanitization, token length caps |
| **Platform HQ Admin & Audit Logs** | RESTRICTED | High | High | High | Platform Admin role verification, immutable SHA-256 hash chaining, append-only store |
| **Uploaded Files & Receipts** | INTERNAL | Medium | High | High | Magic-byte MIME verification, random UUID naming, strictly blocked executable extensions |

---

## 3. Threat Actors & Adversarial Profiles

1. **Unauthenticated External Attacker**:
   - *Goal*: Exploit public endpoints, bypass auth, perform SQLi/XSS/SSRF, launch brute force, or enumerate users.
   - *Mitigation*: Rate limiting, account lockout, nosniff/HSTS/CSP headers, parameterized ORM queries, generic auth error responses.

2. **Malicious Tenant (Store A attacking Store B)**:
   - *Goal*: Steal competitor sales data, modify products, view customer PII, or pollute shared cache.
   - *Mitigation*: Multi-tenant schema scoping (`tenant_id`), token identity tenant binding, strict IDOR prevention on all CRUD endpoints.

3. **Low-Privilege Staff (Support / Inventory / Marketing)**:
   - *Goal*: Escalate privileges to Store Owner or Platform Admin, issue unauthorized refunds, or export full customer database.
   - *Mitigation*: RBAC permission gates (`requirePermission('orders')`, `requirePermission('settings')`), non-tamperable role tokens.

4. **Malicious or Disgruntled Customer**:
   - *Goal*: Manipulate checkout price (`price = 0.01`), stack expired coupons, force negative inventory, or double-refund orders.
   - *Mitigation*: Server-side price calculation ignoring client values, single-use coupon concurrency locks, state machine guard on refunds.

5. **Automated Bot / Distributed Credential Stuffer**:
   - *Goal*: Brute-force credentials, scrape store catalogs, exhaust AI quotas, or trigger DoS.
   - *Mitigation*: Sliding-window rate limiters, velocity tracking, IP/identity lockout.

6. **Compromised Webhook / Payment Interceptor**:
   - *Goal*: Send fake `PAID` notifications to fulfill unpaid orders without transferring funds.
   - *Mitigation*: Mandatory HMAC-SHA256 signature validation with raw payload preservation, replay nonce tracking, and payment-to-order-to-tenant verification.

---

## 4. Trust Boundaries & Architecture Flow

```text
[ Browser / Client ]
       │  (HTTPS / TLS 1.3 - Security Headers / HSTS / SameSite / Anti-Clickjacking)
       ▼
[ Reverse Proxy / Ingress ]
       │  (Rate Limiter / DDoS & Velocity Guard)
       ▼
[ Express API Gateway ]
       │  (RequestId / Logging / JSON Sanitizer / Anti-Prototype Pollution)
       ├─────────────────────────────────────────────────┐
       ▼                                                 ▼
[ Tenant Resolver & Operational Mode ]          [ Auth & Role Guard (Zero-Trust) ]
  • Resolves Hostname/Header                      • Verifies HMAC Token Signature
  • Checks Store Status (live/frozen/suspended)   • Enforces RBAC & Session Blacklist
       │                                                 │
       └────────────────────────┬────────────────────────┘
                                ▼
                   [ Business Logic Services ]
         • Price Engine (Server Authoritative)
         • Fraud & State Machine Matrix
         • Quota & SaaS Entitlement Assertions
         • Outbound SSRF & Safe Webhook Dispatcher
                                │
                                ▼
                 [ Cloud SQL PostgreSQL & Drizzle ]
         • Scoped SQL Queries (WHERE tenant_id = ?)
         • Row-Level Mutex & Atomic Transactions
         • Append-Only Audit Trail
```

---

## 5. Threat Analysis (STRIDE Matrix)

| Threat Type | Vector / Scenario | Platform Countermeasure | Verification Test |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Forged JWT / Session Token | HMAC-SHA256 signature verification with unguessable server secret | `tampered token rejected by HMAC` |
| **Spoofing** | Webhook request forgery | HMAC signature checked against stored webhook secret | `invalid webhook signature rejected (401)` |
| **Tampering** | Client submits `price: 0.01` in checkout | Backend recalculates order total strictly from DB catalog | `checkout price manipulation rejected/corrected` |
| **Tampering** | Parameter pollution `__proto__` | Deep object sanitization drops `__proto__` and `constructor` | `prototype pollution payload neutralized` |
| **Repudiation** | Merchant denies altering plan or refund | Immutable SHA-256 audit log records actor, IP, timestamp, and diff | `audit log recorded for administrative changes` |
| **Information Disclosure** | User enumeration via login errors | Identical `401 Invalid email or password` for all auth failures | `unknown email vs wrong password response parity` |
| **Information Disclosure** | Database error exposes internal SQL | Central error handler sanitizes stack traces in production | `error response strips SQL/internal paths` |
| **Denial of Service** | Zip Bomb uploaded by merchant | Decompression ratio capped at 15x, max 50MB compressed / 200MB uncompressed | `archive decompression limits enforced` |
| **Denial of Service** | Infinite regex backtracking (ReDoS) | Linear-time regex patterns, length caps on input strings | `evil regex input tested without blocking event loop` |
| **Elevation of Privilege** | Support agent submits `role: "store_owner"` | Role derived exclusively from verified JWT, not request body | `body role manipulation ignored` |
| **Elevation of Privilege** | Store Owner accesses Platform HQ APIs | Route guards require `identityType === 'platform_admin'` | `store owner rejected from /api/v1/admin` |

---

## 6. Residual Risks & Accepted Constraints

1. **In-Memory Cache in Non-Clustered Mode**: Single-instance deployment maintains rate limiting and session blacklisting in process memory; in multi-node clusters, Redis backing is configured via `configService.get('redis')`.
2. **Third-Party Payment Gateways**: CommerceOS does not store primary account numbers (PAN) or CVVs, relying exclusively on PCI-DSS Level 1 tokenized providers (Moyasar, Stripe).
