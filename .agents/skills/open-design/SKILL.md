---
name: open-design
description: >-
  Open Design (nexu-io/open-design) local-first multi-agent design engine standard.
  Connects AI coding agents to component registries, design tokens, sandbox preview loops,
  and production UI component contracts.
---

# Open Design Skill (`nexu-io/open-design`)

**Open Design** is an open-source, local-first design engine standard connecting AI coding assistants (Claude Code, Cursor, Antigravity) directly to component registries, live sandboxed previews, and unified design token contracts.

---

## 1. Local-First Design Engine Philosophy

- **BYOK & Local Agent Execution**: Executes UI design and generation directly inside the developer's local repository without proprietary cloud locks.
- **Component Contracts**: Every UI component must export a strict TypeScript interface with documented prop contracts, accessibility roles (`role="..."`), and keyboard navigation.
- **Live Preview Alignment**: Code is structured to render cleanly in hot-reloading dev environments and Server-Sent Event (SSE) preview runners.

---

## 2. Component Contract Best Practices

1. **Deterministic Component Structure**:
   - `Root`: Structural wrapper managing state and layout context.
   - `Trigger`: Interactive element with proper `aria-expanded` and keyboard handlers.
   - `Content`: Elevated disclosure/sheet/dialog with transition lifecycle hooks.
2. **Prop Transparency**:
   - Always accept standard HTML attributes via `React.ComponentPropsWithoutRef<T>` and merge them with `cn()` utility.
3. **Responsive Fluidity**:
   - Components must adapt fluidly between mobile viewport (`< 640px`), tablet (`640px – 1024px`), and desktop (`> 1024px`).
