# Billogram — Bank Account Connection Accordion

A React/TypeScript implementation of the "Betala och koppla bankkonto" accordion UI component, built with accessibility, reusability, and testability as first-class concerns.

## Tech stack

- **React 19** + **TypeScript 6**
- **Tailwind CSS v4** (utility-first styling)
- **Lucide React** (icons)
- **Jest 30** + **React Testing Library** (unit & integration tests)
- **Vite 8** (dev server + build)
- **CircleCI** (CI pipeline)

## Getting started

### Prerequisites

- Node.js 22+
- Yarn (or npm/pnpm — adjust commands accordingly)

### Install dependencies

```bash
yarn install
```

### Run the dev server

```bash
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to see the component.

### Run tests

```bash
# Single run
yarn test

# Watch mode (re-runs on file change)
yarn test:watch

# With coverage report
yarn test:coverage
```

Coverage output lands in `./coverage/`.

### Production build

```bash
yarn build
```

---

## Project structure

```
src/
├── lib/
│   └── cn.ts                        # Lightweight classNames utility
├── components/
│   ├── Button/
│   │   ├── Button.tsx               # Reusable button (primary | secondary variant)
│   │   └── Button.test.tsx
│   ├── Accordion/
│   │   ├── Accordion.tsx            # Generic WAI-ARIA accordion
│   │   └── Accordion.test.tsx
│   └── AccordionSection/
│       ├── AccordionSection.tsx     # Feature component (bank account connection)
│       └── AccordionSection.test.tsx
└── pages/
    └── Invoice/
        └── InvoicePage.tsx          # Page shell
```

---

## Component design

### `<Accordion title="…" defaultOpen>`

Generic, reusable accordion that accepts any `children`. Follows the [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):

- Trigger is a `<button>` inside a `<h3>` with `aria-expanded` + `aria-controls`
- Panel has `role="region"` + `aria-labelledby` pointing to the trigger id
- `hidden` attribute on the panel when collapsed — removes it from the accessibility tree and prevents keyboard focus on its contents

### `<Button variant="primary | secondary">`

Extends `ButtonHTMLAttributes<HTMLButtonElement>` so every native attribute (including `aria-*`) is supported. Defaults to `type="button"` to avoid accidental form submission. Focus ring is keyboard-only via `focus-visible`.

### `<AccordionSection>`

Feature component that composes `Accordion` and `Button` via the children prop — the accordion knows nothing about bank-ID logic; the content is owned by `AccordionSection`. Callbacks (`onStartMobileBankId`, `onOtherDevice`) are surfaced as props so the parent can wire up navigation or state.

---

## Accessibility highlights

| Concern | Implementation |
|---|---|
| Keyboard navigation | All interactive elements reachable via `Tab`; `Enter`/`Space` toggle the accordion |
| Screen reader toggle state | `aria-expanded` on the trigger button |
| Panel identity | `role="region"` + `aria-labelledby` |
| Hidden content | Native `hidden` attribute — absent from a11y tree when collapsed |
| Focus ring | `focus-visible:ring-*` — shown only for keyboard navigation |
| Decorative icons | `aria-hidden="true"` on icon wrappers |
| List semantics | Benefits rendered as `<ul>` with `aria-label="Benefits"` |

---

## CI pipeline (CircleCI)

`.circleci/config.yml` defines two jobs that run on every push:

1. **test** — type-check → lint → jest (with JUnit reporter + coverage artifact)
2. **build** — production Vite build (runs only after `test` passes)

To connect the project, push to a GitHub/Bitbucket repo and enable the project in the [CircleCI dashboard](https://app.circleci.com).
