import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './override'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('override', rule, {
  valid: [
    {
      code: `
        // @asua-override law:1 reason:"legacy code" ticket:PROJ-123
        export const x = 1
      `,
    },
  ],

  invalid: [
    {
      code: `
        // @asua-override law:1
        export const x = 1
      `,
      errors: [{ messageId: 'overrideWithoutReason' }],
    },
    {
      code: `
        // @asua-override law:1 reason:"temp" expires:2000-01-01
        export const x = 1
      `,
      errors: [{ messageId: 'overrideExpired' }],
    },
  ],
})
