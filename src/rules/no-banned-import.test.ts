import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './no-banned-import'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('no-banned-import', rule, {
  valid: [
    // L6 allowed imports
    {
      code: `export const x = 1`,
      filename: '/project/src/elements/Button.tsx',
    },
    // L3 Using cache — LEGAL
    {
      code: `import { useQuery } from '@tanstack/react-query'`,
      filename: '/project/src/orchestrators/ProductOrchestrator.tsx',
    },
  ],

  invalid: [
    // L6 Using state — ILLEGAL
    {
      code: `import { create } from 'zustand'`,
      filename: '/project/src/elements/Button.tsx',
      errors: [{ messageId: 'bannedImport' }],
    },
    // L5 Using analytics — ILLEGAL
    {
      code: `import mixpanel from 'mixpanel-browser'`,
      filename: '/project/src/meaning/ProductCard.tsx',
      options: [{ bans: [{ pattern: 'mixpanel', bannedLayers: ['meaning'], directive: 'Analytics', reason: 'No' }] }],
      errors: [{ messageId: 'bannedImport' }],
    },
  ],
})
