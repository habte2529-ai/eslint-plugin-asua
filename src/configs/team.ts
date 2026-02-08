// 🟡 Team Profile — product teams (50–500 modules)
export default {
  plugins: ['asua'],
  rules: {
    'asua/down-only': 'error',
    'asua/orthogonality': 'error',
    'asua/single-question': 'warn',
    'asua/feature-isolation': 'error',
    'asua/valid-header': ['error', { profile: 'team' }],
    'asua/valid-layer-kind': 'error',
    'asua/thin-route': ['warn', { maxLines: 25 }],
    'asua/naming-convention': 'warn',
    'asua/contract-lifecycle': 'warn',
    'asua/no-banned-import': 'error',
    'asua/override': 'warn',
  },
}
