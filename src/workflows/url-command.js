/**
 * @typedef {{commander: Commander, api: BraviaRestApi, matchCommand: string, matchKeys: Array<string>}} CommandOptions
 */

import { BraviaRestApi } from '../utils/bravia-rest-api' // eslint-disable-line no-unused-vars
import { $pubsub } from '../utils/pubsub'
import { isNumber } from '../utils/validate'
import { BRAVIA_API_EVENT } from '../config/events'
import { Commander } from './commander'

export class Command {
  /**
  * 
  * @param {CommandOptions} param0 
  */
  constructor ({ commander, matchCommand, api, matchKeys }) {
    const url = new URL(location.href)

    this._api = api
    this._parmas = {}
    this.execute = this.execute.bind(this)
    
    url.searchParams.forEach((value, key) => {
      if (!matchKeys.includes(key)) return

      this._parmas[key] = value
    })

    commander.add(matchCommand, this.execute)
  }

  /**
   * @returns {Promise<any>}
   */
  execute () {}
}

export class PowerTV extends Command {
  /**
   * 
   * @param {CommandOptions} options 
   */
  constructor (options) {
    super({
      ...options,
      matchCommand: 'power_tv',
      matchKeys: ['status']
    })
  }

  execute () {
    const status = Number(this._parmas.status)

    if (![0, 1].includes(status)) {
      return Promise.reject(new Error('非法电源开关控制'))
    }

    // 需要先局域网唤醒
    // https://pro-bravia.sony.net/develop/integrate/ip-control/
    return this._api.getSystemInformation()
      .then(() => this._api.setPowerStatus(!!status))
  }
}

export class OpenApp extends Command {
  /**
   * 
   * @param {CommandOptions} options 
   */
  constructor (options) {
    super({
      ...options,
      matchCommand: 'open_app',
      matchKeys: ['app_name']
    })
  }

  execute () {
    const { app_name: appName } = this._parmas

    return this._api.getApplicationList()
      .then(result => {
        const appList = [].concat.apply([], result)
        const curr = appList.find(item => item.title === appName)

        if (!curr) {
          return Promise.reject(new Error('没找到对应的App'))
        }

        return this._api.setActiveApp(curr.uri)
      })
  }
}

export class SetAudio extends Command {
  /**
   * 
   * @param {CommandOptions} options 
   */
  constructor (options) {
    super({
      ...options,
      matchCommand: 'set_audio',
      matchKeys: ['volume', 'target']
    })
  }

  execute () {
    const { volume, target = 'speaker' } = this._parmas
    const numberVolume = Number(volume)

    if (!isNumber(numberVolume)) {
      return Promise.reject(new Error('非法的音量输入'))
    }

    if (numberVolume < 0 || numberVolume > 100) {
      return Promise.reject(new Error('非法的音量范围'))
    }

    return this._api.setAudioVolume([{
      volume,
      ui: 'on',
      target
    }])
  }
}

const urlCommander = new Commander()
const registCommands = api => {
  new PowerTV({
    commander: urlCommander,
    api
  })
  new OpenApp({
    commander: urlCommander,
    api
  })
  new SetAudio({
    commander: urlCommander,
    api
  })
}

$pubsub.subscribe(BRAVIA_API_EVENT.INIT, registCommands)
$pubsub.subscribe(BRAVIA_API_EVENT.UPDATE, registCommands)

export {
  urlCommander
}
