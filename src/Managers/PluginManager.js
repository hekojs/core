export default class PluginManager {
  world = null
  plugins = {}

  constructor (world) {
    this.world = world
  }

  add (Plugin, params) {
    this.plugins[Plugin.name] = new Plugin(this.world, params)
    this.world.events.emit('added.plugin', {plugin: this.plugins[Plugin.name]})

    return this.plugins[Plugin.name]
  }

  has (Plugin) {
    return (typeof Plugin === 'string' ? Plugin : Plugin.name) in this.plugins
  }

  get (Plugin) {
    return this.plugins[typeof Plugin === 'string' ? Plugin : Plugin.name]
  }

  all () {
    return Object.values(this.plugins)
  }

  remove (Plugin) {
    if ('stop' in this.plugins[Plugin.name]) this.plugins[Plugin.name].stop()
    this.world.events.emit('removed.plugin', {plugin: this.plugins[Plugin.name]})
    delete this.plugins[Plugin.name]
  }

  _runMethod (method, params) {
    this.world.profiler.start('plugin.total.' + method)
    for (const name in this.plugins) {
      this.world.profiler.start('plugin.' + name + '.' + method)
      if (method in this.plugins[name]) this.plugins[name][method](params)
      this.world.profiler.stop('plugin.' + name + '.' + method)
    }
    this.world.profiler.stop('plugin.total.' + method)
  }

  start (params) {
    this._runMethod('onStart', params)
  }

  stop (params) {
    this._runMethod('onStop', params)
  }

  tick (params) {
    this._runMethod('onTick', params)
  }
}