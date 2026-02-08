// ═══════════════════════════════════════════════════════════
// Feature Resolver
// Determines which feature a module belongs to
// ═══════════════════════════════════════════════════════════

/**
 * Extract the feature name from a file path.
 * Convention: src/features/<feature-name>/...
 * Returns null if not in a feature directory.
 */
export function resolveFeature(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, '/')
  const match = normalized.match(/\/features\/([^/]+)\//)
  return match ? match[1] : null
}

/**
 * Extract the feature name from an import path.
 */
export function resolveImportFeature(importPath: string): string | null {
  const normalized = importPath.replace(/\\/g, '/').replace(/^@\//, '')
  const match = normalized.match(/features\/([^/]+)\//)
  return match ? match[1] : null
}
