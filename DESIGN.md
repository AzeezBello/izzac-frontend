# Izzac Design System & Motion Architecture (`DESIGN.md`)

Structured design specification combining **shadcn/ui**, **Emil Kowalski's Design Engineering (`emil-design-eng` & `review-animations`)**, **`Leonxlnx/taste-skill` (`design-taste-frontend`)**, and **`pbakaus/impeccable`**.

---

## 1. Aesthetic Brief & Spatial Thesis (`taste-skill` + `impeccable`)

- **Domain**: Peer-to-peer mobility & dual-role (Rider + Host) vehicle sharing platform.
- **Aesthetic Direction**: *Editorial Mobility & Tactile Precision* — warm mineral alabaster canvas (`hsl(45 23% 98%)`), deep pine-tinted ink (`hsl(155 24% 9%)`), and a single botanical emerald accent (`hsl(161 72% 24%)`).
- **Surface Modes (`impeccable`)**:
  - **Persuade & Experience** (`/`, `/host`, `/cars/list-car`): Asymmetric 12-column split heroes, asymmetric Bento feature grids (`7:5` / `5:7` spans), and architectural hairline ledgers.
  - **Operate & Read** (`/cars`, `/cars/[id]`, `/dashboard/*`, `/login`, `/signup`): High-density scanability, `tabular-nums` telemetry strips, instant fare breakdown, and accessible form controls.

---

## 2. Anti-Patterns Eliminated (`impeccable` + `taste-skill`)

1. **Card-in-Card Nesting Removed**:
   - Replaced recursive card-inside-card containers on `/`, `/host`, `/cars/list-car`, and `/dashboard/rider` with architectural hairline ledgers (`divide-y` / `divide-x`) and numbered stage columns (`01`–`04`).
2. **Boring Font Fallback Removed**:
   - Replaced `Arial, Helvetica, sans-serif` with local variable fonts `GeistVF` (`--font-geist-sans`) and `GeistMonoVF` (`--font-geist-mono`) via `next/font/local`.
3. **3-Column Symmetric Feature Cliché Replaced**:
   - Upgraded feature grids on `/host` and `/cars/list-car` to 12-column asymmetric Bento grids (`md:col-span-7` paired with `md:col-span-5`).
4. **Pure Neutrals & Washed Gradients Replaced**:
   - Eliminated pure `#000000` / `#ffffff` and repetitive `from-emerald-50 via-white` wrappers in favor of warm stone-tinted surfaces and deep pine (`#0d1713`) contrast panels.

---

## 3. Animation Review & Refinement (`emil-design-eng` / `review-animations`)

| Component / Surface | Before | After | Why (Emil Kowalski Principle) |
| :--- | :--- | :--- | :--- |
| **Buttons (`ui/button.tsx`)** | `transition` with no `:active` press feedback | `active:scale-[0.98] transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out-quart` | Interactive controls must feel tactile and responsive immediately on press; never transition `all`. |
| **Host FAQ (`ui/accordion.tsx`)** | `{openIndex === index && <p>...}` hard DOM mount/unmount with `+`/`-` text swap | CSS Grid `grid-rows-[0fr]` → `grid-rows-[1fr]` + opacity (`200ms cubic-bezier(0.22, 1, 0.36, 1)`) and 45° icon rotation | Disclosures must animate smoothly to intrinsic height and remain 100% interruptible mid-flight. |
| **Header Nav (`Header.tsx`)** | Generic `transition` on high-frequency links | Instant hover state on primary nav links; `backdrop-blur-md` sticky chrome | High-frequency navigation elements used dozens of times per session should never feel delayed by animation. |
| **Vehicle Cards (`ui/card.tsx`)** | `hover:shadow-md transition` (`transition: all 150ms`) | `hover:-translate-y-0.5 hover:shadow-elevated transition-[transform,box-shadow,border-color] duration-200 ease-out-quart` + image `scale-[1.03]` (`duration-500 ease-out-expo`) | Explicit compositor-friendly properties (`transform`) paired with layered ambient/key shadows prevent paint thrashing. |
| **Booking Fare Estimate (`BookCarForm.tsx`)** | Sudden DOM insertion + proportional digits | `animate-enter-subtle` (`translateY(6px) scale(0.985)` → `1`, `220ms ease-out-quart`) + `tabular-nums` | Never scale from `0` (`scale(0)`); use subtle offset + `tabular-nums` to prevent horizontal number jitter. |
| **Reduced Motion (`globals.css`)** | No `prefers-reduced-motion` handling | Global `@media (prefers-reduced-motion: reduce)` safeguard | Accessibility requirement: motion must collapse to instant state changes when requested by the OS. |
