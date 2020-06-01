import World from '../src/World'

export default class BenchmarkWorld extends World {
  constructor () {
    super()

    this.events.on('updated.statistics', ({ statistics }) => {
      console.log('Components : ' + statistics.component.total.update.time + ' ms/s (' + statistics.component.total.update.count + '/s)')
      console.log('Systems : ' + statistics.system.total.execute.time + ' ms/s (' + statistics.system.total.execute.count + '/s)')
      // console.log('Plugin : ' + statistics.plugin.total.update.time + ' ms/s (' + statistics.plugin.total.update.count + ' count)')
      console.log('')
    })
  }
}