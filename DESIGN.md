---
version: "alpha"
name: "Izzac Mobility Editorial Design System"
description: >-
  Master visual specification, token schema, and motion architecture for Izzac Mobility
  peer-to-peer mobility platform. Fully adheres to Google Design.Md specification,
  Hallmark Anti-AI-Slop validation gates, UI/UX Pro Max intelligence, GSAP Skills,
  React Bits primitives, Canvas UI shaders, Scroll World timelines, and Open Design contracts.

colors:
  background: "hsl(45 23% 98%)"       # #faf9f5 Warm Mineral Alabaster
  foreground: "hsl(155 24% 9%)"        # #0d1713 Deep Pine Ink
  surface: "hsl(45 20% 96%)"           # #f5f4ef Soft Pebble Surface
  surface-elevated: "hsl(0 0% 100%)"   # #ffffff Crisp Card Surface
  surface-dark: "hsl(155 24% 9%)"      # #0d1713 Contrast Dark Pine Panel
  surface-dark-foreground: "hsl(45 20% 96%)" # #f5f4ef
  primary:
    DEFAULT: "hsl(161 72% 24%)"        # #116b4d Botanical Emerald
    foreground: "hsl(0 0% 100%)"
    hover: "hsl(161 75% 20%)"
    active: "hsl(161 78% 17%)"
  secondary:
    DEFAULT: "hsl(40 10% 92%)"         # #eae8e3 Neutral Pebble
    foreground: "hsl(155 24% 9%)"
    hover: "hsl(40 12% 88%)"
  accent:
    DEFAULT: "hsl(161 55% 92%)"        # #e2f4ed Soft Emerald Wash
    foreground: "hsl(161 72% 24%)"
  muted:
    DEFAULT: "hsl(40 10% 92%)"
    foreground: "hsl(155 12% 40%)"     # #596e64 Mineral Slate Secondary Text
  border:
    DEFAULT: "hsl(40 10% 88%)"         # #e2dfd7 Hairline Border Tone
    subtle: "hsl(40 10% 92% / 0.6)"
  destructive:
    DEFAULT: "hsl(0 72% 51%)"
    foreground: "hsl(0 0% 100%)"

typography:
  fontFamilies:
    sans: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace"
  scales:
    display-hero:
      fontSize: "3.75rem" # 60px
      lineHeight: "1.05"
      fontWeight: "600"
      letterSpacing: "-0.035em"
    h1:
      fontSize: "2.25rem" # 36px
      lineHeight: "1.15"
      fontWeight: "600"
      letterSpacing: "-0.025em"
    h2:
      fontSize: "1.5rem" # 24px
      lineHeight: "1.25"
      fontWeight: "600"
      letterSpacing: "-0.02em"
    h3:
      fontSize: "1.125rem" # 18px
      lineHeight: "1.35"
      fontWeight: "500"
      letterSpacing: "-0.01em"
    body:
      fontSize: "0.9375rem" # 15px
      lineHeight: "1.6"
      fontWeight: "400"
      letterSpacing: "normal"
    caption:
      fontSize: "0.75rem" # 12px
      lineHeight: "1.4"
      fontWeight: "500"
      letterSpacing: "0.04em"
      textTransform: "uppercase"
    telemetry:
      fontSize: "0.875rem" # 14px
      fontFamily: "{typography.fontFamilies.mono}"
      fontWeight: "500"
      fontVariantNumeric: "tabular-nums"

spacing:
  xs: "0.25rem" # 4px
  sm: "0.5rem"  # 8px
  md: "1rem"    # 16px
  lg: "1.5rem"  # 24px
  xl: "2rem"    # 32px
  2xl: "3rem"   # 48px
  3xl: "4.5rem" # 72px

rounded:
  sm: "0.375rem" # 6px
  md: "0.625rem" # 10px
  lg: "1rem"     # 16px
  xl: "1.5rem"   # 24px
  full: "9999px"

elevation:
  subtle: "0 1px 2px 0 rgba(13, 23, 19, 0.04)"
  card: "0 2px 8px -2px rgba(13, 23, 19, 0.05), 0 1px 3px -1px rgba(13, 23, 19, 0.03)"
  elevated: "0 12px 32px -8px rgba(13, 23, 19, 0.08), 0 4px 12px -2px rgba(13, 23, 19, 0.03)"
  modal: "0 24px 64px -16px rgba(13, 23, 19, 0.16)"

