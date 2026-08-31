# CommerceOS — Data Retention & Deletion Policy

## 1. Retention Schedule

| Data Type | Retention Period | Post-Retention Action | Justification |
| :--- | :--- | :--- | :--- |
| **Active Store & Product Data** | Duration of active subscription | Retained in primary Cloud SQL DB | Core operational requirement |
| **Cancelled / Past-Due Tenant** | 90 Days post-cancellation | Soft-deleted for 90 days, then anonymized & archived | Grace period & merchant recovery window |
| **Customer Orders & Invoices** | 5 Years | Archived in cold storage | Saudi Tax & ZATCA regulatory compliance |
| **Revoked Session Blacklist** | Expiration timestamp + 24 hours | Hard-deleted automatically | Prevents memory leak in token store |
| **Security & Audit Logs** | 1 Year | Immutable append-only log store | Forensic analysis and compliance proof |
| **Inbound Webhook Delivery Logs**| 30 Days | Pruned by automated background worker | Debugging & delivery retry window |
| **Uploaded Bank Receipts** | 1 Year post-order completion | Scrambled / securely deleted | Financial auditing |

## 2. Secure Deletion Standard
- **Soft Deletion**: Records have `status: 'archived'` or `deleted_at: timestamp` set to block storefront access while preserving historical references.
- **Hard Deletion / Anonymization**: When merchant requests GDPR/PDPL deletion ("Right to be Forgotten"):
  - Customer PII fields (`email`, `phone`, `name`, `address`) are replaced with `DELETED_USER_<UUID>`.
  - Financial records are preserved in anonymized form for VAT reconciliation.
