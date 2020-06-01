import { System as EcsySystem } from 'ecsy'

export default class System extends EcsySystem {
  getWorld () {
    return this._world
  }

  execute (delta, time) {
    this.onTick({delta, time})
  }
}