---
name: react-bits
description: >-
  Interactive and animated React/Next.js UI primitives and micro-interactions
  (DavidHDev/react-bits). Covers SplitText, Bento Grids, micro-interactions,
  and animated canvas/gradient backgrounds using shadcn-compatible registries.
---

# React Bits Skill (`DavidHDev/react-bits`)

**React Bits** is an open-source library of animated, interactive, and customizable React/Next.js components and micro-interactions created by David Haz (`@DavidHDev`).

---

## 1. Five Component Categories

1. **Text Animations**:
   - `SplitText`: Smooth character-by-character or word-by-word reveal transitions.
   - `BlurText`: Gradual blur-to-sharp entrance animation.
   - `RotatingText`: Cyclical keyword swaps with smooth vertical/horizontal rolls.
2. **Animations & Trails**:
   - `CursorTrail`: Subtle interactive pointer velocity trails.
   - `AnimatedBorder`: Specular glowing border running along container perimeter.
   - `ImageTrail`: Cascading image stack reveal on hover or scroll velocity.
3. **Components & Layouts**:
   - `BentoGrid`: Dynamic modular grid with fluid card responsiveness.
   - `Dock`: macOS-style magnifying interactive bottom utility dock.
   - `TiltedCard`: Perspective 3D tilt tracking pointer position.
4. **Micro-Interactions**:
   - `ClickSpark`: Burst particles radiating from click coordinates.
   - `MagneticButton`: Physical attractor pulling button toward pointer proximity.
   - `ElasticSlider`: Spring-physics slider with tactile thumb feedback.
5. **Backgrounds**:
   - `Aurora`: Fluid ambient color waves rendered in WebGL/CSS.
   - `Particles`: Dynamic floating particulate nodes with interactive proximity links.
   - `GridPattern`: Architectural blueprint coordinate grids with animated pulses.

---

## 2. shadcn CLI Registry Integration

React Bits components are integrated directly into projects using the shadcn registry format:

### Configuration in `components.json`:
```json
{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

### Installation Command Pattern:
```bash
npx shadcn@latest add @react-bits/<ComponentName>-TS-TW
```
*Examples:*
- `npx shadcn@latest add @react-bits/SplitText-TS-TW`
- `npx shadcn@latest add @react-bits/TiltedCard-TS-TW`
- `npx shadcn@latest add @react-bits/ClickSpark-TS-TW`
- `npx shadcn@latest add @react-bits/Aurora-TS-TW`

---

## 3. Implementation Rules
- Always use the **`-TS-TW`** (TypeScript + Tailwind CSS) flavor for type safety and theme harmony.
- Keep micro-interactions subtle: avoid gratuitous cursor particles or bouncy animations on critical transactional forms (booking, payment, login).
- Provide immediate fallback for reduced-motion users (`prefers-reduced-motion: reduce`).
