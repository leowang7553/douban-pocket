import React, { Component } from 'react'

import './index.css'

// 导航栏tab按钮的配置
let tabs = [{
  tabName: '图书',
  tabIndex: 0,
  tabActive: ' nav-tab_active',
  iconClassName: 'iconfont icon-book'
}, {
  tabName: '电影',
  tabIndex: 1,
  tabActive: '',
  iconClassName: 'iconfont icon-film'
}, {
  tabName: '音乐',
  tabIndex: 2,
  tabActive: '',
  iconClassName: 'iconfont icon-music'
}]

class Navigation extends Component {
  // 点击tab时触发
  handleClick (value, event) {
    this.props.onChange && this.props.onChange(value)
    tabs.map((item) => { item.tabActive = '' })
    tabs[value].tabActive = ' nav-tab_active'
  }

  render () {
    return (
      <div className='nav-container'>
        {tabs.map((item, index) => {
          return (
            <div key={index} className={'nav-tab' + item.tabActive}
              onClick={this.handleClick.bind(this, item.tabIndex)} >
              <i className={item.iconClassName} />
              <span className='nav-tab-text'>{item.tabName}</span>
            </div>
          )
        })}

      </div>
    )
  }
}

export default Navigation
