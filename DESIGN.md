# Design Brief — revAlife Admin Panel + Store

**Purpose:** Premium Indian wellness e-commerce platform with integrated admin panel for product management. Both interfaces share unified design language emphasizing trust, science, and simplicity.

**Tone & Differentiation:** Anti-generic, bold wellness identity. White + green palette signals health/growth. Card-based layouts create visual rhythm. Typography hierarchy (General Sans display + Lora body) conveys premium, science-backed brand. No cheap gradients or scammy elements.

| **Palette** | OKLCH | Light | Dark |
|---|---|---|---|
| Background | 0.9975 0.002 0 | Off-white #FEFDFB | Deep charcoal #141110 |
| Primary (Wellness Green) | 0.64 0.15 152 | Vibrant teal-green | Bright teal accent |
| Secondary | 0.85 0.08 152 | Soft green | Light green |
| Accent | 0.64 0.15 152 | Same as primary | Same as primary |
| Muted | 0.92 0.01 0 | Light gray #EBE9E6 | Darker gray #4A4744 |
| Foreground | 0.205 0.002 0 | Dark text #35322F | Light text #F2EEE8 |
| Sidebar | 0.22 0.01 0 | N/A | Deep green-black #1F1915 |
| Destructive | 0.64 0.20 29 | Vibrant red accent | Bright red-orange |

| **Structural Zones** | Treatment |
|---|---|
| Header (Store) | `bg-background border-b` white with subtle green accent line |
| Sidebar (Admin) | `bg-sidebar` deep dark, left nav with primary-colored icons/active states |
| Content Area | `bg-background` with `bg-card` sections for modules (product list, forms) |
| Cards | `bg-card shadow-card` with `rounded-lg` (0.625rem), light border for depth |
| Forms (Admin) | Card containers with labeled input groups, green primary CTAs, rounded inputs |
| Footer | `bg-muted/40 border-t` minimal, right-aligned company links |

**Typography:** General Sans (display heads, buttons, labels) + Lora (body copy, descriptions) + Geist Mono (data/code). 3-tier hierarchy: h1 (2rem, bold), body (1rem, regular), label (0.875rem, medium).

**Shape Language:** 0.625rem rounded cards; 0px sharp corners for data tables; button radii match card radii. Borders 1px, subtle `border-border` color.

**Elevation & Depth:** Shadow hierarchy — `shadow-subtle` (1px) for input focus, `shadow-card` for card containers, `shadow-elevated` for modals/dropdowns. No glows; no neon; minimal transparency.

**Component Patterns:** CTA buttons use `bg-wellness-green text-white`, secondary buttons `border border-border text-foreground`. Product cards show image + title + price + quick-actions (edit/delete in admin). Forms use stacked layout on mobile, consistent field styling.

**Motion:** `transition-smooth` (0.3s cubic-bezier) for hover/active states. Subtle fade-in + slide-in for new content. No bouncy animations; no parallax.

**Constraints:** Mobile-first responsive. Light mode primary, dark mode available. No external assets except bundled fonts. Data tables prioritize readability; admin forms optimize for speed (form-first UX).

**Signature Detail:** Green wellness accent used sparingly — primary CTA only, active nav items, hover states. Restraint signals premium, not budget.
