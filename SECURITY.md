# CommerceOS — Security Policy & Vulnerability Management

## 1. Vulnerability Reporting & Responsible Disclosure
We take the security of CommerceOS and our merchants seriously. If you discover a security vulnerability, please report it via our dedicated security inbox:

- **Security Team Email**: `security@commerceos.app` / `Dia840990@gmail.com`
- **PGP Key**: Fingerprint `9B4E 2F81 7A0C D4E1 556A 8910 C3B9 4E21 00F4 A8B2`
- **Response SLA**: Initial triage within **24 hours**, fix deployment within **72 hours** for Critical findings.

Please do not disclose vulnerabilities publicly or exploit them beyond the minimum necessary to verify existence.

---

## 2. Severity Classification Matrix

| Severity | Definition / Examples | Remediation SLA | Release Gate Policy |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | Authentication bypass, Tenant boundary escape, Arbitrary code execution, Payment manipulation, Plaintext secret exposure | **< 24 Hours** | 🚫 **Blocks Release** (Zero tolerance) |
| **HIGH** | Privilege escalation, Stored XSS, Mass data exposure, Webhook forgery, Unauthorized refund issuance | **< 72 Hours** | 🚫 **Blocks Release** unless formally accepted by Security Lead |
| **MEDIUM** | Non-sensitive information disclosure, Weak rate-limits on low-impact routes, CSRF on read-only actions | **< 14 Days** | Allowed with documented mitigation plan |
| **LOW** | Minor security header omissions in non-production, cosmetic error formatting gaps | **< 30 Days** | Non-blocking |

---

## 3. Production Release Gate Criteria
No build is promoted to production unless all of the following conditions are verified:
- [x] Zero (0) Unresolved Critical Vulnerabilities.
- [x] Zero (0) Unresolved High Vulnerabilities on financial, isolation, or authentication routes.
- [x] 100% Automated Security Regression Test Suite Passing.
- [x] Full Git History & Frontend Bundle Secrets Scan clean.
- [x] All database queries parameterized via Drizzle ORM (Zero raw unsanitized SQL).
- [x] Mandatory ZATCA Phase 2 and PCI-DSS tokenization boundaries preserved.
