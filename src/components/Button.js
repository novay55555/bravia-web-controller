import $ from 'jquery'
import { $pubsub } from '../utils/pubsub'
import { MODAL_FEATURE_EVENT, MODAL_PRE_SETTINGS_EVENT } from '../config/events'
import { UnMountComponent } from './base'
import { Widget } from './widgets/index' // eslint-disable-line no-unused-vars

export class WidgetButton extends UnMountComponent {
  /**
   * 
   * @param {Object} param0 
   * @param {Widget} param0.widget 
   * @param {string} param0.iconName
   * @param {string} param0.btnName
   * @param {string} param0.featureName
   */
  constructor ({ widget, iconName, btnName, featureName }) {
    super('button')
    this.el.classList.add('btn', 'btn-default', 'widget-button')
    this._iconName = iconName
    this._btnName = btnName
    this._featureName = featureName
    this.widget = widget

    this.render()
    this._bindEvent()
  }

  _bindEvent () {
    $(this.el).on('click', () => {
      if (!this.widget.hasApi()) {
        $pubsub.publish(MODAL_PRE_SETTINGS_EVENT.CONFIG_REQUIRE, '请先进行预设置')
        return
      }

      $pubsub.publish(MODAL_FEATURE_EVENT.SHOW, this.widget.el, this._featureName)
    })
  }

  render () {
    const { _iconName, _btnName } = this

    this.el.innerHTML = `
      <span class="glyphicon ${_iconName}" aria-hidden="true"></span>
      <p>${_btnName}</p>
    `

    return this
  }
}
