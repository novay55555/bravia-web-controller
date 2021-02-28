import $ from 'jquery'
import { MountdComponent } from './base'
import { modalApiSettings } from './ModalPreSettings'

class NavHeader extends MountdComponent {
  /**
   * 
   * @param {string} idSelector 
   */
  constructor (idSelector) {
    super(idSelector)
    this._bindEvent()
  }

  _bindEvent () {
    const $el = $(this.el)

    $el.on('click', '.btn_settings', () => {
      modalApiSettings.edit()
    })
  }

  render () {
    this.el.innerHTML = /* html */ `
      <nav class="navbar navbar-inverse navbar-static-top">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#headerNavbarCollapse" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="javascript:void(0);">Bravia TV</a>
          </div>
          <div class="collapse navbar-collapse" id="headerNavbarCollapse">
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a class="btn_settings" href="javascript:void(0);">设置<span class="sr-only">(current)</span></a>
            </li>
          </ul>
        </div>
      </nav>
    `
  }
}

export const navHeader = new NavHeader('#header')
