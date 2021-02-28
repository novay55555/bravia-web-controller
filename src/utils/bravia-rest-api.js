export const ERROR_CODE = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
}

export const ERROR_CODE_MESSAGE = {
  [ERROR_CODE.UNAUTHORIZED]: '未授权, 请检查PSK是否输入正确',
  [ERROR_CODE.FORBIDDEN]: '无权限, 请检查PSK是否输入正确',
  [ERROR_CODE.NOT_FOUND]: 'For cases where the request is not matched to any supported API version',
  [ERROR_CODE.REQUEST_ENTITY_TOO_LARGE]: 'The accepted body size of the client request exceeds the maximum limit',
  [ERROR_CODE.REQUEST_URI_TOO_LONG]: 'The accepted URI length of the client request exceeds the maximum limit',
  [ERROR_CODE.NOT_IMPLEMENTED]: 'When the request method is not implemented on the server',
  [ERROR_CODE.SERVICE_UNAVAILABLE]: '无法连接Bravia'
}

export class BraviaRestApi {
  _hostIP = ''

  _PSK = ''

  _reqId = 1

  _timeout = 5000

  constructor ({ hostIP, PSK, timeout }) {
    if (!hostIP) {
      throw new Error('hostIP is required')
    }

    this._hostIP = hostIP || this._hostIP
    this._PSK = PSK || this._PSK
    this._timeout = timeout || this._timeout
  }

  _getApi (service) {
    return `http://${this._hostIP}/sony/${service}`
  }

  _request (service, data = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      let timer = setTimeout(() => {
        xhr.abort()
        reject(new Error('timeout'))
      }, this._timeout)

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          clearTimeout(timer)

          const status = xhr.status

          if (status >= 200 && status < 300) {
            const response = JSON.parse(xhr.responseText)

            if (response.error) {
              reject(new Error(response.error[1] || '未知错误'))
              return
            }

            resolve(response.result)
          } else {
            const errMsg = ERROR_CODE_MESSAGE[status] || '网络错误'

            reject(new Error(errMsg))
          }
        }
      }

      xhr.open('POST', this._getApi(service))

      if (this._PSK) {
        xhr.setRequestHeader('X-Auth-PSK', this._PSK)
      }

      xhr.send(JSON.stringify(data))
      this._reqId++
    })
  }

  /**
   * @returns {Promise<Array<Array<{title: string, uri: string, icon: string}>>>}
   */
  getApplicationList () {
    return this._request('appControl', {
      'method': 'getApplicationList',
      'id': this._reqId,
      'params': [],
      'version': '1.0'
    })
  }

  getApplicationStatusList () {
    return this._request('appControl', {
      'method': 'getApplicationStatusList',
      'id': this._reqId,
      'params': [],
      'version': '1.0'
    })
  }

  getContentCount (params = []) {
    return this._request('avContent', {
      'method': 'getContentCount',
      'id': this._reqId,
      params,
      'version': '1.0'
    })
  }

  getContentCountV1 (params = []) {
    return this._request('avContent', {
      'method': 'getContentCount',
      'id': this._reqId,
      params,
      'version': '1.1'
    })
  }

  /**
   * 
   * @param {Array<{stIdx: number, cnt: number, uri: string}>} params
   * @returns {Promise<Array<Array<{icon: string, connection: boolean, label: string, title: string, uri: string}>>>}
   */
  getContentList (params = []) {
    return this._request('avContent', {
      'method': 'getContentList',
      'id': this._reqId,
      params,
      'version': '1.5'
    })
  }

  getCurrentExternalInputsStatus () {
    return this._request('avContent', {
      'method': 'getCurrentExternalInputsStatus',
      'id': this._reqId,
      'params': [],
      'version': '1.0'
    })
  }

  getCurrentExternalInputsStatusV1 () { }

  getCurrentTime () { }

  getCurrentTimeV1 () { }

  getInterfaceInformation () { }

  getLEDIndicatorStatus () { }

  getNetworkSettings () { }

  getPlayingContentInfo () { }

  getPowerSavingMode () { }

  getPowerStatus () { }

  getPublicKey () { }

  getRemoteControllerInfo () { }

  getRemoteDeviceSettings () { }

  getSchemeList () { }

  getSoundSettings () { }

  getSourceList () { }

  getSpeakerSettings () { }

  getSupportedApiInfo () { }

  getSystemInformation () { }

  getSystemSupportedFunction () { }

  getTextForm () { }

  getVolumeInformation () { }

  getWebAppStatus () { }

  getWolMode () { }

  requestReboot () { }

  /**
   * 
   * @param {string} uri 
   */
  setActiveApp (uri) {
    return this._request('appControl', {
      'method': 'setActiveApp',
      'id': this._reqId,
      'version': '1.0',
      params: [{ uri }]
    })
  }

  setAudioMute () { }

  /**
   * 
   * @param {Array<{volume: string, ui: 'on' | 'off', target: 'speaker' | 'headphone'}>} params 
   */
  setAudioVolume (params = []) {
    return this._request('audio', {
      'method': 'setAudioVolume',
      'id': this._reqId,
      'params': params,
      'version': '1.2'
    })
  }

  setAudioVolumeV1 () { }

  setLEDIndicatorStatus () { }

  setLanguage () { }

  /**
   * 
   * @param {string} uri 
   */
  setPlayContent (uri) {
    return this._request('avContent', {
      'method': 'setPlayContent',
      'id': this._reqId,
      'params': [{ 'uri': uri }],
      'version': '1.0'
    })
  }

  setPowerSavingMode () { }

  /**
   * 
   * @param {boolean} status 
   */
  setPowerStatus (status) {
    return this._request('system', {
      'method': 'setPowerStatus',
      'id': this._reqId,
      'params': [{ status }],
      'version': '1.0'
    })
  }

  setSceneSetting () { }

  setSoundSettings () { }

  setSpeakerSettings () { }

  /**
   * 
   * @param {string} text 
   */
  setTextForm (text) {
    return this._request('appControl', {
      'method': 'setTextForm',
      'id': this._reqId,
      'params': [text],
      'version': '1.0'
    })
  }

  setTextFormV1 () { }

  setWolMode () { }

  terminateApps () { }
}

