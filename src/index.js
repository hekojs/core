import World from './World'
import Component from './Component'
import System from './System'
import * as Schema from '@colyseus/schema'
import EntityBuilder from './EntityBuilder'
import ComponentManager from './Managers/ComponentManager'
import EntityManager from './Managers/EntityManager'

export default {
  World,
  ComponentManager,
  EntityManager,
  EntityBuilder,
  Component,
  System,
  Schema,

  registerComponent (Component, options) {
    ComponentManager.register(Component, options)
  },
  registerEntity (Entity, options) {
    EntityManager.register(Entity, options)
  },
  registerComponents (Components, options) {
    if (typeof Components === 'object') Components = Object.values(Components)
    Components.forEach(Component => this.registerComponent(Component, options))
  },
  registerEntities (Entities, options) {
    if (typeof Entities === 'object') Entities = Object.values(Entities)
    Entities.forEach(Entity => this.registerEntity(Entity, options))
  }
}
