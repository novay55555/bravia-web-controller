import { Modal } from './Modal'
import { $pubsub } from '../utils/pubsub'
import { MODAL_FEATURE_EVENT } from '../config/events'

class ModalFeature extends Modal {
  /**
   * 
   * @param {string} idSelector
   */
  constructor (idSelector) {
    super(idSelector)
    this._bindEvent()
  }

  _bindEvent () {
    this._getModal().on('hide.bs.modal', () => {
      // 这里只是为了清除内容, 不要对子节点进行破坏性操作
      this._getModalBody()[0].innerHTML = ''

      this._getModalTitle().text('Modal Feature')
      $pubsub.publish(MODAL_FEATURE_EVENT.BS_HIDE)
    })

    this._getModal().on('shown.bs.modal', () => {
      $pubsub.publish(MODAL_FEATURE_EVENT.BS_SHOWN)
    })

    $pubsub.subscribe(MODAL_FEATURE_EVENT.SHOW, ($el, title) => {
      this._getModalBody().append($el)
      this._setTitle(title)
      this.open()
    })
  }
  
  _getModalTitle () {
    if (!this.$modalTitle) {
      this.$modalTitle = this._getModal().find('.modal_title')
    }

    return this.$modalTitle
  }

  _getModalBody () {
    if (!this.$modalBody) {
      this.$modalBody = this._getModal().find('.modal_body')
    }

    return this.$modalBody
  }

  _setTitle (title) {
    const $modalTitle = this._getModalTitle()

    $modalTitle.text(title)
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title modal_title">Modal Feature</h4>
          </div>
          <div class="modal-body modal_body">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `

    return this
  }
}

export const modalFeature = new ModalFeature('#modalFeature')
