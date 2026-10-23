---
name: canvas-ui
description: >-
  Creative GPU-accelerated canvas and WebGL/WebGPU component library (DavidHDev/canvas-ui).
  Renders fluid simulations, glass refraction, force fields, and shaders over live,
  accessible HTML DOM elements using shadcn-compatible registries.
---

# Canvas UI Skill (`DavidHDev/canvas-ui`)

**Canvas UI** is an open-source library of creative, GPU-accelerated WebGL and WebGPU visual effects created by David Haz (`@DavidHDev`). It runs shaders and canvas simulations directly over live, interactive DOM elements.

---

## 1. The HTML-in-Canvas Philosophy

Unlike traditional full-canvas web experiences that sacrifice DOM accessibility, Canvas UI uses experimental HTML-in-canvas techniques:
- **Live Interactive DOM**: Buttons remain clickable, links remain navigable, and text remains selectable and indexed by search engines.
- **Specularity & Warping**: GPU shaders refract and warp the live DOM texture underneath (e.g. liquid ripples on hover, chromatic aberration, frosted glass refraction).
- **Graceful Fallbacks**: If a browser lacks WebGL/WebGPU or HTML-in-canvas capabilities, the component seamlessly degrades to clean CSS backdrop-blur and standard DOM styles.

---

## 2. shadcn Registry Integration & CLI

Canvas UI components follow the shadcn copy-paste registry format:

### Registry Configuration in `components.json`:
```json
{
  "registries": {
    "@canvas-ui": "https://canvasui.dev/r/{name}.json"
  }
}
```

### Installation CLI Patterns:
```bash
# Add a React component with WebGL
npx shadcn@latest add @canvas-ui/liquid-react

# Add Glass refraction effect
npx shadcn@latest add @canvas-ui/glass-react

# Add WebGPU variant (optional)
npx shadcn@latest add @canvas-ui/liquid-react-webgpu
```

---

## 3. Usage Pattern

```tsx
"use client";

import { Liquid } from "@/components/canvasui/Liquid";
import { Glass } from "@/components/canvasui/Glass";

export function HeroCard() {
  return (
    <Glass intensity={0.4} distortion={0.12} className="rounded-2xl p-8 border border-white/10">
      <h3 className="text-xl font-semibold text-foreground">Precision Mobility</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Tactile car sharing engineered for modern riders and hosts.
      </p>
    </Glass>
  );
}
```

---

## 4. Engineering & Performance Rules
- **GPU Budget**: Never mount more than 1–2 heavy canvas shaders simultaneously on a single viewport.
- **Intersection Observer**: Canvas rendering must pause execution when scrolled out of the active viewport.
- **Battery & Low Power**: Automatically reduce shader resolution (`pixelRatio: 1` vs `pixelRatio: 2`) on mobile devices.
