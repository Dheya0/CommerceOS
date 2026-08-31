# CommerceOS — Security Incident Response Plan (S-IRP)

## 1. Six-Stage Incident Lifecycle

```text
[ 1. DETECT ] ──► [ 2. CONTAIN ] ──► [ 3. ERADICATE ] ──► [ 4. RECOVER ] ──► [ 5. COMMUNICATE ] ──► [ 6. POSTMORTEM ]
```

### Stage 1: Detection & Triage
- Automated alerts triggered by:
  - 5+ failed login attempts within 1 minute (Brute force alert).
  - Cross-tenant IDOR access attempts (Security event logged with IP & token).
  - Webhook signature validation failures (> 10 failures/min).
  - Velocity fraud score ≥ 80.
- Incident Commander assigned within 15 minutes.

### Stage 2: Containment
- **Compromised Account**: Revoke active session tokens immediately using `sessionRevocation.revokeAllUserSessions(userId)`.
- **Compromised API Key**: Call `saasBillingService.revokeApiKey(tenantId, keyId)`.
- **Targeted Tenant Abuse**: Set tenant operational mode to `frozen` or `suspended` to block mutations.
- **IP Block**: Block abusive IP ranges at the Reverse Proxy / Cloud Armor WAF layer.

### Stage 3: Eradication
- Identify the root cause vulnerability (e.g. malformed DTO, missing RBAC check).
- Patch codebase and verify with automated Red-Team test suite.
- Rotate any potentially exposed environment secrets (JWT_SECRET, WEBHOOK_SECRET).

### Stage 4: Recovery & Verification
- Restore affected database states from point-in-time PostgreSQL backups if corruption occurred.
- Run integrity verification on order and balance ledgers.
- Return operational mode from `frozen` to `live`.

### Stage 5: Communication
- If customer PII was compromised, notify affected merchants and national data protection authorities (e.g. SDAIA / PDPL) within 72 hours.
- Issue transparent status page incident update.

### Stage 6: Postmortem
- Publish blameless root-cause analysis (RCA) document within 5 business days detailing timeline, impact, lessons learned, and automated regression test additions.

---

## 2. Security Contacts & Escalation Matrix

| Role | Contact | Primary Responsibility |
| :--- | :--- | :--- |
| **Incident Commander** | `Dia840990@gmail.com` | Overall triage, decision-making, stakeholder notification |
| **Security Lead** | `security@commerceos.app` | Vulnerability analysis, exploit containment, patch audit |
| **Infrastructure Lead** | `infra@commerceos.app` | Database backups, Cloud SQL failover, network isolation |
| **Payment Lead** | `payments@commerceos.app` | Gateway dispute triage, refund locks, reconciliation audit |
