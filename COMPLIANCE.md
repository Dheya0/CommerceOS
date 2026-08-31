# CommerceOS — Compliance Baseline & Security Standards

## 1. Compliance Standards Alignment

CommerceOS adheres to established international and regional cybersecurity frameworks:

- **OWASP ASVS v4.0 (Application Security Verification Standard)**: Level 2 compliant across Authentication, Session Management, Access Control, Malicious Code, and Multi-Tenancy.
- **OWASP Top 10 (2021)**: Formally hardened against Injection (A03), Broken Access Control (A01), Cryptographic Failures (A02), Insecure Design (A04), Security Misconfiguration (A05), and SSRF (A10).
- **OWASP API Security Top 10 (2023)**: Hardened against Broken Object Level Authorization (API1:2023), Broken Authentication (API2:2023), Broken Object Property Level Authorization (API3:2023), and Unrestricted Resource Consumption (API4:2023).
- **PCI-DSS Scope Minimization**:
  - Full card data (PAN, CVV, PIN) is **NEVER** received, processed, or stored on CommerceOS servers.
  - All card entry is tokenized client-side via PCI-DSS Level 1 compliant gateway SDKs (Moyasar, Stripe).
- **ZATCA (Fatoora) E-Invoicing Phase 2**:
  - Standard tax invoice structure, mandatory 15% VAT calculation, UUID v4 invoice identification, and TLV-encoded cryptographic QR stamps.
- **Saudi Personal Data Protection Law (PDPL) & GDPR**:
  - Right to data export (JSON format).
  - Explicit customer consent tracking.
  - Retention policies with automated sanitization.

---

## 2. Data Classification Matrix

| Data Tier | Examples | Storage Location | Access Controls | Encryption |
| :--- | :--- | :--- | :--- | :--- |
| **RESTRICTED** | Password hashes, JWT secrets, Webhook signing keys, API keys | Environment Variables, Cloud SQL | Platform Super Admin Only | Encrypted at Rest & in Transit (TLS 1.3 / PBKDF2) |
| **SENSITIVE / PII** | Customer names, emails, phone numbers, delivery addresses | Cloud SQL (PostgreSQL) | Store Owner, Authorized Staff | TLS 1.3, Scoped by `tenant_id` |
| **CONFIDENTIAL** | Order totals, sales analytics, subscription invoices, inventory | Cloud SQL (PostgreSQL) | Merchant Staff with RBAC | Scoped by `tenant_id` |
| **INTERNAL** | System health metrics, error logs, job queues | In-Memory / Structured Logger | Platform Engineers | Redacted (Zero PII/Secrets) |
| **PUBLIC** | Published store themes, public product catalogs, pricing plans | CDN / Cloud Storage | Public Storefront Visitors | Public HTTPS |

---

## 3. Third-Party Vendor Data Processing Inventory (DPA)

| Vendor | Service Provided | Data Shared | Location / Transfer Mechanism |
| :--- | :--- | :--- | :--- |
| **Google Cloud Platform** | Cloud Run, Cloud SQL (PostgreSQL) | Application data, Database records | us-central1 / VPC Private Network |
| **Google Gemini API** | AI-assisted product descriptions & analytics | Sanitized product prompt text only (No customer PII) | HTTPS Encrypted API Calls |
| **Moyasar / Stripe** | Payment Processing | Tokenized payment references, Order amounts (No PAN stored) | Direct Gateway API (PCI-DSS L1) |
