import Events from 'events'
import Ticker from './Utils/Ticker'
import Profiler from './Utils/Profiler'
import PluginManager from './Managers/PluginManager'
import EntityManager from './Managers/EntityManager'
import ComponentManager from './Managers/ComponentManager'
import SystemManager from './Managers/SystemManager'
import { World as EcsyWorld } from 'ecsy'

export default class World {
  ecsy = new EcsyWorld()
  plugins = new PluginManager(this)
  entities = new EntityManager(this)
  components = new ComponentManager(this)
  systems = new SystemManager(this)
  profiler = new Profiler(this)
  events = (new Events()).setMaxListeners(Infinity)
  ticker
  gsap

  constructor (ticker) {
    this.ticker = ticker || new Ticker(60)
    this.gsap = this.ticker.gsap

    this.tick = (time, deltaTime, frame) => {
      this._tick(time, deltaTime, frame)
    }
  }

  start () {
    this.events.emit('starting', { world: this })

    this.profiler.enable()
    this.plugins.start()
    this.ticker.add(this.tick)

    this.events.emit('started', { world: this })
  }

  stop () {
    this.events.emit('stopping', { world: this })

    this.plugins.stop()
    this.ticker.remove(this.tick)

    this.events.emit('stopped', { world: this })
  }

  _tick (time, deltaTime, frame) {
    this.events.emit('before-tick')

    const payload = { tps: this.ticker.tps(), delta: deltaTime, frame }

    this.components.tick(payload)
    this.ecsy.execute(deltaTime, time)
    this.plugins.tick(payload)

    this.events.emit('after-tick')
  }

  serialize () {
    return {
      tps: this.ticker.tps()
    }
  }

  hydrate (serialized) {
    this.ticker.tps(serialized.tps)
  }
}
