import EntityFactory from '../src/EntityFactory'
import Entity from '../src/Entity'
import World from '../src/Engine'

jest.mock('../src/Engine')
beforeEach(() => {
  World.mockClear()
})

test('can register and return factories', () => {
  const factory = new EntityFactory()

  const creator = () => { }
  factory.register('test', creator)
  expect(factory.get('test')).toBe(creator)
})

test('throw exception when using unknown factory', () => {
  const factory = new EntityFactory()

  expect(() => {
    factory.create('unknown')
  }).toThrow()
})

test('can create entity from factory and send it to engine', () => {
  const engine = new World
  const factory = new EntityFactory(engine)

  const testEntity = new Entity
  factory.register('test', () => {
    return testEntity
  })
  const returnedEntity = factory.create('test', {}, 'myId')

  expect(engine.addEntity.mock.calls[0][0]).toBe(testEntity)
  expect(returnedEntity).toBe(testEntity)
})