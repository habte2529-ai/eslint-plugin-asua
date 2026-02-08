// ═══════════════════════════════════════════════════════════
// Rule: asua/valid-layer-kind
// Validates that the kind + runtime match the declared layer
// ═══════════════════════════════════════════════════════════

import { ESLintUtils } from '@typescript-eslint/utils'
import { VALID_KIND_PER_LAYER, VALID_RUNTIME_PER_LAYER, LAYER_DISPLAY } from '../constants'
import { parseASUAHeaders } from '../utils/header-parser'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

export default createRule<[], 'invalidKind' | 'invalidRuntime'>({
  name: 'valid-layer-kind',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Validate that @asua kind and runtime values are valid for the declared layer.',
    },
    messages: {
      invalidKind:
        'Invalid kind "{{kind}}" for {{layer}}. Allowed kinds: {{allowed}}.',
      invalidRuntime:
        'Invalid runtime "{{runtime}}" for {{layer}}. Allowed runtimes: {{allowed}}.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Program(node) {
        const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()
        const { header, found } = parseASUAHeaders(sourceCode)

        if (!found || !header.layer) return

        // Validate kind
        if (header.kind) {
          const validKinds = VALID_KIND_PER_LAYER[header.layer]
          if (!validKinds.includes(header.kind)) {
            context.report({
              node,
              messageId: 'invalidKind',
              data: {
                kind: header.kind,
                layer: LAYER_DISPLAY[header.layer],
                allowed: validKinds.join(', '),
              },
            })
          }
        }

        // Validate runtime
        if (header.runtime) {
          const validRuntimes = VALID_RUNTIME_PER_LAYER[header.layer]
          if (!validRuntimes.includes(header.runtime)) {
            context.report({
              node,
              messageId: 'invalidRuntime',
              data: {
                runtime: header.runtime,
                layer: LAYER_DISPLAY[header.layer],
                allowed: validRuntimes.join(', '),
              },
            })
          }
        }
      },
    }
  },
})
