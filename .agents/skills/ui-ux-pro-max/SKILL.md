---
name: ui-ux-pro-max
description: >-
  Comprehensive design intelligence and UI/UX execution framework.
  Use whenever generating UI components, page layouts, design systems, color palettes,
  typography pairings, accessibility patterns, and responsive frontend architectures.
---

# UI/UX Pro Max Skill Specification

The **UI/UX Pro Max** skill enforces a design-first, token-disciplined architecture for building high-craft user interfaces. It prevents generic outputs by establishing explicit design foundations before writing code.

---

## 1. Core Workflow: Design System First

Never write raw frontend code without defining the foundational tokens:
1. **Analyze Domain & Target Persona**: Identify primary user jobs-to-be-done, emotional tone, and operational context (e.g., peer-to-peer mobility, high-density telemetry vs. persuasive discovery).
2. **Select UI Style & Macrostructure**: Select an appropriate architectural style (e.g., Bento Grid, Editorial Ledger, Kinetic Minimalist) and avoid default centered-card tropes.
3. **Establish Color Harmony & Contrast**: Map semantic tokens (`background`, `surface`, `foreground`, `primary`, `accent`, `muted`, `border`) with strict WCAG AA/AAA compliance.
4. **Define Typographic Hierarchy**: Pair functional body typefaces with high-character display fonts; specify scale, line-height, and tracking.
5. **Enforce Accessibility & Interaction States**: Require focus rings, touch targets (≥ 44×44px), active tactile states, and reduced-motion fallbacks.

---

## 2. Curated UI Styles Library

| Style Key | Aesthetic Characteristics | Best Suited For |
| :--- | :--- | :--- |
| **Editorial Ledger** | Warm mineral canvas, hairline borders (`divide-y`), asymmetric grids, high typographic contrast, numbered indexes. | Mobility sharing, marketplaces, luxury goods, editorial tech. |
| **Bento Grid** | Modular asymmetric cards (`7:5`, `8:4`), varying tile heights, micro-data badges, subtle elevation. | Feature showcases, product overviews, dashboard summaries. |
| **Kinetic Minimalist** | High whitespace, monochrome foundations with high-saturation singular accent, hyper-crisp micro-interactions. | Modern SaaS, productivity tools, developer platforms. |
| **Glassmorphism 2.0** | Multi-layered backdrop blurs (`backdrop-blur-xl`), tinted specular borders (`border-white/10`), ambient shadows. | Floating modals, pinned navbars, elevated HUD overlays. |
| **AI-Native Console** | Monospaced telemetry tags, prompt-first inputs, streaming response badges, dark pine/slate canvas. | AI assistants, agent dashboards, data intelligence tools. |

---

## 3. Industry-Tailored Color & Palette Profiles

### Mobility, Sharing & Fleet Services (Izzac Profile)
- **Canvas / Background**: Warm Mineral Alabaster (`hsl(45 23% 98%)` / `#faf9f5`)
- **Deep Ink / Slate**: Deep Pine Ink (`hsl(155 24% 9%)` / `#0d1713`)
- **Primary Emerald**: Botanical Emerald Accent (`hsl(161 72% 24%)` / `#116b4d`)
- **Muted Slate**: Neutral Pebble (`hsl(40 10% 92%)` / `#eae8e3`)
- **Semantic Status**: Amber Alert (`#f59e0b`), Crimson Reject (`#ef4444`), Emerald Verified (`#10b981`).

---

## 4. Typography Rules & Scales

1. **Heading Hierarchy**:
   - `Display (Hero)`: 48px – 64px, tracking `-0.03em`, leading `1.05`, medium or semibold.
   - `H1 / Section Titles`: 32px – 40px, tracking `-0.025em`, leading `1.15`.
   - `H2 / Card Headers`: 20px – 24px, tracking `-0.015em`, leading `1.25`.
   - `H3 / Subheads`: 16px – 18px, tracking `-0.01em`, leading `1.4`.
2. **Body & Telemetry**:
   - `Body`: 15px – 16px, leading `1.6`, tracking `normal`.
   - `Numeric Data / Currency / Timestamps`: Always use `font-mono` and `tabular-nums` to eliminate layout jitter during updates.
   - `Caption / Eyebrow`: 11px – 12px, uppercase, tracking `+0.08em`, font-semibold.

---

## 5. UX & Interaction Rules (99+ Validation Checklist)

- **Tactile Feedback**: Every button and clickable element must specify `:active:scale-[0.98]` and smooth cubic-bezier transitions (`ease-out-quart`).
- **Touch Target Integrity**: Minimum 44×44px interactive bounding box for mobile tap targets.
- **Scroll Hijacking Ban**: Never intercept native mousewheel velocity; use smooth scrubbers or GSAP Observer that respect user control.
- **Form Design**: Instant inline validation on blur (`:user-valid` / `:user-invalid`), explicit labels (no placeholder-only inputs), sticky submit CTAs on mobile.
- **Z-Index Layering Scale**:
  - `z-0`: Base canvas & background shaders
  - `z-10`: Sticky cards & content elements
  - `z-20`: Pinned navigation headers
  - `z-40`: Flyout drawers & sidebars
  - `z-50`: Modals, dialogs & toasts
