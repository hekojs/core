import System from '../../src/System'
import SystemUpdatableComponent from '../Components/SystemUpdatableComponent'

export default class SystemUpdatableSystem extends System {
  class = 'SystemUpdatableSystem'

  execute () {
    super.execute()

    this.world.entities.all().forEach(entity => {
      const component = entity.getComponent(SystemUpdatableComponent)

      if(component) {
        component.randomPositionX = Math.random() * 1000
        component.randomPositionY = Math.random() * 1000
        component.randomAngle = Math.random() * 360
        component.randomString = Math.random().toString(36).substring(7)
      }
    })
  }
}