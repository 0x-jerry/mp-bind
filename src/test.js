/* eslint-disable */
import { def } from './core/utils'

function watch() {
  return (target, key, desc) => {
    def(target[key], 'watch', true)
    console.log(target)
  }
}

class A {
  @watch()
  method() {
    console.log('1')
  }
}

function asyncTest(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('async', 111)
      resolve()
    }, 1000)
  })
}

async function name(params) {
  const a = await asyncTest()
  console.log('async', 112)
}

name()
