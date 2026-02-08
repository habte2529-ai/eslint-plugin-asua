// ═══════════════════════════════════════════════════════════
// Rule: asua/valid-header
// Ensures files have correct @asua headers
// ═══════════════════════════════════════════════════════════

import { ESLintUtils } from '@typescript-eslint/utils'
import { parseASUAHeaders } from '../utils/header-parser'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

type Profile = 'starter' | 'team' | 'enterprise'

const REQUIRED_HEADERS: Record<Profile, string[]> = {
  starter: ['layer', 'kind'],
  team: ['layer', 'kind', 'runtime', 'purity', 'exposure'],
  enterprise: ['layer', 'kind', 'runtime', 'purity', 'exposure', 'composition-role'],
}

type Options = [{ profile?: Profile }]

export default createRule<Options, 'missingHeader' | 'missingProperty' | 'invalidValue'>({
  name: 'valid-header',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that files contain valid @asua comment headers.',
    },
    messages: {
      missingHeader:
        'Missing @asua headers. Add ASUA type headers at the top of this file. Required: {{required}}.',
      missingProperty:
        'Missing required @asua property "{{property}}". Add: // @asua {{property}}: <value>',
      invalidValue:
        '@asua header error: {{error}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          profile: { type: 'string', enum: ['starter', 'team', 'enterprise'] },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ profile: 'starter' }],
  create(context, [options]) {
    const profile = options.profile ?? 'starter'
    const required = REQUIRED_HEADERS[profile]

    return {
      Program(node) {
        const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()
        const result = parseASUAHeaders(sourceCode)

        // Report parse errors
        for (const error of result.errors) {
          context.report({
            node,
            messageId: 'invalidValue',
            data: { error },
          })
        }

        if (!result.found) {
          context.report({
            node,
            messageId: 'missingHeader',
            data: { required: required.join(', ') },
          })
          return
        }

        // Check required properties
        for (const prop of required) {
          const headerKey =
            prop === 'composition-role' ? 'compositionRole' : prop
          if (!(headerKey in result.header) || result.header[headerKey as keyof typeof result.header] === undefined) {
            context.report({
              node,
              messageId: 'missingProperty',
              data: { property: prop },
            })
          }
        }
      },
    }
  },
})
