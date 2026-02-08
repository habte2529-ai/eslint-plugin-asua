import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './orthogonality'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('orthogonality', rule, {
  valid: [
    // L4 importing L6 — LEGAL
    {
      code: `
        // @asua layer: structure
        // @asua kind: layout
        import { Card } from '@/elements/Card'
      `,
      filename: '/project/src/structures/DashboardLayout.tsx',
    },
    // L5 importing L6 — LEGAL
    {
      code: `
        // @asua layer: meaning
        // @asua kind: domain
        import { Button } from '@/elements/Button'
      `,
      filename: '/project/src/meaning/product/ProductCard.tsx',
    },
  ],

  invalid: [
    // L4 importing L5 — ILLEGAL
    {
      code: `
        // @asua layer: structure
        // @asua kind: layout
        import { ProductCard } from '@/meaning/product/ProductCard'
      `,
      filename: '/project/src/structures/ProductGrid.tsx',
      errors: [{ messageId: 'structureImportsMeaning' }],
    },
    // L5 importing L4 — ILLEGAL
    {
      code: `
        // @asua layer: meaning
        // @asua kind: domain
        import { GridLayout } from '@/structures/GridLayout'
      `,
      filename: '/project/src/meaning/product/ProductList.tsx',
      errors: [{ messageId: 'meaningImportsStructure' }],
    },
  ],
})