components:
  button:
    height: "2.75rem"
    paddingX: "1.25rem"
    borderRadius: "{rounded.md}"
    transition: "transform 150ms cubic-bezier(0.22, 1, 0.36, 1), background-color 150ms ease, box-shadow 150ms ease"
    activeScale: "0.98"
  card:
    borderRadius: "{rounded.lg}"
    borderWidth: "1px"
    borderColor: "{colors.border.DEFAULT}"
    backgroundColor: "{colors.surface-elevated}"
    shadow: "{elevation.card}"
---

# Izzac Mobility Design System & Motion Architecture (`DESIGN.md`)

Structured design specification combining **Google Design.Md (`google-labs-code/design.md`)**, **Hallmark Anti-AI-Slop (`nutlope/hallmark`)**, **UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`)**, **GSAP Skills (`greensock/gsap-skills`)**, **React Bits (`DavidHDev/react-bits`)**, **Canvas UI (`DavidHDev/canvas-ui`)**, **Scroll World (`oso95/scroll-world`)**, and **Open Design (`nexu-io/open-design`)**.

---

## 1. Overview

- **Domain & Persona**: Peer-to-peer mobility and fleet sharing platform serving both **Riders** (seeking high-trust, friction-free vehicle access) and **Hosts** (monetizing automotive assets with instrument-grade telemetry and revenue analytics).
- **Aesthetic Direction**: *Editorial Mobility & Tactile Precision* — warm mineral alabaster paper background (`hsl(45 23% 98%)`), deep pine-tinted ink (`hsl(155 24% 9%)`), and a single botanical emerald accent (`hsl(161 72% 24%)`).
- **Dual Surface Modes**:
  1. **Persuade & Discover** (`/`, `/host`, `/cars/list-car`): Asymmetric 12-column split heroes, staggered Bento grids (`7:5` spans), architectural hairline ledgers, and scroll-scrubbed narrative camera flights.
  2. **Operate & Transact** (`/cars`, `/cars/[id]`, `/dashboard/*`, `/login`, `/signup`): High-density scanability, `tabular-nums` financial breakdown, micro-interactions with immediate tactile feedback, and accessible form controls.

---

## 2. Colors

- **Background Canvas**: `hsl(45 23% 98%)` — avoids clinical #ffffff sterile glare; delivers an editorial, physical paper-like warmth.
- **Deep Pine Ink**: `hsl(155 24% 9%)` — foundational text and dark container panel tone; avoids harsh, lifeless #000000.
- **Botanical Emerald Accent**: `hsl(161 72% 24%)` — authoritative, natural accent color used purposefully on primary actions, verification badges, and key rate indicators.
- **Pebble Muted Surface**: `hsl(40 10% 92%)` — provides subtle surface separation without requiring heavy border lines.
- **WCAG Compliance**: All text pairings guarantee minimum 4.5:1 contrast for body copy and 3.0:1 for large display headlines.

---

## 3. Typography

- **Primary Typeface**: `Geist Sans` (`var(--font-geist-sans)`) — variable geometric neo-grotesque with exceptional legibility across dense UI and headlines.
- **Monospace & Telemetry Typeface**: `Geist Mono` (`var(--font-geist-mono)`) — used strictly for prices, VINs, dates, durations, and odometer counters with `tabular-nums` enabled.
- **Typographic Scale & Tracking**:
  - `Display / Hero`: `text-5xl md:text-6xl font-semibold tracking-[-0.035em] leading-[1.05]`
  - `H1 / Section Titles`: `text-3xl md:text-4xl font-semibold tracking-[-0.025em] leading-tight`
  - `H2 / Card Headers`: `text-xl md:text-2xl font-semibold tracking-[-0.02em]`
  - `H3 / Item Labels`: `text-lg font-medium tracking-[-0.01em]`
  - `Body`: `text-[15px] font-normal leading-relaxed text-foreground/90`
  - `Telemetry / Figures`: `font-mono text-sm tracking-tight tabular-nums`
  - `Eyebrow / Badge`: `text-[11px] font-semibold tracking-[0.08em] uppercase text-emerald-800`

---

## 4. Layout

- **Anti-Slop Macrostructures (`nutlope/hallmark`)**:
  - ❌ **No 3-Column Symmetrical Cliché**: Never use 3 identical feature cards with icons in squares.
  - ✅ **Asymmetric Bento Grids**: Combine `md:col-span-7` with `md:col-span-5` to create natural visual weight and rhythm.
  - ✅ **Architectural Hairline Ledgers**: Use `divide-y divide-border/60 border-t border-b border-border/60` with stark monospace indexes (`01`, `02`, `03`) to guide step-by-step onboarding and vehicle workflows.
  - ✅ **Split Hero**: 12-column asymmetric layout with prominent narrative on the left (7 cols) and interactive booking or vehicle inspection module on the right (5 cols).

---

## 5. Elevation & Depth

- **Ambient & Specular Shadows**:
  - Never use muddy black drop shadows (`shadow-2xl`).
  - Use layered shadows with a subtle dark-pine tint:
    `box-shadow: 0 2px 8px -2px rgba(13, 23, 19, 0.05), 0 12px 32px -8px rgba(13, 23, 19, 0.08);`
- **Backdrop Blurs & Specular Borders**:
  - Pinned headers use `backdrop-blur-md bg-background/85 border-b border-border/50`.
  - Floating modal dialogs use `backdrop-blur-xl bg-surface-elevated/95 border border-white/20 shadow-modal`.
- **Strict Z-Index Scale**:
  - `z-0`: Background shader/canvas (Canvas UI / Scroll World)
  - `z-10`: Content cards, grids, and ledgers
  - `z-20`: Pinned navigation bar
  - `z-40`: Flyout drawers and mobile navigation sheets
  - `z-50`: Modals, dialogs, and toast notifications

---

## 6. Shapes

- **Corner Radii Hierarchy**:
  - Buttons & Inputs: `rounded-md` (`10px` / `0.625rem`) for crisp tactile grip.
  - Vehicle Cards & Bento Tiles: `rounded-xl` (`16px` / `1rem`) for smooth spatial containment.
  - Modal Containers: `rounded-2xl` (`24px` / `1.5rem`) for generous elevation.
  - Pills & Badges: `rounded-full` (`9999px`) with padding `px-2.5 py-0.5`.
- **Hairlines**:
  - Borders should be hairline `1px` with subtle opacity (`border-border/60`), never heavy solid blocks.

---

## 7. Components

All primitives live in `src/components/ui/*` (controls) and `src/components/layout/*` (composition). Pages compose these; they never re-declare container widths, eyebrow styles, or dark panel backgrounds inline.

### Layout vocabulary (`components/layout`)
| Primitive | Purpose |
| --- | --- |
| `Container` | Canvas widths: `wide` (1600px, default), `default` (1280), `narrow` (960), `prose` (720). |
| `Section` | Vertical rhythm (`sm` / `default` / `lg`), tone band (`surface` / `ink`), hairline rules. |
| `Eyebrow` | Mono uppercase label with optional index (`01 — Label`). Replaces badge spam above headings. |
| `SectionHeading` | Eyebrow + title (`display` / `h1` / `h2`) + lede + right-aligned action. |
| `PageHeader` | Operate-mode header: breadcrumbs, eyebrow, H1, lede, actions. |
| `Stat` / `StatStrip` | Telemetry figures in a hairline-divided grid. Never KPI cards. |
| `Ledger` / `LedgerRow` | Hairline-separated rows with mono index, title, description, right aside. |
| `ArrowLink` | Inline link with sliding `→`. |
| `Chip` / `ChipGroup` | Filter pills with `aria-pressed`, optional count. |
| `InkPanel` | The single dark pine emphasis surface per page. One per view, maximum. |
| `OptionCard` | Radio / checkbox rendered as a selectable surface. |

### Shell & domain components
- `Header` — sticky, 64px, three primary links (Fleet, Services, Host) + Dashboard when authenticated; currency popover; Headless UI mobile sheet.
- `Footer` — oversized wordmark, three link columns, meta rule with hub codes and currency segmented control.
- `DashboardShell` — sidebar (identity, three-step qualification status, section nav) + main column with page header; collapses to a pill switcher on mobile.
- `VehicleCard` — image 4:3, name, mono hub line, price right, hairline spec footer. Layouts: `default`, `wide`, `compact`.
- `FleetFilters` — shared hub / mode / class chip rails.
- `EmptyStateGuide` — dashed surface with eyebrow, H2, actions, optional three-tip ledger.
- `Reveal` — GSAP `useGSAP` scroll reveal (transform + opacity only, reduced-motion safe).

### Controls (`components/ui`)
1. **Button** — variants `default` (emerald), `ink`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `inverse` (on dark). Heights 36 / 44 / 48px, `rounded-md`, `active:scale-[0.98]`, explicit transition properties.
2. **Badge** — pill, mono 11px uppercase. Variants `secondary` (default), `emerald`, `amber`, `destructive`, `outline`, `dark`, `signal`. Use for state only.
3. **Card** — `rounded-lg`, hairline border, `shadow-card`. `interactive` adds the hover lift; `tone="surface"` for pebble fill. Never nest bordered cards.
4. **Input / Select / Textarea / Label** — 44px, `rounded-md`, focus ring `primary/15`. `Label` accepts a mono `hint`.
5. **Tabs** — `segmented` pill switcher or `underline` editorial tabs.
6. **Accordion** — CSS-grid height animation, optional mono `index` per trigger.
7. **Alert** — `default`, `emerald`, `destructive`, `info`, `warning`; leading status dot.
8. **Tooltip**, **Skeleton**, **Separator**.

## 8. Do's and Don'ts (Hallmark 57-Gate Anti-Patterns)

### ❌ Don'ts:
1. **No Hero Cliché**: Do not render a centered glowing gradient pill badge above a centered H1 with two centered buttons and a floating dashboard mockup.
2. **No Generic Purple/Violet Gradients**: Do not use `bg-gradient-to-r from-purple-500 to-indigo-600` for cards or text fills.
3. **No Symmetrical 3-Card Columns**: Do not place three identical feature cards side by side.
4. **No Card-in-Card Nesting**: Never nest bordered cards within bordered cards; use hairline dividers (`divide-y`) instead.
5. **No `transition: all`**: Never write `transition: all` in CSS or `transition-all` in Tailwind. Specify exact transition properties.
6. **No Scale from Zero**: Never use `scale(0)` or `opacity-0 scale-50` for modal reveals; use subtle offsets (`translateY(6px) scale(0.985)`).
7. **No Proportional Numbers on Financials**: Never display prices or timestamps in non-tabular fonts.

### ✅ Do's:
1. **Asymmetric 12-Column Grids**: Anchor key messages with 7-column feature showcases paired with 5-column live telemetry panels.
2. **Tactile Micro-Interactions**: Provide immediate `:active:scale-[0.98]` tactile press response on all buttons and cards.
3. **Hardware-Accelerated Motion**: Animate strictly `transform` and `opacity` properties via GSAP or CSS.
4. **Accessible WebGL / Canvas**: Use Canvas UI HTML-in-canvas to keep text selectable and buttons clickable beneath shaders.
5. **Reduced Motion Compliance**: Ensure every animation gracefully collapses under `@media (prefers-reduced-motion: reduce)`.

---

## 9. Motion & Animation Architecture (`greensock/gsap-skills`)

- **React / Next.js Integration**: Always use `@gsap/react`'s `useGSAP()` hook with an explicit `{ scope: containerRef }`.
- **Automatic Reversion**: `useGSAP` guarantees that all timelines and ScrollTriggers automatically clean up on component unmount, preventing memory leaks and orphaned scroll listeners.
- **ScrollTrigger Scrubbing**:
  ```tsx
  useGSAP(() => {
    gsap.from(".vehicle-feature-row", {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".vehicle-feature-container",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: containerRef });
  ```

---

## 10. Cinematic Storytelling (`oso95/scroll-world`)

- **Chapter Pacing**: Pinned multi-viewport sections (`h-[300vh]`) for hero vehicle discovery.
- **Scroll-to-Time Scrubber**: Vertical scroll delta maps directly to frame progression or camera angle scrubbers via `requestAnimationFrame`.
- **Layered Foregrounds**: Foreground typography, specs, and CTAs float above the canvas with `pointer-events-auto` while the scrubbed canvas has `pointer-events-none`.

---

## 11. Creative GPU & Shaders (`DavidHDev/canvas-ui` & `react-bits`)

- **Component Registry**:
  - `npx shadcn@latest add @react-bits/SplitText-TS-TW`
  - `npx shadcn@latest add @react-bits/ClickSpark-TS-TW`
  - `npx shadcn@latest add @canvas-ui/liquid-react`
  - `npx shadcn@latest add @canvas-ui/glass-react`
- **HTML-in-Canvas Specularity**: Subtle liquid refraction (`<Liquid>`) applied to hero headers or glass refraction (`<Glass>`) on floating booking cards without sacrificing DOM access, screen readers, or text selection.
