export class MountdComponent {
  /**
   * 
   * @param {string} idSelector 
   */
  constructor (idSelector) {
    this.el = document.querySelector(idSelector)
  }

  render () {
    return this
  }
}

export class UnMountComponent {
  /**
   * 
   * @param {string} tagName 
   */
  constructor (tagName) {
    this.el = document.createElement(tagName)
  }

  render () {
    return this
  }

  /**
   * 
   * @param {HTMLElement} parent 
   */
  mount (parent) {
    parent.appendChild(this.el)

    return this
  }
}
