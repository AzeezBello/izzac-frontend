# Izzac Agent Workspace Guide (`AGENTS.md`)

Welcome to the **Izzac** workspace. This repository hosts a dual-role (Rider & Host) peer-to-peer mobility platform comprising:
- `izzac-frontend/`: Next.js 15 App Router, React 18, Tailwind CSS, Headless UI, shadcn/ui.
- `izzac_backend/`: Django / Python backend services and APIs.

---

## 🎨 Mandatory Design & Motion Architecture

All coding and design agents working in this repository MUST comply with the **9 Unified Design & Motion Standards** configured in `.agents/skills/` and `.agents/rules/`:

1. **Google Design.Md (`google-labs-code/design.md`)**:
   - Master visual specification located at `izzac-frontend/DESIGN.md` and root `DESIGN.md`.
   - Token architecture: DTCG-compliant YAML front matter + 8 canonical Markdown sections.
2. **Hallmark Anti-AI-Slop (`nutlope/hallmark`)**:
   - 57 structural validation gates preventing generic LLM design convergence.
   - Elimination of hero clichés, 3-card symmetry, and generic gradients in favor of asymmetric Bento splits and architectural hairline ledgers.
3. **UI/UX Pro Max Skill (`nextlevelbuilder/ui-ux-pro-max-skill`)**:
   - Design-first workflow: determine domain tokens, typography hierarchy, and accessibility contracts before emitting code.
   - Mobility palette: Mineral Alabaster (`hsl(45 23% 98%)`), Deep Pine Ink (`hsl(155 24% 9%)`), Botanical Emerald (`hsl(161 72% 24%)`).
4. **GSAP Skills (`greensock/gsap-skills`)**:
   - Use `@gsap/react` (`useGSAP`) with container scoping and automatic unmount cleanup.
   - Only animate compositor-friendly properties (`x`, `y`, `scale`, `rotation`, `opacity`). Zero layout thrashing.
5. **React Bits (`DavidHDev/react-bits`)**:
   - Interactive components and micro-interactions configured via shadcn registry (`@react-bits`).
   - Flavor convention: `-TS-TW` (TypeScript + Tailwind CSS).
6. **Canvas UI (`DavidHDev/canvas-ui`)**:
   - GPU-accelerated WebGL/WebGPU shaders (fluid simulation, glass refraction) running over live, accessible DOM elements.
   - shadcn registry: `@canvas-ui`.
7. **Scroll World (`oso95/scroll-world`)**:
   - Multi-scene camera flight paths and frame-scrubbed canvas timelines for cinematic narrative sections.
8. **Open Design (`nexu-io/open-design`)**:
   - Local-first agent workflow, strict TypeScript component contracts, and responsive state handling.
9. **Awesome DESIGN.md (`voltagent/awesome-design-md`)**:
   - Benchmarking against production design languages (Stripe, Linear, Apple, Vercel).

---

## 🛠️ Developer & Agent Tooling

### Shadcn Component Registry Installation
```bash
# Add React Bits components
npx shadcn@latest add @react-bits/SplitText-TS-TW

# Add Canvas UI components
npx shadcn@latest add @canvas-ui/liquid-react
```

### Running Frontend
```bash
cd izzac-frontend
npm run dev
```

### Running Backend
```bash
cd izzac_backend
python manage.py runserver
```
