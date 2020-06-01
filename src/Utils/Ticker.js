import { gsap } from 'gsap'
import _ from 'lodash'

export default class Ticker {
  gsap = gsap
  options = {
    tps: 60
  }

  constructor (options) {
    _.merge(this.options, options)
    this.tps(this.options.tps)
  }

  tps (tps) {
    if(tps) {
      this.options.tps = tps
      this.gsap.ticker.fps(tps)
    } else {
      return this.options.tps
    }
  }

  add(callback) {
    this.gsap.ticker.add(callback)
  }

  remove(callback) {
    this.gsap.ticker.remove(callback)
  }
}