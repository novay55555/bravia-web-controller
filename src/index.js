import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './index.scss'
import { getLocalStorage, LOCAL_STORAGE_KEY } from './utils/storage'
import { makeAlert } from './utils/ui'
import { $pubsub } from './utils/pubsub'
import { BRAVIA_API_EVENT } from './config/events'
import { urlCommander } from './workflows/url-command'
import { modalApiSettings } from './components/ModalPreSettings'
import { modalFeature } from './components/ModalFeature'
import { navHeader } from './components/Header'
import { mainContent } from './components/MainContent'
import { modalHelp } from './components/ModalHelp'

function renderDOM () {
  navHeader.render()
  mainContent.render()
  modalApiSettings.render()
  modalFeature.render()
  modalHelp.render()
}

function checkApi () {
  const options = getLocalStorage(LOCAL_STORAGE_KEY.API_SETTINGS)

  return options && options.host
}

function getCommand () {
  const url = new URL(location.href)
  const searchParams = url.searchParams

  return searchParams.get('command')
}

function runCommand (command) {
  return urlCommander.run(command).then(() => {
    makeAlert({ type: 'success', message: '命令执行成功' })
  }).catch(err => {
    makeAlert({ type: 'danger', message: `命令执行失败: ${err.message}` })
  })
}

function main () {
  const apiAvailable = checkApi()
  const command = getCommand()
  const handleBraviaApiChange = function () {
    runCommand(command)
  }

  renderDOM()

  if (!apiAvailable) {
    modalApiSettings.open()

    if (command) {
      $pubsub.subscribe(BRAVIA_API_EVENT.UPDATE, handleBraviaApiChange, true)
    }
    return
  }

  if (command) {
    $pubsub.subscribe(BRAVIA_API_EVENT.INIT, handleBraviaApiChange, true)
  }
}

main()
