// src/rules/naming-convention.ts
import { ESLintUtils } from '@typescript-eslint/utils'
import { resolveLayer } from '../utils/layer-resolver'
import path from 'path'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

const LAYER_PATTERNS: Record<string, RegExp> = {
  orchestrator: /Orchestrator\.(tsx?|jsx?)$/,
  structure: /Layout\.(tsx?|jsx?)$/,
}

export default createRule<[], 'namingConvention'>({
  name: 'naming-convention',
  meta: {
    type: 'suggestion',
    docs: { description: 'Enforce ASUA file naming conventions per layer.' },
    messages: {
      namingConvention:
        'ASUA Naming: Files in {{layer}} should match pattern {{pattern}}. Got: "{{filename}}".',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename ?? context.getFilename()
    const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()
    const layer = resolveLayer(filename, sourceCode)

    if (!layer || !LAYER_PATTERNS[layer]) return {}

    const basename = path.basename(filename)
    // Skip index files and test files
    if (basename.startsWith('index.') || basename.includes('.test.')) return {}

    return {
      Program(node) {
        const pattern = LAYER_PATTERNS[layer!]
        if (pattern && !pattern.test(basename)) {
          context.report({
            node,
            messageId: 'namingConvention',
            data: {
              layer: layer!,
              pattern: layer === 'orchestrator' ? '*Orchestrator.tsx' : '*Layout.tsx',
              filename: basename,
            },
          })
        }
      },
    }
  },
})
