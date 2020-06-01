import Entity from '../src/Entity'
import Ability from '../src/Ability'
import World from '../src/Engine'

jest.mock('../src/Ability')
jest.mock('../src/Engine')

test('can add abilities', () => {
  const testEntity = new Entity()

  const testAbility = new Ability()
  testAbility.getName = jest.fn(() => 'testAbilityName')

  testEntity.add(testAbility)
  expect(testEntity.testAbilityName).toBe(testAbility)
  expect(testEntity.abilities.testAbilityName).toBe(testAbility)
})

test('can remove abilities', () => {
  const testEntity = new Entity()

  const testAbility = new Ability()
  testAbility.getName = jest.fn(() => 'testAbilityName')

  testEntity.add(testAbility)
  testEntity.remove(testAbility)
  expect(testEntity.testAbilityName).toBe(undefined)
  expect(testEntity.abilities.testAbilityName).toBe(undefined)
})

test('can add abilities but should not call attach when not attached', () => {
  const testEntity = new Entity()

  const testAbility = new Ability()
  testAbility.getName = jest.fn(() => 'testAbilityName')
  testAbility.attach = jest.fn()

  testEntity.add(testAbility)
  expect(testAbility.attach.mock.calls.length).toBe(0)
})

test('can add abilities and call attach when is attached', () => {
  const testEntity = new Entity()
  testEntity.isAttached = true

  const testAbility = new Ability()
  testAbility.getName = jest.fn(() => 'testAbilityName')
  testAbility.attach = jest.fn()

  testEntity.add(testAbility)
  expect(testAbility.attach.mock.calls.length).toBe(1)
})

test('can destroy itself by removing its entity from engine', () => {
  const testEntity = new Entity()
  const engine = new World()
  engine.removeEntity = jest.fn()

  testEntity.engine = engine
  testEntity.destroy()

  expect(engine.removeEntity.mock.calls.length).toBe(1)
})

test('attach all abilities when attached', () => {
  const testEntity = new Entity()
  const engine = new World()

  const testAbility1 = new Ability()
  testAbility1.getName = jest.fn(() => 'testAbility1')
  testAbility1.attach = jest.fn()
  const testAbility2 = new Ability()
  testAbility2.getName = jest.fn(() => 'testAbility2')
  testAbility2.attach = jest.fn()

  testEntity.add(testAbility1)
  testEntity.add(testAbility2)
  testEntity.attach(engine, 'testId')

  expect(testAbility1.attach.mock.calls.length).toBe(1)
  expect(testAbility2.attach.mock.calls.length).toBe(1)
})

test('detach all abilities when detached', () => {
  const testEntity = new Entity()

  const testAbility1 = new Ability()
  testAbility1.getName = jest.fn(() => 'testAbility1')
  testAbility1.detach = jest.fn()
  const testAbility2 = new Ability()
  testAbility2.getName = jest.fn(() => 'testAbility2')
  testAbility2.detach = jest.fn()

  testEntity.add(testAbility1)
  testEntity.add(testAbility2)
  testEntity.detach()

  expect(testAbility1.detach.mock.calls.length).toBe(1)
  expect(testAbility2.detach.mock.calls.length).toBe(1)
})

test('should forward update calls to abilities', () => {
  const testEntity = new Entity()

  const testAbility = new Ability()
  testAbility.getName = jest.fn(() => 'testAbility1')
  testAbility.update = jest.fn()
  testAbility.update1 = jest.fn()
  testAbility.update60 = jest.fn()

  testEntity.add(testAbility)

  testEntity.update({ tps: null, delta: null })
  expect(testAbility.update.mock.calls.length).toBe(1)
  testEntity.update1()
  expect(testAbility.update1.mock.calls.length).toBe(1)
  testEntity.update60()
  expect(testAbility.update60.mock.calls.length).toBe(1)
})

test('should serialize meta and abilities', () => {
  const testEntity = new Entity()
  testEntity.meta = {
    one: 'value'
  }

  const testAbility = new Ability()
  testAbility.getName = jest.fn(() => 'testAbility1')
  testAbility.serialize = jest.fn(() => {return {is: 'serialized'}})
  testEntity.add(testAbility)

  expect(testEntity.serialize().meta).toStrictEqual({one: 'value'})
  expect(testEntity.serialize().abilities.testAbility1).toStrictEqual({is: 'serialized'})
})