export class BraviaMockApi extends BraviaRestApi {
  getApplicationList () {
    const appList = [[
      {
        'title': 'YouTube',
        'uri': 'com.sony.dtv.com.google.android.youtube.tv.com.google.android.apps.youtube.tv.activity.ShellActivity',
        'icon': 'https://appiconmaker.co/home/appicon/testid?size=1024'
      },
      {
        'title': 'Screen mirroring',
        'uri': 'com.sony.dtv.screnmirroring.com.screnmirroring.com.StartScreenMirroringHomeActivity',
        'icon': 'https://i0.wp.com/www.appsally.com/wp-content/uploads/2017/09/appicon-3.png?fit=900%2C900&ssl=1'
      }
    ]]

    return Promise.resolve(appList)
  }

  getContentList () {
    return Promise.resolve([[
      {
        'icon': 'meta:game',
        'connection': false,
        'label': 'GAME',
        'title': 'Component1',
        'uri': 'extInput:component?port=1'
      },
      {
        'icon': 'meta:component',
        'connection': true,
        'label': '',
        'title': 'Component2',
        'uri': 'extInput:component?port=2'
      },
      {
        'icon': 'meta:hdmi',
        'connection': true,
        'label': '',
        'title': 'HDMI1',
        'uri': 'extInput:hdmi?port=1'
      },
      {
        'icon': 'meta:recordingdevice',
        'connection': true,
        'label': 'BDPlayer',
        'title': 'Player1',
        'uri': 'extInputs:cec?type=player&port=1'
      }
    ]])
  }

  setActiveApp (uri) {
    alert(`setActiveApp uri: ${uri}`)
    return Promise.resolve([])
  }

  setAudioVolume (params) {
    const { volume, target } = params[0]
    alert(`${target}: ${volume}`)
    return Promise.resolve([])
  }

  setPlayContent (uri) {
    alert(`setPlayContent uri: ${uri}`)
    return Promise.resolve([])
  }

  setPowerStatus (status) {
    alert(`setPowerStatus: ${status}`)
    return Promise.resolve([])
  }

  setTextForm (text) {
    alert(`setTextForm: ${text}`)
    return Promise.resolve([])
  }
}
