import { Type } from '../cst/Node.mjs'
import toJSON from '../toJSON.mjs'
import Node from './Node.mjs'

export default class Alias extends Node {
  static set default(val) {
    this._static = val; 
  }

  static get default() {
    return this._static === undefined ? true : this._static;
  }


  static stringify({ range, source }, { anchors, doc, implicitKey }) {
    const anchor = Object.keys(anchors).find(a => anchors[a] === source)
    if (anchor) return `*${anchor}${implicitKey ? ' ' : ''}`
    const msg = doc.anchors.getName(source)
      ? 'Alias node must be after source node'
      : 'Source node not found for alias node'
    throw new Error(`${msg} [${range}]`)
  }

  constructor(source) {
    super()
    this.source = source
    this.type = Type.ALIAS
  }

  set tag(t) {
    throw new Error('Alias nodes cannot have tags')
  }

  toJSON(arg, keep) {
    return toJSON(this.source, arg, keep)
  }
}

Alias.prototype.default = true;