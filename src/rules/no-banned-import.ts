// src/rules/no-banned-import.ts
import { ESLintUtils } from '@typescript-eslint/utils'
import { resolveLayer } from '../utils/layer-resolver'
import { LAYER_INDEX, type Layer } from '../constants'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

export interface BanRule {
  /** Import pattern to match (substring or regex string) */
  pattern: string
  /** Layers where this import is banned */
  bannedLayers: Layer[]
  /** Directive name for the error message */
  directive: string
  /** Human-readable reason */
  reason: string
}

type Options = [{ bans?: BanRule[] }]

// Default bans from ASUA directives (Ch. 8)
const DEFAULT_BANS: BanRule[] = [
  // State Directive: L4 and L6 must not use state stores
  { pattern: 'zustand', bannedLayers: ['structure', 'element'], directive: 'State', reason: 'Layouts and elements must be state-free' },
  { pattern: 'jotai', bannedLayers: ['structure', 'element'], directive: 'State', reason: 'Layouts and elements must be state-free' },
  { pattern: '@reduxjs', bannedLayers: ['structure', 'element'], directive: 'State', reason: 'Layouts and elements must be state-free' },
  { pattern: 'react-redux', bannedLayers: ['structure', 'element'], directive: 'State', reason: 'Layouts and elements must be state-free' },
  // Cache Directive: L4, L5, L6 must not use cache directly
  { pattern: '@tanstack/react-query', bannedLayers: ['structure', 'meaning', 'element'], directive: 'Cache', reason: 'Only L3 orchestrators interact with cache' },
  { pattern: 'swr', bannedLayers: ['structure', 'meaning', 'element'], directive: 'Cache', reason: 'Only L3 orchestrators interact with cache' },
  // Analytics Directive: L6 never tracks
  { pattern: 'mixpanel', bannedLayers: ['element'], directive: 'Analytics', reason: 'Elements must not contain analytics tracking' },
  { pattern: '@segment', bannedLayers: ['element'], directive: 'Analytics', reason: 'Elements must not contain analytics tracking' },
  { pattern: 'posthog', bannedLayers: ['element'], directive: 'Analytics', reason: 'Elements must not contain analytics tracking' },
]

export default createRule<Options, 'bannedImport'>({
  name: 'no-banned-import',
  meta: {
    type: 'problem',
    docs: { description: 'Enforce ASUA directive layer bans — prevent wrong packages at wrong layers.' },
    messages: {
      bannedImport:
        'ASUA directive {{directive}}: "{{import}}" is banned at {{layer}}. {{reason}}.',
    },
    schema: [{
      type: 'object',
      properties: {
        bans: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pattern: { type: 'string' },
              bannedLayers: { type: 'array', items: { type: 'string' } },
              directive: { type: 'string' },
              reason: { type: 'string' },
            },
            required: ['pattern', 'bannedLayers', 'directive', 'reason'],
          },
        },
      },
      additionalProperties: false,
    }],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const filename = context.filename ?? context.getFilename()
    const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()
    const layer = resolveLayer(filename, sourceCode)
    if (!layer) return {}

    const bans = [...DEFAULT_BANS, ...(options.bans ?? [])]
    const applicableBans = bans.filter(b => b.bannedLayers.includes(layer!))
    if (applicableBans.length === 0) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        for (const ban of applicableBans) {
          if (importPath.includes(ban.pattern)) {
            context.report({
              node,
              messageId: 'bannedImport',
              data: {
                directive: ban.directive,
                import: importPath,
                layer: layer!,
                reason: ban.reason,
              },
            })
          }
        }
      },
    }
  },
})
