export default class SystemManager {
  world = null

  constructor (world) {
    this.world = world
  }

  add (System, attributes) {
    this.world.ecsy.registerSystem(System, attributes)
    const system = this.world.ecsy.getSystem(System)
    system._world = this.world

    if('onAdd' in system) system.onAdd(attributes)

    this.world.events.emit('added.system', {system})

    return system
  }

  get (System) {
    return this.world.ecsy.getSystem(System)
  }

  all () {
    return this.world.ecsy.getSystems()
  }

  remove (System) {
    const system = this.world.ecsy.getSystem(System)
    if('onRemove' in system) system.onRemove()
    this.world.ecsy.removeSystem(System)
    this.world.events.emit('removed.system', {system})
  }
}