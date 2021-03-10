import $ from 'jquery'
import { $pubsub } from '../../utils/pubsub'
import { makeAlert } from '../../utils/ui'
import { BRAVIA_API_EVENT } from '../../config/events'
import { Widget } from './base'

export class KeyboardWidget extends Widget {
  /**
   * @type {import('../../utils/bravia-rest-api').BraviaRestApi}
   */
  _restApi = null

  /**
   * @type {import('../../utils/bravia-rest-api.js').BraviaIrccApi}
   */
  _irccApi = null

  constructor () {
    super('div')
    this.el.classList.add('keyboard-widget')
  }

  _bindReceiveApi () {
    const setApi = (restApi, irccApi) => {
      this._restApi = restApi
      this._irccApi = irccApi
    }

    $pubsub.subscribe(BRAVIA_API_EVENT.INIT, setApi)
    $pubsub.subscribe(BRAVIA_API_EVENT.UPDATE, setApi)
  }

  _init () {
    this._bindEvent()
    this.render()
  }

  _bindEvent () {
    const self = this
    const $el = $(this.el)

    $el.on('click', '.btn_ircc', function () {
      const $this = $(this)
      const irccAction = $this.data('ircc')

      self._irccApi.trigger(irccAction).catch(err => {
        makeAlert({ type: 'danger', message: err.message })
      })
    })

    $el.on('click', '.btn_emit_input', function () {
      const $input = $(this).siblings('input')
      const value = $input.val()

      self._restApi.setTextForm(value)
        .then(() => {
          makeAlert({ type: 'success', message: '操作成功' })
        })
        .catch(err => {
          makeAlert({ type: 'danger', message: err.message })
        })
    })
  }

  hasApi () {
    return this._restApi !== null && this._irccApi !== null
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="emit-input">
        <input type="text" class="form-control" placeholder="请确保电视机已显示输入法" />
        <button class="btn btn-default btn_emit_input">发送</button>
      </div>
      <ul class="main-btns">
        <li>
          <button class="btn btn-default btn-lg btn_ircc" data-ircc="Up">
            <span class="glyphicon glyphicon-triangle-top"></span>
          </button>
        </li>
        <li>
          <button class="btn btn-default btn-lg btn_ircc" data-ircc="Left">
            <span class="glyphicon glyphicon-triangle-left"></span>
          </button>
          <button class="btn btn-primary btn-lg btn_ircc" data-ircc="Confirm">
            <span class="glyphicon glyphicon-ok-sign"></span>
          </button>
          <button class="btn btn-default btn-lg btn_ircc" data-ircc="Right">
            <span class="glyphicon glyphicon-triangle-right"></span>
          </button>
        </li>
        <li>
          <button class="btn btn-default btn-lg btn_ircc" data-ircc="Down">
            <span class="glyphicon glyphicon-triangle-bottom"></span>
          </button>
        </li>
      </ul>
      <div class="control-btns">
        <button class="btn btn-default btn_ircc" data-ircc="Back">
          <span class="glyphicon glyphicon-menu-left"></span>
        </button>
        <button class="btn btn-default btn_ircc" data-ircc="Home">
          <span class="glyphicon glyphicon-home"></span>
        </button>
        <button class="btn btn-default btn_ircc" data-ircc="Options">
          <span class="glyphicon glyphicon-menu-hamburger"></span>
        </button>
      </div>
    `

    return this
  }
}

export const keyBoardWidget = new KeyboardWidget()
