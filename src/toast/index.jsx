import React, { Component } from 'react'

import './index.css'

const toastContentArr = ['请求错误，请刷新']
let toastTimer;

class Toast extends Component {
  constructor () {
    super()
    this.state = {
      isShow: false
    }
  }

  // toast的计时器
  timer (second) {
    toastTimer = setTimeout(() => {
      this.setState({
        isShow: false
      })
    }, second * 1000)
  }

  componentWillUnmount() {
    clearTimeout(toastTimer);
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.reqState !== nextProps.reqState) {
      if (nextProps.reqState === 0) {
        this.setState({
          isShow: true
        })
      }
    }
    if (this.state.isShow !== nextState.isShow) {
      if (nextState.isShow) {
        this.timer(3)
      }
      return true
    }
    return false
  }

  render () {
    console.log('toast render: ' + this.state.isShow)

    if (!this.state.isShow) {
      return false
    }

    return (
      <div className='toast-container'>
        {toastContentArr[0]}
      </div>
    )
  }
}

export default Toast
