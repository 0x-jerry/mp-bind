import { ComputedValue } from './Computed'
import { def, logger } from './utils'
// eslint-disable-next-line no-unused-vars
import { BasePage } from './index'
import { BaseConfigs } from './config'

const COMPUTED_KEY = BaseConfigs.keys.computed

/**
 *
 * @param {BasePage} base
 */
function triggerComputed (base) {
  const proxyObj = base[BaseConfigs.PROXY_KEY]

  def(proxyObj, COMPUTED_KEY, {})

  logger('Trigger computed', proxyObj)

  // Trigger computed and calculate dependence
  Object.keys(proxyObj.computed).forEach((key) => {
    const currentComputed = new ComputedValue(
      proxyObj,
      key,
      proxyObj.computed[key].bind(base)
    )
    ComputedValue.current = currentComputed
    // update computed and attach to update query
    currentComputed.update()

    proxyObj[COMPUTED_KEY][key] = currentComputed

    // proxy computed
    Object.defineProperty(base, key, {
      get: () => {
        return currentComputed.value
      },
      configurable: true,
      enumerable: true
    })
  })

  ComputedValue.current = null
}

/**
 *
 * @param {*} newData
 * @param {*} oldData
 */
function updateData (proxyObj, newData, oldData) {
  Object.keys(newData).forEach((key) => {
    // Use update task queue to update data in micro task
    proxyObj.updateQueue.addUpdateData(key, newData[key])

    if (typeof proxyObj.watch[key] === 'function') {
      logger('Watch update', key)
      proxyObj.watch[key](newData[key], oldData[key])
    }
  })
}

export { triggerComputed, updateData, attachFunctions }
