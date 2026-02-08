import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './valid-header'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('valid-header', rule, {
  valid: [
    // Complete starter header
    {
      code: `
        // @asua layer: meaning
        // @asua kind: domain
        export function ProductCard() { return null }
      `,
      options: [{ profile: 'starter' }],
    },
    // Complete team header
    {
      code: `
        // @asua layer: orchestrator
        // @asua kind: orchestration
        // @asua runtime: server
        // @asua purity: effectful
        // @asua exposure: public
        export function ProductOrchestrator() { return null }
      `,
      options: [{ profile: 'team' }],
    },
  ],

  invalid: [
    // No header at all
    {
      code: `export function ProductCard() { return null }`,
      options: [{ profile: 'starter' }],
      errors: [{ messageId: 'missingHeader' }],
    },
    // Missing 'kind' in starter profile
    {
      code: `
        // @asua layer: meaning
        export function ProductCard() { return null }
      `,
      options: [{ profile: 'starter' }],
      errors: [{ messageId: 'missingProperty' }],
    },
  ],
})
