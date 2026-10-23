---
name: hallmark
description: >-
  Anti-AI-slop design governance and validation engine (nutlope/hallmark).
  Eliminates generic AI UI tropes, prevents distributional convergence,
  and audits code against 57 structural design gates.
---

# Hallmark Anti-AI-Slop Skill (`nutlope/hallmark`)

The **Hallmark** skill prevents AI coding agents from succumbing to **distributional convergence**—the tendency of models to output generic, template-stamped user interfaces (e.g. purple mesh gradients, centered hero pill badge, 3 identical cards, default Inter font).

---

## 1. The Four Hallmark Modes / Verbs

1. **Build (`default`)**:
   - Takes a prompt or brief, chooses a distinctive macrostructure and theme, applies anti-slop rules, and outputs high-craft code.
2. **`hallmark audit <target>`**:
   - Evaluates existing UI components or pages against the 57 validation gates; outputs an actionable punch list of clichés to eliminate.
3. **`hallmark redesign <target>`**:
   - Preserves copy, data bindings, and business logic while replacing template layouts with asymmetrical, purposeful visual architecture.
4. **`hallmark study <reference>`**:
   - Extracts typographic cadence, color anchors, hairline details, and spatial rhythm from an inspiring site or screenshot into machine-readable `DESIGN.md`.

---

## 2. Hallmark Anti-Slop Banned Tropes

When generating or editing frontend code, **NEVER**:
- ❌ **Use the "Hero Cliché"**: Centered glowing gradient pill badge + centered H1 + two centered buttons + floating generic dashboard screenshot.
- ❌ **Use the "Symmetric 3-Card Feature Cliché"**: 3 identical cards with SVG icon inside a rounded square, bold title, and two lines of filler text.
- ❌ **Use Purple/Violet Glow Meshes**: Indiscriminate radial gradients (`from-purple-500/20 to-transparent`) behind dark cards.
- ❌ **Use Recursive Card-in-Card Nesting**: Cards placed inside cards inside cards with redundant borders.
- ❌ **Use Uncalibrated `transition: all`**: Always specify explicit transition properties (`transform`, `opacity`, `background-color`, `border-color`).
- ❌ **Scale from Zero**: Avoid `scale(0)` on modal/popover enters; use subtle initial offsets (`translateY(6px) scale(0.985)`).

---

## 3. Approved Macrostructures

Replace generic layouts with one of these approved structural archetypes:
1. **Asymmetric Split Ledger**: 7:5 or 8:4 column layout with pinned contextual telemetry on the narrow flank and narrative ledger on the wide flank.
2. **Architectural Hairline Matrix**: Border-collapsed container grid (`divide-x divide-y border-t border-b`) with stark monospace indexing (`01`, `02`, `03`).
3. **Horizontal Ribbon / Timeline**: Pinned horizontal progression with dynamic index markers and synchronized section reveals.
4. **Docked Console**: Low-profile fixed utility dock with high-contrast active tabs and dense data telemetry.

---

## 4. Pre-Emit Self-Critique Checklist (57-Gate Summary)

Before completing any frontend code, review:
- [ ] Is the primary typography distinctive rather than default system fallback?
- [ ] Do numbers and financial figures use `tabular-nums`?
- [ ] Does every interactive element have a defined `:active` tactile state?
- [ ] Are dividers and hairline borders using theme tokens rather than raw gray hex codes?
- [ ] Is there an explicit `@media (prefers-reduced-motion: reduce)` override?
- [ ] Does the layout avoid 3-column symmetry?
- [ ] Are empty states and loading skeletons designed with the same layout rhythm as loaded states?
