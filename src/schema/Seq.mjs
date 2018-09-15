// Published as 'yaml/seq'

import toJSON from '../toJSON.mjs'
import Collection from './Collection.mjs'

export default class YAMLSeq extends Collection {
  toJSON(_, keep) {
    return this.items.map((v, i) => toJSON(v, String(i), keep))
  }

  toString(ctx, onComment) {
    if (!ctx) return JSON.stringify(this)
    return super.toString(
      ctx,
      {
        blockItem: ({ type, str }) => (type === 'comment' ? str : `- ${str}`),
        flowChars: { start: '[', end: ']' },
        itemIndent: (ctx.indent || '') + '  '
      },
      onComment
    )
  }
}