import { logger } from './utils'
import { BaseConfigs } from './config'

/**
 * Use micro task to update data
 */
class UpdateTaskQueue {
  /**
   *
   * @param {Page.PageInstance} page
   */
  constructor (page) {
    this.page = page
    this.waitForUpdate = {}
    this.dirty = false
  }

  addUpdateData (key, value) {
    this.waitForUpdate[key] = value

    if (this.dirty) {
      return
    }

    this.dirty = true
    this.updateData()
  }

  updateData () {
    Promise.resolve().then(() => {
      logger('Update data', this.waitForUpdate)
      this.page.setData(this.waitForUpdate)
      this.waitForUpdate = {}
      this.dirty = false
    })
  }
}

class Base {
  constructor (base) {
    if (BaseConfigs.debug && base) {
      global.pages = global.pages || []
      global.pages.push(this)
    }
  }

  /**
   * update data accord to attribute `data-name`
   * support `a.b.c` syntax
   */
  inputHelper (e) {
    const names = e.currentTarget.dataset.name.split('.')

    let data = this
    try {
      for (let i = 0; i < names.length; i++) {
        const name = names[i]
        if (i === names.length - 1) {
          data[name] = e.detail.value
        } else {
          data = data[name]
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  checkboxHelper (e) {
    this.inputHelper(e)
  }
}

class BasePage extends Base {}

class BaseComponent extends Base {
  properties = {}
}

export { BasePage, UpdateTaskQueue, BaseComponent }
