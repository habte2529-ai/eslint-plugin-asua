// ═══════════════════════════════════════════════════════════
// Rule: asua/orthogonality
// Law 2 — Structure (L4) and Meaning (L5) never import each other
// ═══════════════════════════════════════════════════════════

import { ESLintUtils } from '@typescript-eslint/utils'
import { resolveLayer } from '../utils/layer-resolver'
import { resolveImportLayer } from '../utils/import-resolver'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

type Options = [
  {
    directoryMap?: Record<string, string>
    srcRoot?: string
  },
]

export default createRule<Options, 'structureImportsMeaning' | 'meaningImportsStructure'>({
  name: 'orthogonality',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce ASUA Law 2: Structure (L4) and Meaning (L5) modules must never import each other.',
    },
    messages: {
      structureImportsMeaning:
        'ASUA Law 2 (Orthogonality): Structure (L4) cannot import Meaning (L5). Layouts must not know about domain components. Use an Orchestrator (L3) to compose them.',
      meaningImportsStructure:
        'ASUA Law 2 (Orthogonality): Meaning (L5) cannot import Structure (L4). Domain components must not know about layouts. Use an Orchestrator (L3) to compose them.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          directoryMap: { type: 'object', additionalProperties: { type: 'string' } },
          srcRoot: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const filename = context.filename ?? context.getFilename()
    const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()

    const sourceLayer = resolveLayer(filename, sourceCode, options)

    // Only applies to L4 and L5
    if (sourceLayer !== 'structure' && sourceLayer !== 'meaning') return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const targetLayer = resolveImportLayer(importPath, options)
        if (!targetLayer) return

        if (sourceLayer === 'structure' && targetLayer === 'meaning') {
          context.report({ node, messageId: 'structureImportsMeaning' })
        }

        if (sourceLayer === 'meaning' && targetLayer === 'structure') {
          context.report({ node, messageId: 'meaningImportsStructure' })
        }
      },
    }
  },
})
