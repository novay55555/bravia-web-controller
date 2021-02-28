import $ from 'jquery'
import { $pubsub } from '../../utils/pubsub'
import { makeAlert } from '../../utils/ui'
import { MODAL_FEATURE_EVENT } from '../../config/events'
import { Widget } from './base'

export class TextFormWidget extends Widget {
  constructor () {
    super('div')
    this.el.classList.add('text-form-widget')
  }

  _init () {
    this._bindEvent()
    this.render()
  }

  _bindEvent () {
    const $el = $(this.el)

    $el.on('click', 'button', () => {
      const $textarea = $el.find('textarea')
      const value = $textarea.val()

      if (!value.trim()) return

      this._api.setTextForm(value)
        .then(() => {
          makeAlert({ type: 'success', message: '操作成功' })
        })
        .catch(err => {
          makeAlert({ type: 'danger', message: err.message })
        })
    })

    $pubsub.subscribe(MODAL_FEATURE_EVENT.BS_HIDE, () => {
      $el.find('textarea').val('')
    })
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="form">
        <div class="form-group">
          <textarea class="form-control" rows="3" placeholder="输入前请确保电视机已显示输入法"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">确定</button>
      </div>
    `

    return this
  }
}

export const textFormWidget = new TextFormWidget()
