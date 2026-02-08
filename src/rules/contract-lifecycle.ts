// src/rules/contract-lifecycle.ts
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

export default createRule<[], 'deprecatedContract' | 'sunsetContract'>({
  name: 'contract-lifecycle',
  meta: {
    type: 'problem',
    docs: { description: 'Warn on deprecated contracts, error on sunset contracts.' },
    messages: {
      deprecatedContract:
        'ASUA Contract Lifecycle: "{{name}}" is deprecated. Use {{replacement}} instead. Sunset: {{sunset}}.',
      sunsetContract:
        'ASUA Contract Lifecycle: "{{name}}" has passed its sunset date ({{sunset}}). Migration is required — this will block merge.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()

    // Scan for @contract @status deprecated/sunset in JSDoc comments
    const deprecatedPattern = /@status\s+deprecated/
    const sunsetPattern = /@sunset\s+(\d{4}-\d{2}-\d{2})/
    const replacementPattern = /@replacement\s+(\w+)/
    const contractNamePattern = /@contract\s+(\w+)/

    return {
      Program(node) {
        const comments = context.sourceCode?.getAllComments?.() ?? []
        for (const comment of comments) {
          const text = comment.value
          if (!contractNamePattern.test(text)) continue

          const name = text.match(contractNamePattern)?.[1] ?? 'unknown'
          const replacement = text.match(replacementPattern)?.[1] ?? 'N/A'
          const sunsetMatch = text.match(sunsetPattern)
          const sunset = sunsetMatch?.[1] ?? 'N/A'

          if (sunsetMatch && new Date(sunsetMatch[1]) < new Date()) {
            context.report({
              node,
              messageId: 'sunsetContract',
              data: { name, sunset },
            })
          } else if (deprecatedPattern.test(text)) {
            context.report({
              node,
              messageId: 'deprecatedContract',
              data: { name, replacement, sunset },
            })
          }
        }
      },
    }
  },
})
