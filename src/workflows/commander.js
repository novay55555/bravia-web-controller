import { isPromise } from '../utils/validate'

export class Commander {
  constructor () {
    this._commands = []
  }

  add (name, fn) {
    const index = this._commands.findIndex(cmd => cmd.cmdName === name)

    fn.cmdName = name

    if (index === -1) {
      this._commands.push(fn)
    } else {
      this._commands[index] = fn
    }
  } 

  run (name) {
    return new Promise((resolve, reject) => {
      const handler = this._commands.find(item => item.cmdName === name)

      if (!handler) {
        reject(new Error('命令不存在'))
        return
      }

      const result = handler()

      if (isPromise(result)) {
        result.then(resolve).catch(reject)
      } else {
        resolve()
      }
    })
  }
}
