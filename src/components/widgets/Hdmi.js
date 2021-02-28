import $ from 'jquery'
import { $pubsub } from '../../utils/pubsub'
import { makeAlert } from '../../utils/ui'
import { BRAVIA_API_EVENT, MODAL_FEATURE_EVENT } from '../../config/events'
import { Widget } from './base'

export class HdmiWidget extends Widget {
  constructor () {
    super('div')
    this.el.classList.add('hdmi-widget')
    this._hdims = []
    this._isLoading = false
  }

  _init () {
    this._bindEvent()
  }

  _bindEvent () {
    const self = this
    const $el = $(this.el)
    const initHdmis = () => {
      if (this._isLoading) return

      this._isLoading = true
      this._api.getContentList([{
        'stIdx': 0,
        'cnt': 50,
        'uri': 'extInput:hdmi'
      }])
        .then(result => {
          const hdmis = [].concat.apply([], result)

          this._hdims = hdmis
          this.render()
        })
        .catch(console.error)
        .finally(() => {
          this._isLoading = false
        })
    }

    $pubsub.subscribe(BRAVIA_API_EVENT.INIT, () => {
      initHdmis()
    })
    $pubsub.subscribe(MODAL_FEATURE_EVENT.SHOW, (widget) => {
      if (this.el !== widget) return
      if (this._hdims.length > 0) return

      initHdmis()
    })

    $el.on('click', '.btn_hdmi', function () {
      const uri = $(this).data('uri')

      self._api.setPlayContent(uri)
        .then(() => {
          makeAlert({ type: 'success', message: '操作成功' })
        })
        .catch(err => {
          makeAlert({ type: 'danger', message: err.message })
        })
    })
  }

  render () {
    this.el.innerHTML = /* html */ `
      <ul class="row">
        ${this._hdims.map(item => /* html */ `
          <li class="col-lg-3 col-md-3 col-xs-4">
            <a class="btn_hdmi" href="javascript:void(0);" data-uri="${item.uri}">
              <h5>${item.title}</h5>
              ${item.label 
                ? /* html */ `<p>
                    <small>${item.label}</small>
                  </p>`
                : ''
              }
            </a>
          </li>
        `).join('')}
      </ul>
    `

    return this
  }
}

export const hdmi = new HdmiWidget()
