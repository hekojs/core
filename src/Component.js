import { Component as EcsyComponent } from 'ecsy'
import { Schema } from '@colyseus/schema'

export default class Component extends Schema {
  _id
  _entity
  _entityId

  constructor () {
    super()
    Object.assign(this, EcsyComponent)
    this.reset()
  }

  clear () {
    Object.assign(this, this.constructor.attributes())
  }

  copy (src) {
    Object.assign(this, src)
  }

  reset () {
    Object.assign(this, this.constructor.attributes())
  }

  getEntity () {
    return this._entity
  }

  getWorld () {
    return this._world
  }

  getNamespace() {
    return 'entity.' + this._entityId + '.' + this.constructor.name
  }
}