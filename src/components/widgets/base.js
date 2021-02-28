import { BraviaRestApi } from '../../utils/bravia-rest-api' // eslint-disable-line no-unused-vars
import { $pubsub } from '../../utils/pubsub'
import { BRAVIA_API_EVENT } from '../../config/events'
import { UnMountComponent } from '../base'

export class Widget extends UnMountComponent {
  /**
   * 
   * @param {string} tagName 
   */
  constructor (tagName) {
    super(tagName)

    /**
     * @type {BraviaRestApi}
     */
    this._api = null

    this.el.classList.add('widget')
    this._bindReceiveApi()
    this._init()
  }

  _init () {
    this.render()
  }

  _bindReceiveApi () {
    const setApi = api => {
      this._api = api
    }

    $pubsub.subscribe(BRAVIA_API_EVENT.INIT, setApi)
    $pubsub.subscribe(BRAVIA_API_EVENT.UPDATE, setApi)
  }

  hasApi () {
    return this._api !== null
  }
}
