# Sovereign CommerceOS Design System — Foundation (Phase D0)

## 1. Overview & Brand Direction

**CommerceOS** is a sovereign, multi-tenant enterprise e-commerce platform. The visual identity embodies:
- **Atmosphere**: Sovereign, Deep Navy base, Warm Gold accents, precision borders, subtle metallic feel, refined typography.
- **Personality**: Premium, Calm, Confident, Modern, Technical, Trustworthy, Sovereign, Minimal, Precise.
- **Anti-Patterns Banned**: No neon gradients, no arbitrary glowing glassmorphism, no nested cards, no low-contrast gray text on colored backgrounds, no arbitrary pixel padding.

---

## 2. Color System & Semantic Tokens

### Deep Navy Backgrounds
- **Base** (`#07111F`): Global viewport background.
- **Elevated** (`#0B1626`): Headers, sidebars, elevated containers.
- **Surface** (`#101C2C`): Main card surfaces, table containers.
- **Surface Strong** (`#142238`): High-contrast surfaces, table header rows on hover.
- **Overlay** (`rgba(4, 10, 18, 0.82)`): Modal and backdrop overlay.

### Sovereign Gold Accent Scale
*The Gold palette is an intentional accent—not a global background.*
- **Gold 50** (`#FBF8EE`) / **Gold 100** (`#F5EED5`)
- **Gold 300** (`#E0C77A`): High-contrast gold text / highlights.
- **Gold 400** (`#D4AF37`): Primary Sovereign Accent & Focus Rings.
- **Gold 500** (`#C59B27`): Active / Pressed / Primary CTA state.
- **Gold 600** (`#A9801C`) / **Gold 700** (`#846016`)

### Neutral Silver Scale (50–950)
- **50** (`#F8FAFC`), **100** (`#F1F5F9`): Primary headings and text.
- **300** (`#CBD5E1`): Secondary text & input labels.
- **400** (`#94A3B8`): Muted text & descriptions.
- **500** (`#64748B`), **700** (`#334155`), **800** (`#1E293B`), **900** (`#0F172A`).

### Semantic Status Colors
- **Success** (`#10B981` solid / `#34D399` text / `rgba(16,185,129,0.12)` soft bg).
- **Warning** (`#F59E0B` solid / `#FBBF24` text / `rgba(245,158,11,0.12)` soft bg).
- **Danger** (`#EF4444` solid / `#F87171` text / `rgba(239,68,68,0.12)` soft bg).
- **Info** (`#0EA5E9` solid / `#38BDF8` text / `rgba(56,189,248,0.12)` soft bg).

---

## 3. Typography Scale & Multilingual Hierarchy

CommerceOS provides **Arabic-first excellence** paired with crisp English typography:
- **Arabic Font**: `IBM Plex Sans Arabic`, `Alexandria`, `Tajawal`
- **English Font**: `Plus Jakarta Sans`, `system-ui`
- **Monospace**: `JetBrains Mono`, `Fira Code`

| Level | Size | Line Height | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `2.5rem (40px)` | 1.2 | 800 | -0.025em |
| **Heading 1** | `2.0rem (32px)` | 1.25 | 700 | -0.02em |
| **Heading 2** | `1.5rem (24px)` | 1.3 | 700 | -0.015em |
| **Heading 3** | `1.25rem (20px)` | 1.4 | 600 | -0.01em |
| **Body Large**| `1.125rem (18px)`| 1.6 | 400 | 0 |
| **Body** | `1.0rem (16px)` | 1.6 | 400 | 0 |
| **Body Small**| `0.875rem (14px)`| 1.5 | 400 | 0 |
| **Caption** | `0.75rem (12px)` | 1.4 | 500 | +0.01em |
| **Label** | `0.8125rem (13px)`| 1.4 | 600 | +0.02em |

---

## 4. Geometric Tokens & Elevation

