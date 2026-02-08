// ═══════════════════════════════════════════════════════════
// eslint-plugin-asua — Enterprise Entry Point
// ═══════════════════════════════════════════════════════════

import downOnly from './rules/down-only'
import orthogonality from './rules/orthogonality'
import singleQuestion from './rules/single-question'
import featureIsolation from './rules/feature-isolation'
import validHeader from './rules/valid-header'
import validLayerKind from './rules/valid-layer-kind'
import thinRoute from './rules/thin-route'
import namingConvention from './rules/naming-convention'
import contractLifecycle from './rules/contract-lifecycle'
import noBannedImport from './rules/no-banned-import'
import override from './rules/override'

import starterConfig from './configs/starter'
import teamConfig from './configs/team'
import enterpriseConfig from './configs/enterprise'

const plugin = {
  meta: {
    name: 'eslint-plugin-asua',
    version: '1.0.0',
  },
  rules: {
    'down-only': downOnly,
    'orthogonality': orthogonality,
    'single-question': singleQuestion,
    'feature-isolation': featureIsolation,
    'valid-header': validHeader,
    'valid-layer-kind': validLayerKind,
    'thin-route': thinRoute,
    'naming-convention': namingConvention,
    'contract-lifecycle': contractLifecycle,
    'no-banned-import': noBannedImport,
    'override': override,
  },
  configs: {
    starter: starterConfig,
    team: teamConfig,
    enterprise: enterpriseConfig,
  },
}

export = plugin
