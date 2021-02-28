import { MountdComponent } from './base'
import { WidgetButton } from './Button'
import { audioControl, applications, hdmi, powerWidget, textFormWidget } from './widgets/index'

const powerBtn = new WidgetButton({
  widget: powerWidget,
  iconName: 'glyphicon-off',
  btnName: '电源设置',
  featureName: '电源设置'
})
const audioBtn = new WidgetButton({
  widget: audioControl,
  iconName: 'glyphicon-volume-up',
  btnName: '音量设置',
  featureName: '音量设置'
})
const appListBtn = new WidgetButton({
  widget: applications,
  iconName: 'glyphicon-text-background',
  btnName: '应用列表',
  featureName: '应用列表'
})
const hdmiBtn = new WidgetButton({
  widget: hdmi,
  iconName: 'glyphicon-hd-video',
  btnName: 'HDMI',
  featureName: 'HDMI列表'
})
const textFormBtn = new WidgetButton({
  widget: textFormWidget,
  iconName: 'glyphicon-pencil',
  btnName: '文本输入',
  featureName: '文本输入'
})

class MainContent extends MountdComponent {
  /**
   * 
   * @param {string} idSelector 
   */
  constructor (idSelector) {
    super(idSelector)
    this._widgetBtns = [
      powerBtn,
      appListBtn,
      audioBtn,
      hdmiBtn,
      textFormBtn
    ]
  }

  render () {
    this.el.innerHTML = '<div class="row"></div>'

    const row = this.el.querySelector('.row')

    this._widgetBtns.forEach(widgetBtn => {
      const div = document.createElement('div')

      div.classList.add('main-content-btn', 'col-lg-3', 'col-md-3', 'col-xs-4')
      div.appendChild(widgetBtn.el)
      row.appendChild(div)
    })
  }
}

export const mainContent = new MainContent('#main')
