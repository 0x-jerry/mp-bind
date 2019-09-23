// eslint-disable-next-line no-unused-vars
import { BaseComponent, UpdateTaskQueue } from './Base'
import { updateData, triggerComputed } from './helper'
import { Observer } from './Observer'
import { JSONClone, def, logger } from './utils'
import { BaseConfigs } from './config'

function injectData (registerObj, tpl) {
  registerObj.properties = tpl.properties

  const data = Object.keys(tpl).reduce((pre, key) => {
    if (key !== 'properties') {
      pre[key] = tpl[key]
    }
    return pre
  }, {})

  registerObj.data = data
}

function injectWatchAndComputed (proxyObj, tpl) {
  let proto = tpl
  const component = proxyObj.target

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        const filterKeys = ['constructor', 'attached', 'created']
        return filterKeys.indexOf(key) === -1
      })
      .forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(proto, key)

        // is computed
        // ! Hack, do not read getter before observer data
        if (desc && desc.get) {
          proxyObj.computed[key] = desc.get
        } else if (typeof tpl[key] === 'function') {
          // is watch
          if (key.startsWith('$$')) {
            proxyObj.watch[key.slice(2)] = tpl[key].bind(component)
          }
        }
      })

    proto = Object.getPrototypeOf(proto)
  }
}

function observerData (proxyObj, tpl) {
  const page = proxyObj.target

  // eslint-disable-next-line no-new
  new Observer(proxyObj.data, (newData, oldData) => {
    updateData(proxyObj, newData, oldData)
  })

  const properties = Object.keys(tpl.properties || '')
  const isProp = (key) => properties.indexOf(key) !== -1

  // Proxy observed data
  Object.keys(page.data).forEach((key) => {
    Object.defineProperty(page, key, {
      get: () => {
        return isProp(key) ? page.data[key] : proxyObj.data[key]
      },
      set: (val) => {
        proxyObj.data[key] = val
      },
      configurable: true,
      enumerable: true
    })
  })
}

function injectAttached (registerObj, tpl) {
  registerObj.lifetimes.attached = function () {
    logger('Component attached', this)

    const proxyObj = {
      target: this,
      data: JSONClone(this.data),
      computed: {},
      watch: {},
      updateQueue: null
    }

    def(this, BaseConfigs.PROXY_KEY, proxyObj)

    injectWatchAndComputed(proxyObj, tpl)

    // @ts-ignore
    const updateQueue = new UpdateTaskQueue(this)
    proxyObj.updateQueue = updateQueue

    observerData(proxyObj, tpl)

    // Trigger computed and calculate computed dependence
    // @ts-ignore
    triggerComputed(this)

    tpl.attached && tpl.attached.call(this)
  }
}

function injectMethods (registerObj, tpl) {
  let proto = tpl
  const lifeCycles = ['created', 'attached', 'ready', 'moved', 'detached']
  const pageLifeCycles = ['onShow', 'onHide', 'resize']

  while (!proto.isPrototypeOf(Object)) {
    Object.getOwnPropertyNames(proto)
      .filter((key) => {
        const filterKeys = ['constructor', 'attached']
        return filterKeys.indexOf(key) === -1
      })
      .forEach((key) => {
        const desc = Object.getOwnPropertyDescriptor(proto, key)

        // ! Hack, do not read getter before observer data
        if (!desc.get && typeof tpl[key] === 'function') {
          // not watch
          if (!key.startsWith('$$')) {
            if (pageLifeCycles.indexOf(key) !== -1) {
              registerObj.pageLifetimes[key] = tpl[key]
            } else if (lifeCycles.indexOf(key) !== -1) {
              registerObj.lifetimes[key] = tpl[key]
            } else {
              registerObj.methods[key] = tpl[key]
            }
          }
        }
      })

    proto = Object.getPrototypeOf(proto)
  }
}

/**
 *
 * @param {InstanceType<BaseComponent>} Base
 */
function bindComponent (Base) {
  const tpl = new Base()

  const registerObj = {
    lifetimes: {},
    pageLifetimes: {},
    methods: {}
  }

  injectData(registerObj, tpl)
  injectMethods(registerObj, tpl)

  injectAttached(registerObj, tpl)

  logger('Register component', registerObj)
  // Register Component
  Component(registerObj)
}

export { bindComponent }
