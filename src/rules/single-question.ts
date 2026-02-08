// ═══════════════════════════════════════════════════════════
// Rule: asua/single-question
// Law 3 — Every module answers exactly one governing question
// This is a HEURISTIC rule — it detects common patterns
// ═══════════════════════════════════════════════════════════

import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/habtamu-geta/eslint-plugin-asua/blob/main/docs/rules/${name}.md`
)

// Heuristic signals
const FETCH_PATTERNS = [
  'useSWR', 'useQuery', 'useMutation',
  'fetch(', 'axios.', '.get(', '.post(',
  'getServerSideProps', 'getStaticProps',
  'Promise.all',
]

const LAYOUT_SIGNALS = [
  'className="grid', 'className="flex',
  'className={cn(', 'grid-cols-',
  ': React.ReactNode', // Typed slot props
]

export default createRule<[], 'singleQuestion'>({
  name: 'single-question',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Detect modules that appear to answer multiple ASUA governing questions (heuristic).',
    },
    messages: {
      singleQuestion:
        'ASUA Law 3 (Single Question): This module appears to mix signals. Consider splitting into separate modules — e.g., an Orchestrator (L3) for data/logic and a Meaning (L5) component for rendering. Signals: {{signals}}',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode?.getText() ?? context.getSourceCode().getText()

    let hasFetchSignal = false
    let hasLayoutSignal = false
    // let hasDomainJSX = false // unused in heuristic for now
    let hasUseClient = false

    // Quick scan of source text
    for (const pattern of FETCH_PATTERNS) {
      if (sourceCode.includes(pattern)) {
        hasFetchSignal = true
        break
      }
    }

    for (const pattern of LAYOUT_SIGNALS) {
      if (sourceCode.includes(pattern)) {
        hasLayoutSignal = true
        break
      }
    }

    hasUseClient = sourceCode.includes("'use client'") || sourceCode.includes('"use client"')

    return {
      'Program:exit'(node) {
        const signals: string[] = []

        // Detect: fetching + domain rendering in the same component
        if (hasFetchSignal && hasLayoutSignal) {
          signals.push('data fetching (L3) and layout arrangement (L4)')
        }

        // Detect: fetch + use client (likely should be server orchestrator)
        if (hasFetchSignal && hasUseClient) {
          // This is allowed (client orchestrators exist), so only warn
          // if there's ALSO domain rendering
          if (hasLayoutSignal) {
            signals.push(
              'data fetching, layout, and client-side interactivity in one module'
            )
          }
        }

        if (signals.length > 0) {
          context.report({
            node,
            messageId: 'singleQuestion',
            data: { signals: signals.join('; ') },
          })
        }
      },
    }
  },
})
