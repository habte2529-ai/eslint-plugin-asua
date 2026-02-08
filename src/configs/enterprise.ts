// 🔴 Enterprise Profile — large orgs (500+ modules)
export default {
  plugins: ['asua'],
  rules: {
    'asua/down-only': 'error',
    'asua/orthogonality': 'error',
    'asua/single-question': 'error',
    'asua/feature-isolation': 'error',
    'asua/valid-header': ['error', { profile: 'enterprise' }],
    'asua/valid-layer-kind': 'error',
    'asua/thin-route': ['error', { maxLines: 20 }],
    'asua/naming-convention': 'error',
    'asua/contract-lifecycle': 'error',
    'asua/no-banned-import': ['error', {
      bans: [
        // Add project-specific bans here
      ],
    }],
    'asua/override': 'warn',
  },
}
