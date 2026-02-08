import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './feature-isolation'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('feature-isolation', rule, {
  valid: [
    // Same feature import — LEGAL
    {
      code: `
        // @asua layer: meaning
        import { Sub } from '@/features/product/components/Sub'
      `,
      filename: '/project/src/features/product/components/Main.tsx',
    },
    // Import from shared — LEGAL
    {
      code: `
        // @asua layer: meaning
        import { Button } from '@/components/Button'
      `,
      filename: '/project/src/features/product/components/Main.tsx',
    },
  ],

  invalid: [
    // Cross-feature import — ILLEGAL
    {
      code: `
        // @asua layer: meaning
        import { UserCard } from '@/features/user/UserCard'
      `,
      filename: '/project/src/features/product/ProductCard.tsx',
      errors: [{ messageId: 'featureIsolation' }],
    },
  ],
})
