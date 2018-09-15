import Map from './Map.mjs'
import Seq from './Seq.mjs'
import { str } from './_string.mjs'
import parseMap from './parseMap.mjs'
import parseSeq from './parseSeq.mjs'

export const map = {
  class: Map,
  default: true,
  tag: 'tag:yaml.org,2002:map',
  resolve: parseMap,
  stringify: (value, ctx, onComment) => value.toString(ctx, onComment)
}

export const seq = {
  class: Seq,
  default: true,
  tag: 'tag:yaml.org,2002:seq',
  resolve: parseSeq,
  stringify: (value, ctx, onComment) => value.toString(ctx, onComment)
}

export default [map, seq, str]