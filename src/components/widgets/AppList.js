import $ from 'jquery'
import { $pubsub } from '../../utils/pubsub'
import { BRAVIA_API_EVENT, MODAL_FEATURE_EVENT } from '../../config/events'
import { makeAlert } from '../../utils/ui'
import { Widget } from './base'

export class AppListWidget extends Widget {
  constructor () {
    super('div')
    this.el.classList.add('app-list-widget')
    this._apps = []
    this._isLoading = false
  }

  _init () {
    this._bindEvent()
    this._renderLoading()
  }

  _bindEvent () {
    const self = this
    const $el = $(this.el)
    const initAppList = (options = {}) => {
      if (this._isLoading) return

      this._isLoading = true
      this._api.getApplicationList()
        .then(result => {
          const apps = result.reduce((acc, curr) => acc.concat(curr), [])

          this._apps = apps
          this.render()
        })
        .catch(err => {
          if (options.silent) {
            console.error(err)
          } else {
            makeAlert({ type: 'danger', message: err.message })
          }
        })
        .finally(() => {
          this._isLoading = false
        })
    }

    $pubsub.subscribe(BRAVIA_API_EVENT.INIT, () => {
      initAppList({ silent: true })
    })
    $pubsub.subscribe(MODAL_FEATURE_EVENT.SHOW, (widget) => {
      if (widget !== this.el) return
      if (this._apps.length !== 0) return

      initAppList()
    })

    $el.on('click', '.btn_app', function () {
      const uri = $(this).data('uri')

      self._api.setActiveApp(uri)
        .then(() => {
          makeAlert({ type: 'success', message: '操作成功' })
        }).catch(err => {
          makeAlert({ type: 'danger', message: err.message })
        })
    })
  }

  _renderLoading () {
    this.el.innerHTML = /* html */ `
      <div class="progress">
        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        </div>
      </div>
    `

    return this
  }

  render () {
    this.el.innerHTML = /* html */ `
      <ul class="row">
        ${this._apps.map(app => `
          <li class="col-lg-3 col-md-3 col-xs-4">
            <a class="btn_app" href="javascript:void(0);" data-uri="${app.uri}">
              <img src="${app.icon}" alt="${app.title}" class="img-circle">
              <p>${app.title}</p>
            </a>
          </li>
        `).join('')}
      </ul>
    `

    return this
  }
}

export const applications = new AppListWidget()
