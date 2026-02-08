import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './contract-lifecycle'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('contract-lifecycle', rule, {
  valid: [
    {
      code: `
        /**
         * @contract UserProfile
         * @status stable
         */
        export interface UserProfile {}
      `,
    },
  ],

  invalid: [
    {
      code: `
        /**
         * @contract OldContract
         * @status deprecated
         * @replacement NewContract
         */
        export interface OldContract {}
      `,
      errors: [{ messageId: 'deprecatedContract' }],
    },
    {
      code: `
        /**
         * @contract DeadContract
         * @sunset 2020-01-01
         */
        export interface DeadContract {}
      `,
      errors: [{ messageId: 'sunsetContract' }],
    },
  ],
})
