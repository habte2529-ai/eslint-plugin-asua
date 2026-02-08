// 🟢 Starter Profile — solo devs, small projects (<50 modules)
export default {
  plugins: ['asua'],
  rules: {
    'asua/down-only': 'error',
    'asua/orthogonality': 'off',
    'asua/single-question': 'warn',
    'asua/feature-isolation': 'off',
    'asua/valid-header': ['error', { profile: 'starter' }],
    'asua/valid-layer-kind': 'error',
    'asua/thin-route': 'off',
    'asua/naming-convention': 'off',
    'asua/contract-lifecycle': 'off',
    'asua/no-banned-import': 'off',
    'asua/override': 'warn',
  },
}
