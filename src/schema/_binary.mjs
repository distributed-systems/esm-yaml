// Published as 'yaml/types/binary'

import { YAMLReferenceError } from '../errors.mjs'
import { Type } from '../cst/Node.mjs'
import { resolve as resolveStr, stringify as stringifyStr } from './_string.mjs'

export const binary = {
  class: Uint8Array, // Buffer inherits from Uint8Array
  default: false,
  tag: 'tag:yaml.org,2002:binary',
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve: (doc, node) => {
    if (typeof Buffer === 'function') {
      const src = resolveStr(doc, node)
      return Buffer.from(src, 'base64')
    } else if (typeof atob === 'function') {
      const src = atob(resolveStr(doc, node))
      const buffer = new Uint8Array(src.length)
      for (let i = 0; i < src.length; ++i) buffer[i] = src.charCodeAt(i)
      return buffer
    } else {
      doc.errors.push(
        new YAMLReferenceError(
          node,
          'This environment does not support reading binary tags; either Buffer or atob is required'
        )
      )
      return null
    }
  },
  options: { defaultType: Type.BLOCK_LITERAL, lineWidth: 76 },
  stringify: ({ comment, type, value }, ctx, onComment) => {
    let src
    if (typeof Buffer === 'function') {
      src =
        value instanceof Buffer
          ? value.toString('base64')
          : Buffer.from(value.buffer).toString('base64')
    } else if (typeof btoa === 'function') {
      let s = ''
      for (let i = 0; i < value.length; ++i) s += String.fromCharCode(buf[i])
      src = btoa(s)
    } else {
      throw new Error(
        'This environment does not support writing binary tags; either Buffer or btoa is required'
      )
    }
    if (!type) type = binary.options.defaultType
    if (type === Type.QUOTE_DOUBLE) {
      value = src
    } else {
      const { lineWidth } = binary.options
      const n = Math.ceil(src.length / lineWidth)
      const lines = new Array(n)
      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = src.substr(o, lineWidth)
      }
      value = lines.join(type === Type.BLOCK_LITERAL ? '\n' : ' ')
    }
    return stringifyStr({ comment, type, value }, ctx, onComment)
  }
}

export default [binary]