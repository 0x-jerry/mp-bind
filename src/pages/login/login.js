// pages/login/login.js
import { BasePage, bindPage } from '../../core/index'

export class Index extends BasePage {
  arr = []
  prop = 1

  testFreeze = null

  get arrLength () {
    return this.arr.length
  }

  onLoad () {
    this.arr.push(1)

    this.testFreeze = Object.freeze({
      test: 1
    })
  }

  changeProperties () {
    this.prop++
  }

  changeFreezeTest () {
    this.testFreeze.test = 123
  }

  changeFreeze () {
    this.testFreeze = {
      test: 11111
    }
  }
}

bindPage(Index)
