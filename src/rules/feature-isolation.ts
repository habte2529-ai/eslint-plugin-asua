// ═══════════════════════════════════════════════════════════
// Rule: asua/feature-isolation
// Law 4 — No cross-feature imports at L5 and below
// ═══════════════════════════════════════════════════════════

import { ESLintUtils } from '@typescript-eslint/utils'
import { resolveLayer } from '../utils/layer-resolver'
import { resolveFeature, resolveImportFeature } from '../utils/feature-resolver'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

type Options = [
  {
    directoryMap?: Record<string, string>
    srcRoot?: string
  },
]

export default createRule<Options, 'featureIsolation'>({
  name: 'feature-isolation',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce ASUA Law 4: No cross-feature imports at L5 (Meaning) and L6 (Element).',
    },
    messages: {
      featureIsolation:
        "ASUA Law 4 (Feature Isolation): Module in feature '{{sourceFeature}}' cannot import from feature '{{targetFeature}}'. Move shared code to 'shared/' or promote to a shared element.",
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

    // Law 4 only applies at L5 and L6
    if (sourceLayer !== 'meaning' && sourceLayer !== 'element') return {}

    const sourceFeature = resolveFeature(filename)
    if (!sourceFeature) return {} // Not inside a feature directory

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const targetFeature = resolveImportFeature(importPath)

        if (targetFeature && targetFeature !== sourceFeature) {
          context.report({
            node,
            messageId: 'featureIsolation',
            data: { sourceFeature, targetFeature },
          })
        }
      },
    }
  },
})
