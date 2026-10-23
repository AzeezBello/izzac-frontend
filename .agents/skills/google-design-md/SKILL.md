---
name: google-design-md
description: >-
  Official Google Labs DESIGN.md specification and tooling (@google/design.md).
  Defines machine-readable YAML design tokens and 8 canonical Markdown sections
  for AI agents to maintain consistent visual identity.
---

# Google Design.md Specification (`google-labs-code/design.md`)

`DESIGN.md` is the official Google Labs open-source specification providing AI coding agents with a structured, persistent understanding of a project's visual system and design tokens.

---

## 1. Dual-Layer File Architecture

Every compliant `DESIGN.md` consists of:
1. **Machine-Readable Design Tokens**: Top-level YAML Front Matter (or interleaved YAML blocks) based on W3C DTCG standards with `{path.to.token}` cross-referencing.
2. **Human-Readable Rationale**: 8 Canonical Markdown sections detailing why design decisions exist and how agents should apply them.

```yaml
---
version: "alpha"
name: "DesignSystemName"
description: "High-craft design token definitions"
colors:
  primary: "#116b4d"
  surface: "#faf9f5"
  on-surface: "#0d1713"
  border: "#eae8e3"
typography:
  display:
    fontFamily: "var(--font-geist-sans)"
    fontSize: "3.5rem"
    fontWeight: 600
    letterSpacing: "-0.03em"
  body:
    fontFamily: "var(--font-geist-sans)"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.6"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
elevation:
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  elevated: "0 10px 30px -10px rgba(0, 0, 0, 0.08)"
---
```

---

## 2. The 8 Canonical Markdown Sections

To ensure agent parsing reliability, structure the markdown with these exact headings:
1. `## Overview`: High-level aesthetic thesis, brand ethos, and user persona.
2. `## Colors`: Semantic token mapping, contrast rules (WCAG AA/AAA), surface hierarchy.
3. `## Typography`: Type pairings, scale hierarchy, line-height, letter-spacing, tabular figures.
4. `## Layout`: Grid systems, container widths, asymmetric splits, responsiveness.
5. `## Elevation & Depth`: Layered shadows, z-index hierarchy, specular highlights, backdrops.
6. `## Shapes`: Border-radius tokens, hairline border widths (`0.5px` / `1px`), pill badges.
7. `## Components`: Recipes for buttons, inputs, cards, dialogs, badges, and tables.
8. `## Do's and Don'ts`: Explicit constraints and anti-patterns to prevent visual drift.

---

## 3. Tooling & CLI Integration

- **Linting**: Run `npx @google/design.md lint DESIGN.md` to validate token schema, reference resolution, and WCAG contrast.
- **Diffing**: Run `npx @google/design.md diff DESIGN.md <previous-commit>` to detect regressions.
- **Tailwind Generator**: Run `npx @google/design.md tailwind DESIGN.md` to export into `tailwind.config.ts`.
