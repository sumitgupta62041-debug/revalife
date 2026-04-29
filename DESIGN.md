# Design Brief — revAlife Premium Wellness E-Commerce

**Purpose:** Science-backed Indian wellness platform combining premium brand identity with streamlined UX. Unified design across store, authentication, admin, and assistant interfaces emphasizing trust, clarity, and mobile-first accessibility.

**Tone:** Anti-generic wellness brand. Emerald green accents on white signal health/growth. Card-based rhythm with typography hierarchy (General Sans + Lora) conveys premium, science-backed credentials. Zero cheap gradients or scammy elements.

| **Palette** | OKLCH | Role |
|---|---|---|
| Background | 0.99 0.001 0 (light) / 0.08 0 0 (dark) | Primary surface |
| Foreground | 0.2 0.002 0 (light) / 0.95 0.003 0 (dark) | Text |
| Primary Green | 0.64 0.16 152 (light) / 0.72 0.16 152 (dark) | CTAs, active states |
| Secondary Green | 0.82 0.08 152 (light) / 0.32 0.08 152 (dark) | Secondary actions |
| Card | 1 0 0 (light) / 0.13 0.003 0 (dark) | Content containers |
| Muted | 0.93 0.005 0 (light) / 0.28 0.002 0 (dark) | Placeholders, disabled |
| Border | 0.92 0.003 0 (light) / 0.24 0.002 0 (dark) | Dividers |
| Destructive | 0.62 0.22 29 | Alerts, delete actions |

| **Structural Zones** | Treatment |
|---|---|
| Header | `bg-background border-b` with green accent line; sticky on mobile |
| Sidebar (Admin) | `bg-sidebar` deep dark with green primary nav indicators |
| Hero/Content | `bg-background` white/dark background; card sections with `shadow-card` |
| Product Cards | Image full-width, title/price/badge/CTA bottom; rounded-lg with hover lift |
| Auth Modal | Centered overlay with fade-in; form-first, green primary CTA |
| Right Drawer (Cart) | Position fixed top-0 right-0 h-full w-[380px]; overlay behind; slide-in from right |
| Forms | Stacked inputs, green primary buttons, rounded borders, clear labels |
| Footer | `bg-muted/20 border-t` minimal links, centered on mobile |

**Typography:** General Sans (display h1–h6, buttons, labels) + Lora (body, descriptions) + Geist Mono (data, code). Scale: h1 2rem, h2 1.5rem, body 1rem, label 0.875rem, caption 0.75rem. Line height body 1.65, display 1.25.

**Shape Language:** Cards 0.75rem radius; inputs/buttons inherit; data tables 0px (sharp). Borders 1px semantic colors. Consistent 8px spacing grid.

**Elevation:** `shadow-subtle` (input focus), `shadow-card` (containers), `shadow-elevated` (modals, drawers). Shadows use OKLCH blacks—no cheap color overlays.

**Components:** Primary CTA `bg-primary text-primary-foreground rounded-lg`. Secondary `border border-border`. Product cards: image + meta + price + badge. Right cart drawer: full height, overlay, quantity controls, checkout buttons. Auth modal: centered, green primary.

**Motion:** `transition-smooth` 0.25s ease (buttons, hovers). Fade-in + slide-in for content. No bouncy/parallax. Drawer slides left-to-right with overlay fade.

**Responsive:** Mobile-first. sm:640px, md:768px, lg:1024px. Cart drawer hidden on mobile; slide-in drawer on tablet+. Sidebar collapses to icon-only on mobile.

**Constraints:** Light mode primary (dark available). No external images except bundled fonts. Accessibility: AA+ contrast, semantic HTML, focus-visible outlines. Products load via FALLBACK_PRODUCTS (hardcoded). Cart uses fixed positioning (no dialog element).

**Signature:** Green emerald accent used sparingly—primary CTAs only, active nav items, product badges. Restraint over intensity signals premium wellness brand.
