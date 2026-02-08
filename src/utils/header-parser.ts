// ═══════════════════════════════════════════════════════════
// ASUA Header Parser
// Parses @asua comment headers from source files
// ═══════════════════════════════════════════════════════════

import type { Layer, Kind, Runtime, Purity, Exposure, CompositionRole } from '../constants'

export interface ASUAHeader {
  layer?: Layer
  kind?: Kind
  runtime?: Runtime
  purity?: Purity
  exposure?: Exposure
  compositionRole?: CompositionRole
}

export interface HeaderParseResult {
  header: ASUAHeader
  found: boolean
  errors: string[]
  /** Line numbers where each @asua directive was found */
  locations: Record<string, number>
}

const HEADER_REGEX = /\/\/\s*@asua\s+([\w-]+):\s*(\w+)/g

const VALID_PROPERTIES: Record<string, readonly string[]> = {
  layer: [
    'foundation', 'boundary', 'screen',
    'orchestrator', 'structure', 'meaning', 'element',
  ],
  kind: ['ui', 'layout', 'domain', 'orchestration', 'infrastructure', 'boundary'],
  runtime: ['server', 'client', 'universal'],
  purity: ['pure', 'effectful'],
  exposure: ['public', 'internal'],
  'composition-role': ['leaf', 'composite', 'root'],
}

/**
 * Parse ASUA headers from source code text.
 * Headers are single-line comments of the form:
 *   // @asua layer: orchestrator
 *   // @asua kind: orchestration
 */
export function parseASUAHeaders(sourceCode: string): HeaderParseResult {
  const header: ASUAHeader = {}
  const errors: string[] = []
  const locations: Record<string, number> = {}
  let found = false

  const lines = sourceCode.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Stop scanning after the first non-comment, non-empty line
    // (headers must be at the top of the file)
    if (
      line !== '' &&
      !line.startsWith('//') &&
      !line.startsWith("'use ") &&
      !line.startsWith('"use ')
    ) {
      break
    }

    const match = line.match(/^\/\/\s*@asua\s+([\w-]+):\s*(\w+)$/)
    if (match) {
      found = true
      const [, property, value] = match
      const normalizedProp = property.toLowerCase()
      const normalizedValue = value.toLowerCase()

      locations[normalizedProp] = i + 1 // 1-indexed line number

      if (!VALID_PROPERTIES[normalizedProp]) {
        errors.push(
          `Unknown @asua property "${property}" at line ${i + 1}. ` +
          `Valid properties: ${Object.keys(VALID_PROPERTIES).join(', ')}`
        )
        continue
      }

      if (!VALID_PROPERTIES[normalizedProp].includes(normalizedValue)) {
        errors.push(
          `Invalid value "${value}" for @asua ${property} at line ${i + 1}. ` +
          `Valid values: ${VALID_PROPERTIES[normalizedProp].join(', ')}`
        )
        continue
      }

      switch (normalizedProp) {
        case 'layer':
          header.layer = normalizedValue as Layer
          break
        case 'kind':
          header.kind = normalizedValue as Kind
          break
        case 'runtime':
          header.runtime = normalizedValue as Runtime
          break
        case 'purity':
          header.purity = normalizedValue as Purity
          break
        case 'exposure':
          header.exposure = normalizedValue as Exposure
          break
        case 'composition-role':
          header.compositionRole = normalizedValue as CompositionRole
          break
      }
    }
  }

  return { header, found, errors, locations }
}
