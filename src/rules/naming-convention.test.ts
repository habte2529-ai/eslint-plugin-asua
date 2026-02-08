import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './naming-convention'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('naming-convention', rule, {
  valid: [
    {
      code: `export const X = 1`,
      filename: '/project/src/orchestrators/ProductOrchestrator.tsx',
    },
    {
      code: `export const Y = 1`,
      filename: '/project/src/structures/DashboardLayout.tsx',
    },
  ],

  invalid: [
    {
      code: `export const X = 1`,
      filename: '/project/src/orchestrators/ProductThing.tsx',
      errors: [{ messageId: 'namingConvention' }],
    },
    {
      code: `export const Y = 1`,
      filename: '/project/src/structures/MyComponent.tsx',
      errors: [{ messageId: 'namingConvention' }],
    },
  ],
})
