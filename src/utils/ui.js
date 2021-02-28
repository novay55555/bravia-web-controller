import $ from 'jquery'

export function makeAlert ({ type = 'info', message = 'Hello world!', html, duration = 3000, align = 'top', closeBtn = true } = {}) {
  const $el = $('<div/>', {
    class: `alert-widget alert alert-${type} alert-dismissible fade`
  })

  if (align === 'top') {
    $el.css('top', 0)
  } else if (align === 'bottom') {
    $el.css('bottom', 0)
  } else {
    $el.attr('style', align)
  }

  if (closeBtn) {
    $el.append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>')
  }
  
  $el.append(html ? html : `<p>${message}</p>`)
  $el.alert()
  $el.on('closed.bs.alert', () => {
    $el.remove()
  })
  $el.appendTo('body')

  setTimeout(() => {
    $el.addClass('in')
  }, 0)

  if (typeof duration === 'number' && duration !== 0) {
    setTimeout(() => {
      $el.alert('close')
    }, duration)
  }
}
