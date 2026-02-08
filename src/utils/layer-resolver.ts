// ═══════════════════════════════════════════════════════════
// Layer Resolver
// Determines a module's ASUA layer from its file path
// Uses: (1) @asua header (primary), (2) directory mapping (fallback)
// ═══════════════════════════════════════════════════════════

import { DEFAULT_DIRECTORY_MAP, type Layer } from '../constants'
import { parseASUAHeaders } from './header-parser'
import path from 'path'

export interface ResolverOptions {
  /** Custom directory-to-layer mapping (merges with defaults) */
  directoryMap?: Record<string, Layer>
  /** The project's src root (default: 'src') */
  srcRoot?: string
}

/**
 * Resolve the ASUA layer for a given file path.
 * Priority: @asua header > directory convention > null
 */
export function resolveLayerFromPath(
  filePath: string,
  options: ResolverOptions = {}
): Layer | null {
  const dirMap = { ...DEFAULT_DIRECTORY_MAP, ...options.directoryMap }
  const srcRoot = options.srcRoot ?? 'src'

  // Normalize path
  const normalized = filePath.replace(/\\/g, '/')

  // Get path relative to src root
  const srcIndex = normalized.indexOf(`/${srcRoot}/`)
  if (srcIndex === -1) return null

  const relativePath = normalized.slice(srcIndex + srcRoot.length + 2)
  const segments = relativePath.split('/')

  // Check each directory segment (first match wins)
  for (const segment of segments) {
    const lower = segment.toLowerCase()
    if (dirMap[lower]) {
      return dirMap[lower]
    }
  }

  return null
}

/**
 * Resolve the ASUA layer from source code headers.
 * Returns the layer from @asua header if present.
 */
export function resolveLayerFromSource(sourceCode: string): Layer | null {
  const result = parseASUAHeaders(sourceCode)
  return result.header.layer ?? null
}

/**
 * Combined resolver: tries header first, then falls back to path.
 */
export function resolveLayer(
  filePath: string,
  sourceCode: string,
  options: ResolverOptions = {}
): Layer | null {
  return resolveLayerFromSource(sourceCode) ?? resolveLayerFromPath(filePath, options)
}
