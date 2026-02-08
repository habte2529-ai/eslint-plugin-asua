# eslint-plugin-asua

> ESLint rules for enforcing **ASUA** (Axiom-Stratum Unified Architecture)
> in React and Next.js projects.

ASUA transforms frontend architecture from "agreed organization" into
**verifiable system constraints**. This plugin makes violations build
errors — not code review comments.

## Installation

\`\`\`bash
npm install eslint-plugin-asua --save-dev
\`\`\`

## Quick Start (30 seconds)

Add to your `.eslintrc.js`:

\`\`\`js
module.exports = {
extends: ['plugin:asua/starter'],
}
\`\`\`

That's it. You now have Law 1 (Down Only) + header validation enforced.

## Profiles

| Profile       | Command                  | What's enforced              |
| ------------- | ------------------------ | ---------------------------- |
| 🟢 Starter    | `plugin:asua/starter`    | Law 1, Law 3 (warn), headers |
| 🟡 Team       | `plugin:asua/team`       | All 5 laws, full headers     |
| 🔴 Enterprise | `plugin:asua/enterprise` | Everything at max strictness |

## Rules

| Rule                     | Law   | Default | Fixable |
| ------------------------ | ----- | ------- | ------- |
| `asua/down-only`         | Law 1 | error   | No      |
| `asua/orthogonality`     | Law 2 | error   | No      |
| `asua/single-question`   | Law 3 | warn    | No      |
| `asua/feature-isolation` | Law 4 | error   | No      |
| `asua/valid-header`      | —     | error   | No      |
| `asua/valid-layer-kind`  | —     | error   | No      |

## How It Works

Add ASUA headers to your files:

\`\`\`typescript
// @asua layer: meaning
// @asua kind: domain
// @asua runtime: client
// @asua purity: pure

export function ProductCard({ product }: ProductCardProps) {
return <Card>...</Card>
}
\`\`\`

The plugin reads these headers + your directory structure to determine
each module's layer, then enforces ASUA's laws on every import.

## The Six Layers

| Layer           | Question                     | Example                       |
| --------------- | ---------------------------- | ----------------------------- |
| L0 Foundation   | "What technical capability?" | API clients, caching          |
| L1 Boundary     | "What application?"          | `layout.tsx`, providers       |
| L2 Screen       | "What route?"                | `page.tsx`                    |
| L3 Orchestrator | "What data/logic?"           | Fetch → Decide → Compose      |
| L4 Structure    | "Where does content go?"     | Layouts with typed slots      |
| L5 Meaning      | "What domain concept?"       | `ProductCard`, `OrderSummary` |
| L6 Element      | "What visual primitive?"     | `Button`, `Badge`, `Card`     |

## Configuration

\`\`\`js
// .eslintrc.js — custom configuration
module.exports = {
plugins: ['asua'],
rules: {
'asua/down-only': 'error',
'asua/orthogonality': 'error',
'asua/single-question': 'warn',
'asua/feature-isolation': 'off',
'asua/valid-header': ['error', { profile: 'starter' }],
'asua/valid-layer-kind': 'error',
},
}
\`\`\`

### Custom Directory Mapping

\`\`\`js
rules: {
'asua/down-only': ['error', {
directoryMap: {
'components': 'element',
'containers': 'orchestrator',
'views': 'structure',
},
srcRoot: 'src',
}],
}
\`\`\`

## Learn More

- [ASUA Manuscript](https://github.com/habtamu-geta/asua)
- [Rule Documentation](./docs/rules/)

## License

MIT © Habtamu Geta
