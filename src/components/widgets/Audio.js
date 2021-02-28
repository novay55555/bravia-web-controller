import { makeAlert } from '../../utils/ui'
import { Widget } from './base'

export class AudioWidget extends Widget {
  constructor () {
    super('div')
    this.el.classList.add('audio-widget')
  }

  _init () {
    this.render()
    this._bindEvent()
  }

  _bindEvent () {
    const $el = $(this.el)
    let audioTarget = 'speaker'

    $el.on('click', '.btn_minus', () => {
      this._api.setAudioVolume([{
        'volume': '-1',
        'ui': 'on',
        'target': audioTarget
      }])
    })

    $el.on('click', '.btn_plus', () => {
      this._api.setAudioVolume([{
        'volume': '+1',
        'ui': 'on',
        'target': audioTarget
      }])
    })

    $el.on('click', '.btn_input_audio', e => {
      const $target = $(e.target)
      const $input = $target.siblings('input')
      const value = $input.val()

      if (!value.trim()) return

      let volume = Number(value)

      volume = Math.max(0, volume)
      volume = Math.min(100, volume)

      this._api.setAudioVolume([{
        volume: volume.toString(),
        ui: 'on',
        target: audioTarget
      }]).then(() => {
        makeAlert({ type: 'success', message: '操作成功' })
      }).catch(err => {
        makeAlert({ type: 'danger', message: err.message })
      })
    })

    $el.on('change', '.select_audio_target', e => {
      audioTarget = e.target.value
    })
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="form-horizontal">
        <div class="form-group">
          <label for="audioTarget" class="col-xs-3 control-label">音量设备</label>
          <div class="col-xs-9">
            <select class="form-control select_audio_target" value="speaker">
              <option value="speaker">扬声器</option>
              <option value="headphone">耳机</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="audioPlusAndMinus" class="col-xs-3 control-label">加减音量</label>
          <div class="col-xs-9">
            <button type="button" class="btn btn-default btn_minus" aria-label="Left Align">
              <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
            </button>
            <button type="button" class="btn btn-default btn_plus" aria-label="Left Align">
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="audioPlusAndMinus" class="col-xs-3 control-label">输入音量</label>
          <div class="col-xs-9">
            <input type="number" class="form-control" />
            <button class="btn btn-primary btn_input_audio">确定</button>
          </div>
        </div>
      </div>
    `

    return this
  }
}

export const audioControl = new AudioWidget()
