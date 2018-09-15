import { YAMLSemanticError, YAMLSyntaxError } from '../errors.mjs'
import Node from './Node.mjs'
import Range from './Range.mjs'

export default class QuoteSingle extends Node {
  static endOfQuote(src, offset) {
    let ch = src[offset]
    while (ch) {
      if (ch === "'") {
        if (src[offset + 1] !== "'") break
        ch = src[(offset += 2)]
      } else {
        ch = src[(offset += 1)]
      }
    }
    return offset + 1
  }

  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */
  get strValue() {
    if (!this.valueRange || !this.context) return null
    const errors = []
    const { start, end } = this.valueRange
    const { indent, src } = this.context
    if (src[end - 1] !== "'")
      errors.push(new YAMLSyntaxError(this, "Missing closing 'quote"))
    let str = ''
    for (let i = start + 1; i < end - 1; ++i) {
      let ch = src[i]
      if (ch === '\n') {
        if (Node.atDocumentBoundary(src, i + 1))
          errors.push(
            new YAMLSemanticError(
              this,
              'Document boundary indicators are not allowed within string values'
            )
          )
        const { fold, offset, error } = Node.foldNewline(src, i, indent)
        str += fold
        i = offset
        if (error)
          errors.push(
            new YAMLSemanticError(
              this,
              'Multi-line single-quoted string needs to be sufficiently indented'
            )
          )
      } else if (ch === "'") {
        str += ch
        i += 1
        if (src[i] !== "'")
          errors.push(
            new YAMLSyntaxError(
              this,
              'Unescaped single quote? This should not happen.'
            )
          )
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i
        let next = src[i + 1]
        while (next === ' ' || next === '\t') {
          i += 1
          next = src[i + 1]
        }
        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch
      } else {
        str += ch
      }
    }
    return errors.length > 0 ? { errors, str } : str
  }

  /**
   * Parses a 'single quoted' value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */
  parse(context, start) {
    this.context = context
    const { src } = context
    let offset = QuoteSingle.endOfQuote(src, start + 1)
    this.valueRange = new Range(start, offset)
    offset = Node.endOfWhiteSpace(src, offset)
    offset = this.parseComment(offset)
    trace: this.type,
      { valueRange: this.valueRange, comment: this.comment },
      JSON.stringify(this.rawValue)
    return offset
  }
}