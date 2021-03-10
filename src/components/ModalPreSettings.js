import $ from 'jquery'
import { isIP } from '../utils/validate'
import { getLocalStorage, setLocalStorage, LOCAL_STORAGE_KEY } from '../utils/storage'
import { $pubsub } from '../utils/pubsub'
import { BRAVIA_API_EVENT, MODAL_PRE_SETTINGS_EVENT } from '../config/events'
import { BraviaRestApi, BraviaMockRestApi, BraviaIrccApi, BraviaMockIrccApi } from '../utils/bravia-rest-api'
import { Modal } from './Modal'

export class ModalApiSettings extends Modal {
  /**
   * 
   * @param {string} idSelector 
   */
  constructor (idSelector) {
    super(idSelector)
    this.el.classList.add('modal-api-settings')
    this._bindEvent()
    
    // in order to make sure widgets are initialized to receive bravia api
    setTimeout(() => {
      this.publishBraviaApi(BRAVIA_API_EVENT.INIT)
    }, 5)

    const _render = this.render.bind(this)

    this.render = () => {
      _render()
      this._initPskTooltip()
    }
  }

  _bindEvent () {
    const $el = $(this.el)

    $el.on('click', '.btn_save', () => {
      const $inputIP = $el.find('.input_ip')
      const $inputIPForm = $inputIP.parent()
      const $inputIPMsg = $inputIP.siblings('.help_ip_block')
      const $inputPSK = $el.find('.input_psk')
      const $inputPSKFrom = $inputPSK.parent()
      const $inputPSKMsg = $inputPSK.siblings('.help_psk_block')

      $inputIPForm.removeClass('has-error')
      $inputIPMsg.text('')
      $inputPSKFrom.removeClass('has-error')
      $inputPSKMsg.text('')

      if (!isIP($inputIP.val())) {
        $inputIPForm.addClass('has-error')
        $inputIPMsg.text('请输入合法的ip地址')
        return
      }

      if (!$inputPSK.val().trim()) {
        $inputPSKFrom.addClass('has-error')
        $inputPSKMsg.text('请输入PSK')
        return
      }

      setLocalStorage(LOCAL_STORAGE_KEY.API_SETTINGS, {
        host: $inputIP.val(),
        psk: $inputPSK.val()
      })

      this.publishBraviaApi(BRAVIA_API_EVENT.UPDATE)
      this.close()
    })

    $pubsub.subscribe(MODAL_PRE_SETTINGS_EVENT.CONFIG_REQUIRE, reason => {
      const $modalTitle = $el.find('.modal_title')

      $modalTitle.text(reason)
      this.open()
    })

    this._getModal().on('hide.bs.modal', () => {
      $el.find('.modal_title').text('预设置')
    })
  }

  _initPskTooltip () {
    $(this.el).find('.btn_tooltip_psk').popover({
      title: '预共享密钥',
      html: true,
      content: '可以在<strong>设置 -> 网络 -> 家庭网络设置 -> IP控制</strong>里找到',
      placement: 'right',
      trigger: 'click'
    })
  }

  publishBraviaApi (event) {
    const settings = getLocalStorage(LOCAL_STORAGE_KEY.API_SETTINGS)

    if (!settings || !settings.host) return

    let RestApiClass = BraviaRestApi
    let IrccApiCalss = BraviaIrccApi

    // for dev test
    if (process.env.NODE_ENV !== 'production') {
      RestApiClass = BraviaMockRestApi
      IrccApiCalss = BraviaMockIrccApi
    }

    $pubsub.publish(
      event, 
      new RestApiClass({
        hostIP: settings.host,
        PSK: settings.psk
      }),
      new IrccApiCalss({
        hostIP: settings.host,
        PSK: settings.psk
      })
    )
  }

  edit () {
    const settings = getLocalStorage(LOCAL_STORAGE_KEY.API_SETTINGS)

    if (settings) {
      const $el = $(this.el)
      const $inputIP = $el.find('.input_ip')
      const $inputPSK = $el.find('.input_psk')
      
      $inputIP.val(settings.host || '')
      $inputPSK.val(settings.psk || '')
    }

    this.open()
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title modal_title">预设置</h4>
          </div>
          <div class="modal-body">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">索尼电视IP</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control input_ip" placeholder="Bravia的ip地址">
                  <span class="help-block help_ip_block"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label psk-control-label">
                  PSK
                  <strong class="glyphicon glyphicon-question-sign btn-tooltip-psk btn_tooltip_psk"></strong>
                </label>
                <div class="col-sm-10">
                  <input type="text" class="form-control input_psk" placeholder="Bravia的预设置的密钥">
                  <span class="help-block help_psk_block"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            <button type="button" class="btn btn-primary btn_save">保存</button>
          </div>
        </div>
      </div>
    `

    return this
  }
}

export const modalApiSettings = new ModalApiSettings('#modalApiSettings')
