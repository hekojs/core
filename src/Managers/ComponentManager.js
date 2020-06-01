export default class ComponentManager {
  world
  components = {}
  withOnTick = {}

  static nextId = 1
  static registered = {}

  static register (Component) {
    ComponentManager.registered[Component.name] = Component
    return Component
  }

  constructor (world) {
    this.world = world

    const events = world.ecsy.entityManager.eventDispatcher
    this._listenAddedEvents(events)
    this._listenRemoveEvents(events)
  }

  exists(id) {
    return id in this.components
  }

  get (id) {
    return this.components[id]
  }

  all() {
    return Object.values(this.components)
  }

  _listenAddedEvents (events) {
    events.addEventListener('EntityManager#COMPONENT_ADDED', (entity, Component) => {
      const component = entity.getComponent(Component)
      component._id = ComponentManager.nextId++
      component._world = this.world
      component._entity = entity
      component._entityId = entity._id

      this.components[component._id] = component
      if ('onTick' in component) this.withOnTick[component._id] = component
      if ('onAdd' in component) component.onAdd()
      this.world.events.emit('added.component', { entity, Component, component })
    })
  }

  _listenRemoveEvents (events) {
    events.addEventListener('EntityManager#COMPONENT_REMOVE', (entity, Component) => {
      const component = entity.getComponent(Component)
      if ('_id' in component) {
        if ('onRemove' in component) component.onRemove()
        delete this.components[component._id]
        if(component._id in this.withOnTick) delete this.withOnTick[component._id]
      }
      this.world.events.emit('removed.component', { entity, Component, component })
    })
  }

  tick (params) {
    this.world.profiler.start('component.total.tick')
    for (const id in this.withOnTick) {
      this.world.profiler.start('component.' + id + '.tick')
      this.withOnTick[id].onTick(params)
      this.world.profiler.stop('component.' + id + '.tick')
    }
    this.world.profiler.stop('plugin.total.tick')
  }
}