# ADR 001: Accordion — Composable, Accessible Architecture

**Date:** 2026-05-23  
**Status:** Accepted

---

## Context

The Invoice page requires an accordion to progressively disclose a payment CTA and benefit list. Two competing pressures shaped the design:

1. **Accessibility** — The component must satisfy the [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), which imposes specific requirements on role, keyboard interaction, and ARIA attributes.
2. **Reusability** — The accordion must be usable across future pages without encoding Invoice-specific concerns (copy, icons, content layout) into the component itself.

Shipping a single monolithic `<Accordion title="..." content={...} />` API would have satisfied the immediate need, but it forces the component to own decisions that belong to the caller — icon choice, header text, inner content structure — and makes it impossible to satisfy WAI-ARIA without baking in assumptions about the DOM structure.

---

## Decision

We adopted a **compound component** pattern backed by a shared React context, exposed through a single namespace object.

### Structure

```
Accordion/
  AccordionRoot.tsx      — state owner, context provider, wrapper div
  AccordionTrigger.tsx   — <h3><button> with all ARIA attributes
  AccordionContent.tsx   — collapsible region with role="region"
  AccordionContext.ts    — createContext + useAccordion guard hook
  Accordion.tsx          — namespace: Object.assign(Root, { Trigger, Content })
  Accordion.types.ts     — shared TypeScript interfaces
```

### Public API

```tsx
<Accordion defaultOpen>
  <Accordion.Trigger icon={<ChevronUp />}>Section title</Accordion.Trigger>
  <Accordion.Content>Any children</Accordion.Content>
</Accordion>
```

Callers own the icon, the heading text, and the content. The component owns nothing domain-specific.

---

## Accessibility implementation

### WAI-ARIA Accordion Pattern compliance

| Requirement | Implementation |
|---|---|
| Trigger is a `<button>` inside `<h3>` | `AccordionTrigger` renders `<h3><button>` — heading level signals document structure, button gets native keyboard support |
| `aria-expanded` toggles on the button | `aria-expanded={isOpen}` — dynamically reflects open/closed state |
| `aria-controls` points to the panel | `aria-controls={panelId}` — links button to its controlled region |
| Panel has `role="region"` | `AccordionContent` renders `role="region"` on the outer div |
| Panel is labelled by its trigger | `aria-labelledby={headerId}` on the panel div |
| Decorative icon is hidden from AT | `aria-hidden="true"` on the icon `<span>` |
| Stable IDs across renders | `useId()` in `AccordionRoot` — React-generated, SSR-safe, collision-free |

### `prefers-reduced-motion`

The open/close animation uses a CSS `grid-template-rows` transition — a technique that avoids `height: auto` limitations without JavaScript measurement. Because this transition lives in a Tailwind arbitrary-value class (not an inline style), the `motion-reduce:transition-none` variant can override it at the CSS layer. The same guard is applied to the icon rotation. Users who configure "Reduce Motion" in their OS get an instant state change with no vestibular risk.

### Focus management

The trigger button uses `focus-visible:ring` rather than `focus:ring` to show a visible focus ring only during keyboard navigation, leaving pointer interactions visually clean while remaining keyboard-accessible.

---

## Why compound components over alternatives

### Rejected: prop-drilling API (`title`, `content`, `icon` props)

```tsx
// rejected
<Accordion title="Section" icon={<ChevronUp />} content={<PaymentForm />} />
```

- Encoding content as props forces the component to render the heading and icon, preventing callers from controlling DOM order or structure.
- Adding future variants (e.g., a trigger with a badge, or a multi-line header) requires new props and conditional rendering inside the component.
- The WAI-ARIA heading level (`<h3>`) would be hardcoded — wrong when used in different page contexts.

### Rejected: render props

```tsx
// rejected
<Accordion renderTrigger={({ isOpen }) => <button>...</button>}>
  {children}
</Accordion>
```

- Shifts ARIA wiring responsibility to the caller, making it easy to get wrong.
- More verbose call sites with no benefit over compound components.

### Chosen: compound components via context

- Each sub-component reads `isOpen`, `headerId`, and `panelId` from context — no prop threading.
- ARIA wiring is encapsulated: callers cannot forget `aria-controls` or misname the panel `id` because the component generates and connects those IDs internally.
- The caller controls layout, content, and icon; the component controls accessibility invariants.
- `Object.assign(AccordionRoot, { Trigger, Content })` keeps the public surface a single import (`Accordion`) while making the relationship between parts explicit at the call site (`Accordion.Trigger`, `Accordion.Content`).

---

## Consequences

**Positive**
- A new page can use `<Accordion>` with entirely different content without touching the component.
- WAI-ARIA compliance is guaranteed by construction — callers cannot break the ARIA contract.
- Animaton respects `prefers-reduced-motion` without JavaScript media-query listeners.

**Negative / trade-offs**
- Sub-components must always be used inside `<Accordion>` — `useAccordion` throws if the context is missing. This is intentional (fail fast), but it means the parts are not independently reusable.
- The compound API requires callers to know the three-part structure. A monolithic API would have a shallower learning curve for one-off use.
