// ═══════════════════════════════════════════════════════════
// ASUA Constants — Single source of truth for the plugin
// ═══════════════════════════════════════════════════════════

export const LAYERS = [
  'foundation',
  'boundary',
  'screen',
  'orchestrator',
  'structure',
  'meaning',
  'element',
] as const

export type Layer = (typeof LAYERS)[number]

// Layer numeric index (lower = higher in the stack)
export const LAYER_INDEX: Record<Layer, number> = {
  foundation: 0,
  boundary: 1,
  screen: 2,
  orchestrator: 3,
  structure: 4,
  meaning: 5,
  element: 6,
}

export const LAYER_DISPLAY: Record<Layer, string> = {
  foundation: 'L0 Foundation',
  boundary: 'L1 Boundary',
  screen: 'L2 Screen',
  orchestrator: 'L3 Orchestrator',
  structure: 'L4 Structure',
  meaning: 'L5 Meaning',
  element: 'L6 Element',
}

export const KINDS = [
  'ui',
  'layout',
  'domain',
  'orchestration',
  'infrastructure',
  'boundary',
] as const

export type Kind = (typeof KINDS)[number]

export const RUNTIMES = ['server', 'client', 'universal'] as const
export type Runtime = (typeof RUNTIMES)[number]

export const PURITIES = ['pure', 'effectful'] as const
export type Purity = (typeof PURITIES)[number]

export const EXPOSURES = ['public', 'internal'] as const
export type Exposure = (typeof EXPOSURES)[number]

export const COMPOSITION_ROLES = ['leaf', 'composite', 'root'] as const
export type CompositionRole = (typeof COMPOSITION_ROLES)[number]

// ═══════════════════════════════════════════════════════════
// Validity Tables
// ═══════════════════════════════════════════════════════════

export const VALID_KIND_PER_LAYER: Record<Layer, Kind[]> = {
  foundation: ['infrastructure'],
  boundary: ['boundary'],
  screen: ['boundary'],
  orchestrator: ['orchestration'],
  structure: ['layout'],
  meaning: ['domain'],
  element: ['ui'],
}

export const VALID_RUNTIME_PER_LAYER: Record<Layer, Runtime[]> = {
  foundation: ['server', 'client', 'universal'],
  boundary: ['server'],
  screen: ['server'],
  orchestrator: ['server', 'client'],
  structure: ['universal', 'client', 'server'],
  meaning: ['client', 'universal'],
  element: ['client', 'universal'],
}

// ═══════════════════════════════════════════════════════════
// Import Rules — Which layers can import which
// ═══════════════════════════════════════════════════════════

// Returns true if `fromLayer` is allowed to import `toLayer`
export function isImportAllowed(
  fromLayer: Layer,
  toLayer: Layer
): boolean {
  const fromIdx = LAYER_INDEX[fromLayer]
  const toIdx = LAYER_INDEX[toLayer]

  // Foundation (L0) can be imported by anyone
  if (toLayer === 'foundation') return true

  // Foundation imports nothing
  if (fromLayer === 'foundation') return false

  // Law 2: L4 <-> L5 is blocked
  if (fromLayer === 'structure' && toLayer === 'meaning') return false
  if (fromLayer === 'meaning' && toLayer === 'structure') return false

  // Law 1: Down only (fromIdx <= toIdx)
  return fromIdx <= toIdx
}

// ═══════════════════════════════════════════════════════════
// Directory-to-layer mapping
// ═══════════════════════════════════════════════════════════

export const DEFAULT_DIRECTORY_MAP: Record<string, Layer> = {
  foundation: 'foundation',
  infrastructure: 'foundation',
  lib: 'foundation',
  boundary: 'boundary',
  providers: 'boundary',
  screens: 'screen',
  pages: 'screen',
  app: 'screen', // Next.js app/ directory pages
  orchestrators: 'orchestrator',
  structures: 'structure',
  layouts: 'structure',
  meaning: 'meaning',
  features: 'meaning',
  elements: 'element',
  ui: 'element',
  components: 'element', // default assumption for generic components/
}
