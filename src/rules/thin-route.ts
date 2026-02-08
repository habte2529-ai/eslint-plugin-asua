// src/rules/thin-route.ts
import { ESLintUtils } from '@typescript-eslint/utils'
import { resolveLayer } from '../utils/layer-resolver'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

type Options = [{ maxLines?: number; warningThreshold?: number }]

export default createRule<Options, 'thinRoute'>(
  {
  name: 'thin-route',
  meta: {
    type: 'suggestion',
    docs: { description: 'Enforce that L2 Screen modules remain thin (5-15 lines).' },
    messages: {
      thinRoute:
        'ASUA Thin Route: This Screen (L2) module has {{actual}} lines (max: {{max}}). Move data fetching and logic to an L3 Orchestrator.',
    },
    schema: [{
      type: 'object',
      properties: {
        maxLines: { type: 'number' },
        warningThreshold: { type: 'number' },
      },
      additionalProperties: false,
    }],
  },
  defaultOptions: [{ maxLines: 25, warningThreshold: 15 }],
  create(context, [options]) {
    const filename = context.filename ?? context.getFilename()
    const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()
    const sourceLayer = resolveLayer(filename, sourceCode)
    if (sourceLayer !== 'screen') return {}

    return {
      Program(node) {
        const lines = sourceCode.split('\n').filter(l => l.trim() !== '').length
        if (lines > (options.maxLines ?? 25)) {
          context.report({
            node,
            messageId: 'thinRoute',
            data: { actual: String(lines), max: String(options.maxLines ?? 25) },
          })
        }
      },
    }
  },
})
