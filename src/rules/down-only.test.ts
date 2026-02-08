import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './down-only'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('down-only', rule, {
  valid: [
    // L3 importing L4 (downward) — LEGAL
    {
      code: `
        // @asua layer: orchestrator
        // @asua kind: orchestration
        import { Layout } from '@/structures/DashboardLayout'
      `,
      filename: '/project/src/orchestrators/Dashboard.tsx',
    },
    // L3 importing L5 (downward) — LEGAL
    {
      code: `
        // @asua layer: orchestrator
        // @asua kind: orchestration
        import { ProductCard } from '@/meaning/product/ProductCard'
      `,
      filename: '/project/src/orchestrators/Product.tsx',
    },
    // L5 importing L6 (downward) — LEGAL
    {
      code: `
        // @asua layer: meaning
        // @asua kind: domain
        import { Button } from '@/elements/Button'
      `,
      filename: '/project/src/meaning/product/ProductCard.tsx',
    },
    // L3 importing L0 (foundation) — LEGAL
    {
      code: `
        // @asua layer: orchestrator
        // @asua kind: orchestration
        import { apiClient } from '@/infrastructure/api'
      `,
      filename: '/project/src/orchestrators/Product.tsx',
    },
    // External package import — IGNORED
    {
      code: `
        // @asua layer: meaning
        // @asua kind: domain
        import React from 'react'
      `,
      filename: '/project/src/meaning/product/ProductCard.tsx',
    },
  ],

  invalid: [
    // L5 importing L3 (upward) — ILLEGAL
    {
      code: `
        // @asua layer: meaning
        // @asua kind: domain
        import { fetchProduct } from '@/orchestrators/product'
      `,
      filename: '/project/src/meaning/product/ProductCard.tsx',
      errors: [{ messageId: 'downOnly' }],
    },
    // L6 importing L5 (upward) — ILLEGAL
    {
      code: `
        // @asua layer: element
        // @asua kind: ui
        import { ProductType } from '@/meaning/product/types'
      `,
      filename: '/project/src/elements/Button.tsx',
      errors: [{ messageId: 'downOnly' }],
    },
    // L6 importing L3 (upward) — ILLEGAL
    {
      code: `
        // @asua layer: element
        // @asua kind: ui
        import { useProducts } from '@/orchestrators/product'
      `,
      filename: '/project/src/elements/ProductBadge.tsx',
      errors: [{ messageId: 'downOnly' }],
    },
    // Foundation importing L3 (upward) — ILLEGAL
    {
      code: `
        // @asua layer: foundation
        // @asua kind: infrastructure
        import { ProductOrchestrator } from '@/orchestrators/product'
      `,
      filename: '/project/src/infrastructure/cache.ts',
      errors: [{ messageId: 'downOnly' }],
    },
  ],
})
