import $ from 'jquery'
import { Widget } from './base'

export class PowerWidget extends Widget {
  constructor () {
    super('div')
    this.el.classList.add('power-widget')
  }

  _init () {
    this._bindEvent()
    this.render()
  }

  _bindEvent () {
    const $el = $(this.el)

    $el.on('click', '.btn_set_power', (e) => {
      const $target = $(e.target)
      const status = !!$target.data('power-status')

      // 需要先局域网唤醒
      // https://pro-bravia.sony.net/develop/integrate/ip-control/
      this._api.getSystemInformation().then(() => {
        this._api.setPowerStatus(status)
      })
    })
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="form-horizontal">
        <div class="form-group">
          <label for="powerStatus" class="col-xs-3 control-label">电源控制</label>
          <div class="col-xs-9">
            <button class="btn btn-primary btn_set_power" data-power-status="1">开</button>
            <button class="btn btn-danger btn_set_power" data-power-status="0">关</button>
          </div>
        </div>
      </div>
    `

    return this
  }
}

export const powerWidget = new PowerWidget()
