import { describe, it, expect } from 'vitest'
import { parseASUAHeaders } from './header-parser'

describe('parseASUAHeaders', () => {
  it('parses valid layer and kind', () => {
    const result = parseASUAHeaders(`
      // @asua layer: meaning
      // @asua kind: domain
      export function ProductCard() {}
    `)
    expect(result.found).toBe(true)
    expect(result.header.layer).toBe('meaning')
    expect(result.header.kind).toBe('domain')
    expect(result.errors).toHaveLength(0)
  })

  it('returns found=false when no headers', () => {
    const result = parseASUAHeaders('export function foo() {}')
    expect(result.found).toBe(false)
    expect(result.header.layer).toBeUndefined()
  })

  it('validates layer values', () => {
    const result = parseASUAHeaders(`
      // @asua layer: invalid
      // @asua kind: domain
    `)
    expect(result.errors.some(e => e.includes('Invalid value'))).toBe(true)
  })
})
