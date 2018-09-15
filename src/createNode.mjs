import Map from './schema/Map.mjs'
import Pair from './schema/Pair.mjs'
import Scalar from './schema/Scalar.mjs'
import Seq from './schema/Seq.mjs'

export default function createNode(value, wrapScalars = true) {
  if (value == null) return new Scalar(null)
  if (typeof value !== 'object') return wrapScalars ? new Scalar(value) : value
  if (Array.isArray(value)) {
    const seq = new Seq()
    seq.items = value.map(v => createNode(v, wrapScalars))
    return seq
  } else {
    const map = new Map()
    map.items = Object.keys(value).map(key => {
      const k = createNode(key, wrapScalars)
      const v = createNode(value[key], wrapScalars)
      return new Pair(k, v)
    })
    return map
  }
}