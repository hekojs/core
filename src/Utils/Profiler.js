const unflatten = require('flat').unflatten

export default class Profiler {
  world
  interval
  temp = {}
  vStore = {}
  store = {}

  constructor (world) {
    this.world = world
  }

  enable() {
    this.interval = setInterval(() => {
      this.flush()
      this.world.events.emit('updated.statistics', { statistics: this.get(true) })
    }, 1000)
  }

  disable() {
    clearInterval(this.interval)
  }

  start (name) {
    this.temp[name] = Date.now()
  }

  stop (name) {
    if (!(name in this.vStore)) this.vStore[name] = { time: 0, count: 0 }
    this.vStore[name].time += Date.now() - this.temp[name]
    this.vStore[name].count += 1
  }

  count (name) {
    if (!(name in this.vStore)) this.vStore[name] = { time: 0, count: 0 }
    this.vStore[name].count += 1
  }

  flush () {
    this.temp = {}
    this.store = Object.assign({}, this.vStore)
    this.vStore = {}
  }

  get (unflate) {
    if (unflate) return unflatten(this.store)
    else return this.store
  }
}
