import BenchmarkWorld from './BenchmarkWorld'
import Entity from '../src/Entity'
import EmptyComponent from './Components/EmptyComponent'
import SystemUpdatableComponent from './Components/SystemUpdatableComponent'
import UpdatableComponent from './Components/UpdatableComponent'
import SystemUpdatableSystem from './Systems/SystemUpdatableSystem'

const world = new BenchmarkWorld()

world.entities.register('no-component', (world) => {
  return new Entity(world)
})

world.entities.register('one-empty-component', (world) => {
  return new Entity(world)
    .addComponent(EmptyComponent)
})

world.entities.register('full-component', (world) => {
  return new Entity(world)
    .addComponent(EmptyComponent)
    .addComponent(UpdatableComponent)
    .addComponent(SystemUpdatableComponent)
})

world.systems.add(SystemUpdatableSystem)

for(let i = 0; i < 10000; i++) {
  world.entities.create('no-component')
  world.entities.create('one-empty-component')
  world.entities.create('full-component')
}

world.start()