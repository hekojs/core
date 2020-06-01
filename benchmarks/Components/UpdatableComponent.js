import Component from '../../src/Component'

export default class UpdatableComponent extends Component {
  static class = 'UpdatableComponent'

  randomPositionX
  randomPositionY
  randomAngle
  randomString

  update ({ tps, delta }) {
    this.randomPositionX = Math.random() * 1000
    this.randomPositionY = Math.random() * 1000
    this.randomAngle = Math.random() * 360
    this.randomString = Math.random().toString(36).substring(7)
  }
}