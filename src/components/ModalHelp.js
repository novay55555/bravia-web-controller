import { Modal } from './Modal'

class ModalHelp extends Modal {
  /**
   * 
   * @param {string} idSelecor 
   */
  constructor (idSelecor) {
    super(idSelecor)
  }

  render () {
    this.el.innerHTML = /* html */ `
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">帮助</h4>
          </div>
          <div class="modal-body">
            <div class="pre-ready">
              <h5>使用前需准备:</h5>
              <p>1. 索尼电视和打开网页的设备连接同个wifi</p>
              <p>2. 在<strong>设置 -> 网络 -> 高级设置 -> 网络状态 -> IP地址</strong>, 找到并记住索尼电视的ip地址.</p>
              <p>3. <strong>在设置 -> 网络 -> 家庭网络设置 -> IP控制</strong>, 选择预共享密钥或预共享密钥, 然后输入你的预共享密钥. 请务必记住你设置的密钥, 在网页中需要填写</p>
              <p>4. <strong>在设置 -> 网络 -> 家庭网络设置 -> Renderer</strong>, 开启Renderer功能</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          </div>
        </div>
      </div>
    `

    return this
  }
}

export const modalHelp = new ModalHelp('#modalHelp')
