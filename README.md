<div align="center">

# 🏗️ eslint-plugin-asua

**Enforce Axiom-Stratum Unified Architecture (ASUA) with Surgical Precision**

[![version](https://img.shields.io/github/v/release/habte2529-ai/eslint-plugin-asua?label=version&style=flat-square&color=007acc)](https://github.com/habte2529-ai/eslint-plugin-asua/releases)
[![license](https://img.shields.io/github/license/habte2529-ai/eslint-plugin-asua?style=flat-square&color=42b883)](./LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/habte2529-ai/eslint-plugin-asua/asua-architecture.yml?style=flat-square)](https://github.com/habte2529-ai/eslint-plugin-asua/actions)
[![stars](https://img.shields.io/github/stars/habte2529-ai/eslint-plugin-asua?style=flat-square&color=ffca28)](https://github.com/habte2529-ai/eslint-plugin-asua/stargazers)

---

ASUA transforms frontend architecture from a "handshake agreement" into **verifiable system constraints**.
This plugin makes architectural violations build errors—not just code review comments.

[**Philosophy**](#-the-philosophy) • [**Quick Start**](#-quick-start) • [**Layers**](#-the-six-layers) • [**Rules**](#-enforced-rules)

</div>

## 🚀 Why ASUA?

Traditional architectures drift. ASUA stays rigid where it matters:

- **Zero Circular Dependencies**: Law 1 (Down Only) ensures a strict vertical flow.
- **Isolated Domains**: Law 4 (Feature Isolation) prevents "spaghetti modules".
- **Self-Documenting Code**: ASUA headers reveal a file's intent at a glance.
- **Predictable Performance**: Purity and Runtime constraints enforced at the compiler level.

---

## 🛠️ Installation

```bash
npm install eslint-plugin-asua --save-dev
```

## ⚡ Quick Start

Add the starter profile to your `.eslintrc.js`:

```javascript
module.exports = {
  extends: ["plugin:asua/starter"],
};
```

_That's it. You now have Law 1 (Down Only) and Header Validation active._

---

## 🧬 The Six Layers

| Layer               | Type | Question                     | Example                       |
| :------------------ | :--- | :--------------------------- | :---------------------------- |
| **L0 Foundation**   | 🏗️   | "What technical capability?" | API clients, caching          |
| **L1 Boundary**     | ⛩️   | "What application?"          | `layout.tsx`, providers       |
| **L2 Screen**       | 📱   | "What route?"                | `page.tsx`                    |
| **L3 Orchestrator** | 🧠   | "What data/logic?"           | Fetch → Decide → Compose      |
| **L4 Structure**    | 📐   | "Where does content go?"     | Layouts with typed slots      |
| **L5 Meaning**      | 💎   | "What domain concept?"       | `ProductCard`, `OrderSummary` |
| **L6 Element**      | 🧱   | "What visual primitive?"     | `Button`, `Badge`, `Card`     |

---

## ⚖️ Enforced Rules

| Rule                     | Law       | Default    | Fixable |
| :----------------------- | :-------- | :--------- | :------ |
| `asua/down-only`         | **Law 1** | 🔴 `error` | No      |
| `asua/orthogonality`     | **Law 2** | 🔴 `error` | No      |
| `asua/single-question`   | **Law 3** | 🟡 `warn`  | No      |
| `asua/feature-isolation` | **Law 4** | 🔴 `error` | No      |
| `asua/valid-header`      | —         | 🔴 `error` | No      |
| `asua/valid-layer-kind`  | —         | 🔴 `error` | No      |

---

## ✍️ Usage: ASUA Headers

Add these headers to your files to define their architectural "Passport":

```typescript
// @asua layer: meaning
// @asua kind: domain
// @asua runtime: client
// @asua purity: pure

export function ProductCard({ product }: ProductCardProps) {
  return <Card>{product.name}</Card>
}
```

---

## ⚙️ Advanced Configuration

### Custom Mapping

Map your existing directory structure to ASUA layers:

```javascript
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
```

---

## 📖 Related Resources

- [**ASUA Manuscript**](https://github.com/habtamu-geta/asua) — The core architectural methodology.
- [**Rule Documentation**](./docs/rules/) — Detailed guides for every rule.

---

## 📜 License

Apache License 2.0 © **Habtamu Geta**