### Spacing Scale
`4px (1)`, `8px (2)`, `12px (3)`, `16px (4)`, `20px (5)`, `24px (6)`, `32px (8)`, `40px (10)`, `48px (12)`, `64px (16)`, `80px (20)`, `96px (24)`.

### Border Radius Scale
- `xs` (4px), `sm` (6px), `md` (8px - inputs & buttons), `lg` (12px), `xl` (16px - cards), `2xl` (20px - modals), `pill` (9999px).

### Glass Levels
- **Glass Subtle**: `rgba(16, 28, 44, 0.45)` with `backdrop-filter: blur(8px)`.
- **Glass Medium**: `rgba(16, 28, 44, 0.70)` with `backdrop-filter: blur(16px)`.
- **Glass Strong**: `rgba(11, 22, 38, 0.88)` with `backdrop-filter: blur(24px)`.

---

## 5. Core Components Inventory

All components are located in `src/design-system/components/` and exported via `src/design-system/index.ts`:

1. **Buttons & Actions**:
   - `Button`: Variants (`primary`, `secondary`, `tertiary`, `ghost`, `danger`, `success`), sizes (`xs`, `sm`, `md`, `lg`), `isLoading`, `disabled`, `leftIcon`, `rightIcon`.
   - `IconButton`: Accessible icon trigger with aria labels and tooltips.

2. **Form Controls**:
   - `Input`, `SearchInput`, `PasswordInput`, `Textarea`, `Select`.
   - `Field`: Modular wrapper providing `label`, `description`, `error`, `success`, `required`, and `tooltip`.
   - `Checkbox`, `Radio`, `Switch`: Fully accessible with keyboard navigation and focus rings.

3. **Surfaces & Cards**:
   - `Card`: Surface variants (`default`, `elevated`, `interactive`, `glass`, `warning`, `danger`).
   - `MetricCard`: KPI card with value, trend (+14.2% up/down), comparison, and icon.
   - `ChartCard`: Container with title, subtitle, filter slot, and responsive chart viewport.

4. **Badges & Health**:
   - `Badge`: Variants (`neutral`, `success`, `warning`, `danger`, `info`, `gold`), with optional animated pulsing dot.
   - `StatusBadge`: Pre-configured for system states (`healthy`, `degraded`, `failed`, `pending`, `offline`).

5. **Data Table**:
   - `DataTable`: Generic typed table with sorting, multi-row selection, density toggle (`comfortable` / `compact`), pagination, empty state, and skeleton loading.

6. **Feedback & Overlays**:
   - `Modal`, `ConfirmDialog` (with danger mode), `Drawer` (slide-in).
   - `Skeleton`, `SkeletonText`, `SkeletonCard`, `Spinner`, `Progress`, `EmptyState`, `ErrorState`.
   - `Tooltip`, `Popover`.

7. **Navigation Primitives**:
   - `AppShell`, `Sidebar`, `SidebarItem`, `PageHeader`, `Breadcrumbs`, `PageContainer`, `PageSection`.

---

## 6. Accessibility, RTL/LTR & Quality Gate

- **RTL-First Architecture**: Uses logical CSS properties (`start`, `end`, `ps-`, `pe-`, `border-s-`, `border-e-`) ensuring zero layout defects when switching between Arabic and English.
- **Focus System**: Gold double-ring focus indicator (`focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]`).
- **Contrast**: Text elements strictly meet WCAG AA (4.5:1 for body text, 3:1 for large display).
- **Reduced Motion**: Respects system `prefers-reduced-motion`.

---

## 7. Migration Roadmap

- **Phase D0 (Current)**: Unified Design System Foundation in `src/design-system/`.
- **Phase D1 (Next)**: Redesigning Authentication & Onboarding (Login, Register, Forgot Password, Verification).
- **Phase D2**: Redesigning Merchant Dashboard & Analytics.
- **Phase D3**: Redesigning Orders & Inventory Management.
- **Phase D4**: Redesigning Products & Catalog.
- **Phase D5**: Redesigning Store Builder & Customizer.
- **Phase D6**: Redesigning Storefront & Platform Control Plane.
