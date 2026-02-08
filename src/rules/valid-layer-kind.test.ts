import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './valid-layer-kind'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('valid-layer-kind', rule, {
  valid: [
    {
      code: `
        // @asua layer: orchestrator
        // @asua kind: orchestration
        // @asua runtime: server
      `,
    },
  ],

  invalid: [
    {
      code: `
        // @asua layer: orchestrator
        // @asua kind: ui
      `,
      errors: [{ messageId: 'invalidKind' }],
    },
    {
      code: `
        // @asua layer: boundary
        // @asua kind: boundary
        // @asua runtime: client
      `,
      errors: [{ messageId: 'invalidRuntime' }],
    },
  ],
})
