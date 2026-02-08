import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './single-question'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
})

ruleTester.run('single-question', rule, {
  valid: [
    // Clean Orchestrator (Fetch + Compose only) — LEGAL
    {
      code: `
        // @asua layer: orchestrator
        export function ProductOrchestrator() {
            const data = useQuery('product')
            return <ProductLayout data={data} />
        }
      `,
    },
    // Clean Meaning (Domain rendering only) — LEGAL
    {
      code: `
        // @asua layer: meaning
        export function ProductCard({ product }) {
            return <div className="p-4">{product.name}</div>
        }
      `,
    },
  ],

  invalid: [
    // Mixed: Fetch + Layout/Domain rendering — SUSPICIOUS
    {
      code: `
        export function MessyComponent() {
            const data = useQuery('product') // Fetch signal
            return (
                <div className="grid grid-cols-3"> // Layout signal
                    {data.map(p => <span>{p.name}</span>)}
                </div>
            )
        }
      `,
      errors: [{ messageId: 'singleQuestion' }],
    },
  ],
})
