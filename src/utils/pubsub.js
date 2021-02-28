import $ from 'jquery'

export const $pubsub = {
  /**
   * @type {JQuery<HTMLElement>}
   */
  $el: null,
  _check () {
    if (this.$el) return

    this.$el = $('<b/>')
  },
  subscribe (topic, fn, once = false) {
    this._check()

    function wrapper () {
      return fn.apply(this, Array.prototype.slice.call(arguments, 1))
    }

    if (once) {
      this.$el.one(topic, wrapper)
    } else {
      this.$el.on(topic, wrapper)
    }
  },
  unsubscribe () {
    this._check()
    this.$el.off.apply(this.$el, arguments)
  },
  publish () {
    this._check()

    const args = [].slice.call(arguments)
    const event = args[0]
    const params = args.slice(1)

    this.$el.trigger.apply(this.$el, [event, params])
  }
}
