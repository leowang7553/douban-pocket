import React, { Component } from 'react'

import './index.css'

const tabs = ['图书', '电影', '音乐']
class DetailHeader extends Component {
  // 点击返回按钮触发
  handleClick () {
    this.props.onClick && this.props.onClick()
  }

  render () {
    if (this.props.loadState) {
      return (
        <div className='detailHeader-container'></div>
      )
    }
    return (
      <div className='detailHeader-container'>
        <span className='detailHeader-title text-ellipsis'>{this.props.detTitle}</span>
        <span className='detailHeader-back' onClick={this.handleClick.bind(this)}>{tabs[this.props.tabIndex]}</span>
      </div>
    )
  }
}

export default DetailHeader
