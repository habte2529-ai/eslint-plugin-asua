// ═══════════════════════════════════════════════════════════
// Rule: asua/down-only
// Law 1 — Imports flow downward, never upward.
// ═══════════════════════════════════════════════════════════

import { ESLintUtils } from '@typescript-eslint/utils'
import { isImportAllowed, LAYER_DISPLAY } from '../constants'
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

export default createRule<Options, 'downOnly'>({
  name: 'down-only',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce ASUA Law 1: imports must flow from lower-numbered to higher-numbered layers (downward). Never upward.',
    },
    messages: {
      downOnly:
        'ASUA Law 1 (Down Only): {{sourceLayer}} cannot import from {{targetLayer}}. Imports must flow downward, never upward.',
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
    if (!sourceLayer) return {} // Not in an ASUA-managed directory

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const targetLayer = resolveImportLayer(importPath, options)
        if (!targetLayer) return // External or unresolvable

        if (!isImportAllowed(sourceLayer, targetLayer)) {
          context.report({
            node,
            messageId: 'downOnly',
            data: {
              sourceLayer: LAYER_DISPLAY[sourceLayer],
              targetLayer: LAYER_DISPLAY[targetLayer],
            },
          })
        }
      },

      // Also check dynamic imports: import('...')
      CallExpression(node) {
        if (
          node.callee.type === 'Import' ||
          (node.callee.type === 'Identifier' && node.callee.name === 'require')
        ) {
          const arg = node.arguments[0]
          if (arg?.type === 'Literal' && typeof arg.value === 'string') {
            const targetLayer = resolveImportLayer(arg.value, options)
            if (!targetLayer) return

            if (!isImportAllowed(sourceLayer, targetLayer)) {
              context.report({
                node,
                messageId: 'downOnly',
                data: {
                  sourceLayer: LAYER_DISPLAY[sourceLayer],
                  targetLayer: LAYER_DISPLAY[targetLayer],
                },
              })
            }
          }
        }
      },
    }
  },
})
