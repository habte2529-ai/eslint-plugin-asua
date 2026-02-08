// ═══════════════════════════════════════════════════════════
// Override Parser
// Parses @asua-override directives
// ═══════════════════════════════════════════════════════════

export interface ASUAOverride {
  law: string
  reason: string
  ticket?: string
  expires?: string
  line: number
}

export function parseOverrides(sourceCode: string): ASUAOverride[] {
  const overrides: ASUAOverride[] = []
  const lines = sourceCode.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const lineContent = lines[i]
    if (!lineContent.includes('@asua-override')) continue

    // Loose check for existence
    const match = lineContent.match(
      /\/\/\s*@asua-override\s+law:(\S+)(?:\s+reason:"([^"]*)")?(?:\s+ticket:(\S+))?(?:\s+expires:(\S+))?/
    )
    
    if (match) {
      overrides.push({
        law: match[1],
        reason: match[2] || '', // Empty string if missing
        ticket: match[3],
        expires: match[4],
        line: i + 1,
      })
    }
  }
  return overrides
}
