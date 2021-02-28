import $ from 'jquery'
import { isIP } from '../utils/validate'
import { getLocalStorage, setLocalStorage, LOCAL_STORAGE_KEY } from '../utils/storage'
import { $pubsub } from '../utils/pubsub'
import { BRAVIA_API_EVENT, MODAL_PRE_SETTINGS_EVENT } from '../config/events'
import { BraviaRestApi, BraviaMockApi } from '../utils/bravia-rest-api'
import { Modal } from './Modal'

export class ModalApiSettings extends Modal {
  /**
   * 
   * @param {string} idSelector 
   */
  constructor (idSelector) {
    super(idSelector)
    this._bindEvent()
    
    setTimeout(() => {
      this.publishBraviaApi(BRAVIA_API_EVENT.INIT)
    }, 5)
  }

  _bindEvent () {
    const $el = $(this.el)

    $el.on('click', '.btn_save', () => {
      const $inputIP = $el.find('.input_ip')
      const $inputPSK = $el.find('.input_psk')
      const $inputIPForm = $inputIP.parent()
      const $inputIPMsg = $inputIP.siblings('.help_block')

      $inputIPForm.removeClass('has-error')
      $inputIPMsg.text('')

      if (!isIP($inputIP.val())) {
        $inputIPForm.addClass('has-error')
        $inputIPMsg.text('请输入合法的ip地址')
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

  publishBraviaApi (event) {
    const settings = getLocalStorage(LOCAL_STORAGE_KEY.API_SETTINGS)

    if (!settings || !settings.host) return

    let ApiClass = BraviaRestApi

    // for dev test
    if (process.env.NODE_ENV !== 'production') {
      ApiClass = BraviaMockApi
    }

    $pubsub.publish(event, new ApiClass({
      hostIP: settings.host,
      PSK: settings.psk
    }))
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
                <label class="col-sm-2 control-label">IP</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control input_ip" placeholder="Bravia的ip地址">
                  <span class="help-block help_block"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">PSK</label>
                <div class="col-sm-10">
                  <input type="password" class="form-control input_psk" placeholder="Bravia的预设置的密钥">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary btn_save">Save changes</button>
          </div>
        </div>
      </div>
    `

    return this
  }
}

export const modalApiSettings = new ModalApiSettings('#modalApiSettings')
