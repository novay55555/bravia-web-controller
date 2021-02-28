import { MountdComponent } from './base'

export class Modal extends MountdComponent {
  /**
   * 
   * @param {string} idSelector 
   */
  constructor (idSelector) {
    super(idSelector)
    this.el.classList.add('modal', 'fade')
    this.el.setAttribute('tabindex', '-1')
    this.el.setAttribute('role', 'dialog')
  }

  _getModal () {
    if (!this.$modal) {
      this.$modal = $(this.el)
    }

    return this.$modal
  }

  open () {
    this._getModal().modal('show')
  }

  close () {
    this._getModal().modal('hide')
  }

  render () {
    
  }
}
