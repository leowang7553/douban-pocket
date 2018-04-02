import React, { Component } from 'react'

import './index.css'

// 不同tab下对应的placeholder
const placeholderArr = [
  '书名、作者、ISBN',
  '电影、影人、影院、电视剧',
  '唱片名、表演者、条码、ISRC'
]

class Search extends Component {
  // 点击搜索按钮触发
  onClickHandle () {
    this.props.onClick && this.props.onClick(this.input.value)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // 切换tab时，清空搜索框
    if (this.props.tabIndex !== nextProps.tabIndex) {
      this.input.value = ''
    }
    return true
  }

  render () {
    return (
      <div className='search-container'>
        <div className='search-input'>
          <i className='iconfont icon-search' />
          <input placeholder={placeholderArr[this.props.tabIndex]}
            ref={input => this.input = input} />
        </div>
        <button type='button' onClick={this.onClickHandle.bind(this)}>搜索</button>
      </div>
    )
  }
}

export default Search
