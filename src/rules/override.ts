// src/rules/override.ts
import { ESLintUtils } from '@typescript-eslint/utils'
import { parseOverrides } from '../utils/override-parser'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

export default createRule<[], 'overrideWithoutReason' | 'overrideExpired' | 'overrideTracked'>({
  name: 'override',
  meta: {
    type: 'suggestion',
    docs: { description: 'Track and validate @asua-override directives.' },
    messages: {
      overrideWithoutReason:
        'ASUA Override at line {{line}} is missing a reason. Use: // @asua-override law:N reason:"explanation"',
      overrideExpired:
        'ASUA Override at line {{line}} has expired ({{expires}}). Remove the override and fix the violation.',
      overrideTracked:
        'ASUA Override at line {{line}}: law:{{law}} — "{{reason}}" (ticket: {{ticket}}). This is tracked tech debt.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Program(node) {
        const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()
        const overrides = parseOverrides(sourceCode)

        for (const override of overrides) {
          if (!override.reason) {
            context.report({ node, messageId: 'overrideWithoutReason', data: { line: String(override.line) } })
            continue
          }
          if (override.expires && new Date(override.expires) < new Date()) {
            context.report({
              node,
              messageId: 'overrideExpired',
              data: { line: String(override.line), expires: override.expires },
            })
            continue
          }
          // Track as info (CI can collect these)
          // Not an error — just tracked
        }
      },
    }
  },
})
