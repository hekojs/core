export default class EntityManager {
  world
  entities = {}

  static nextId = 1
  static registered = {}

  static register (Builder, options) {
    EntityManager.registered[Builder.name] = new Builder(options)
    return Builder
  }

  constructor (world) {
    this.world = world

    const events = world.ecsy.entityManager.eventDispatcher
    this._listenRemoveEvents(events)
  }

  add (source, params, id) {
    // Creating a new entity from ecsy manager giving him our id
    let entity = this.world.ecsy.entityManager.createEntity()
    entity._id = id || EntityManager.nextId++

    // Try to configure the entity from a builder or, from the source function if set
    if (source) {
      if (typeof source.name !== 'undefined') {
        if (!(source.name in EntityManager.registered)) throw 'No entity builder ' + source.name + ' registered.'
        entity = EntityManager.registered[source.name].create(entity, params)
        entity._builderName = source.name
        entity._builderParams = params
        entity.getBuilder = () => {
          return { name: source.name, params}
        }
      } else if (typeof source === 'function') {
        entity = source(entity)
        delete entity._builderName
        delete entity._builderParams
        delete entity.getBuilder
      }
    }

    this.entities[entity._id] = entity

    this.world.events.emit('added.entity', { entity })

    return entity
  }

  exists(id) {
    return id in this.entities
  }

  get (id) {
    return this.entities[id]
  }

  all() {
    return Object.values(this.entities)
  }

  remove (entityOrId, immediately) {
    let entity = null
    if (typeof entityOrId !== 'object') entity = this.get(entityOrId)
    else entity = entityOrId

    entity.remove(immediately)
  }

  _listenRemoveEvents (events) {
    events.addEventListener('EntityManager#ENTITY_REMOVED', (entity) => {
      delete this.entities[entity._id]
      this.world.events.emit('removed.entity', { entity })
    })
  }
}