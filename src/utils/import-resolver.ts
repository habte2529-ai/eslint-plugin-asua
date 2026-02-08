// ═══════════════════════════════════════════════════════════
// Import Resolver
// Resolves an import path to its target ASUA layer
// ═══════════════════════════════════════════════════════════

import { DEFAULT_DIRECTORY_MAP, type Layer } from '../constants'
import type { ResolverOptions } from './layer-resolver'

/**
 * Resolve the ASUA layer of an import target from its import path.
 * Works with alias paths (e.g. @/orchestrators/product) and
 * relative paths (e.g. ../../elements/Button).
 */
export function resolveImportLayer(
  importPath: string,
  options: ResolverOptions = {}
): Layer | null {
  const dirMap = { ...DEFAULT_DIRECTORY_MAP, ...options.directoryMap }

  // Normalize
  const normalized = importPath.replace(/\\/g, '/')

  // Skip external packages (node_modules)
  if (
    !normalized.startsWith('.') &&
    !normalized.startsWith('/') &&
    !normalized.startsWith('@/')
  ) {
    return null // External package — not ASUA-managed
  }

  // Remove alias prefix
  const cleaned = normalized.replace(/^@\//, '')

  // Split into segments and check each
  const segments = cleaned.split('/')
  for (const segment of segments) {
    const lower = segment.toLowerCase()
    if (dirMap[lower]) {
      return dirMap[lower]
    }
  }

  return null
}
