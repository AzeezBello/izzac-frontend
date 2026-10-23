---
description: >-
  Mandatory design, UI/UX, and motion standards across all frontend surfaces.
  Enforces Google Design.Md, Hallmark Anti-Slop, UI/UX Pro Max, GSAP,
  React Bits, Canvas UI, Scroll World, Open Design, and Awesome DESIGN.md.
always_on: true
---

# Unified Design & Motion Standards

Every frontend component, page, or style created or modified in this workspace must adhere to the following 9 unified design systems:

---

## 1. Google Design.Md & Token Discipline
- All design tokens (colors, typography, spacing, rounded, elevation) are governed by `DESIGN.md` in DTCG machine-readable YAML front matter and 8 canonical markdown sections.
- Never hardcode arbitrary hex colors, padding, or border-radius values in components when matching theme tokens exist.

## 2. Hallmark Anti-AI-Slop Validation Gates (`nutlope/hallmark`)
- **Ban the Hero Cliché**: No centered gradient pill badge + centered H1 + two centered buttons + generic screenshot.
- **Ban the 3-Card Cliché**: No 3 identical symmetric cards with an icon in a rounded square. Use asymmetric Bento splits (`7:5`) or architectural hairline ledgers (`divide-y divide-border/40`).
- **Ban Unconstrained Transitions**: Never use `transition-all`. Always specify explicit transition properties (`transform`, `opacity`, `background-color`, `border-color`).
- **No Scaling from Zero**: Modal and popup entrances must use subtle offsets (`translateY(6px) scale(0.985)`), never `scale(0)`.

## 3. UI/UX Pro Max Mobility Domain Rules
- **Color Harmony**: Warm Mineral Alabaster canvas (`hsl(45 23% 98%)`), Deep Pine Ink (`hsl(155 24% 9%)`), Botanical Emerald Accent (`hsl(161 72% 24%)`).
- **Telemetry & Numbers**: All prices, timestamps, coordinates, odometer readings, and metrics must use `font-mono tabular-nums`.
- **Tactile Physics**: All buttons and clickable controls must provide immediate `:active:scale-[0.98]` tactile press feedback with `cubic-bezier(0.22, 1, 0.36, 1)`.

## 4. GSAP & High-Performance Motion (`greensock/gsap-skills`)
- Use `@gsap/react` (`useGSAP()`) with explicit `scope` refs to ensure automatic cleanup on unmount.
- Animate only GPU compositor properties: `x`, `y`, `scale`, `rotation`, `opacity`. Never animate `width`, `height`, `top`, or `left`.
- In ScrollTrigger scrubbers, use `scrub: 1` or `scrub: true` and ensure elements avoid layout thrashing.

## 5. React Bits & Canvas UI Integration
- Install interactive primitives via shadcn registry:
  - React Bits: `npx shadcn@latest add @react-bits/<ComponentName>-TS-TW`
  - Canvas UI: `npx shadcn@latest add @canvas-ui/<ComponentName>-react`
- Preserve DOM accessibility: Ensure canvas effects maintain live, selectable text and navigable links.

## 6. Scroll World Pacing & Storytelling
- For immersive narrative sections, coordinate multi-scene camera sequences and scroll-driven frame scrubbing.
- Always provide an instant fallback under `@media (prefers-reduced-motion: reduce)`.
