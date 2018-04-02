import React, { Component } from 'react'

import './index.css'

import { util } from '../util/util.js'
import ContentItem from './contentItem'

// 下拉到底部加载更多的配置
let slideBottomConfig = {
  container: '.content-container',
  lockState: false,
  next: function (reactComponent) {
    reactComponent.props.scrollBottom && reactComponent.props.scrollBottom()
  }
}

// 顶部下拉刷新的配置
let slideTopConfig = {
  container: '.content-container',
  lockState: false,
  next: function (reactComponent) {
    reactComponent.props.pullTop && reactComponent.props.pullTop()
  }
}

/**
 * content内容框组建
 */
class Content extends Component {
  constructor () {
    super()
  }

  // 返回顶部
  onScrollTopHandle (event) {
    this.contentNode.scrollTop = 0
  }

  // 点击具体条目
  onClickHandle (id) {
    this.props.onClick && this.props.onClick(id, this.contentNode.scrollTop)
  }

  // 顶部下拉刷新后，隐藏提示
  pullTopBackHandle () {
    let offset = this.contentNode.firstElementChild.clientHeight
    this.contentNode.style.webkitTransform = 'translate3d(0,' + (-offset) + 'px,0)'
    this.contentNode.style.transform = 'translate3d(0,' + (-offset) + 'px,0)'
  }

  componentDidMount () {
    console.log('content componentDidMount: ')
    // 初始化顶部下拉刷新功能和拉到底部加载更多功能
    util.slideBottom(this, slideBottomConfig)
    util.slideTop(this, slideTopConfig)
    // 当由详情页面回退到内容列表页面时，设置contentNode的srolltop的值
    if (this.props.ctnData.backScrollTop) {
      this.contentNode.scrollTop = this.props.ctnData.backScrollTop
    }
  }

  componentWillUpdate () {
    console.log('content componentWillUpdate:' + this.props.ctnData.tabIndex)
    // 隐藏顶部提示框，接触顶部下拉刷新锁定
    this.pullTopBackHandle()
    slideTopConfig.lockState = false
  }
  componentDidUpdate () {
    console.log('content componentDidUpdate:' + this.props.ctnData.tabIndex)
    // 解除拉到底部加载更多的锁定
    if (this.props.ctnData.count < this.props.ctnData.total) {
      slideBottomConfig.lockState = false
    }
    console.log(this.props.ctnData)
    // 当获取的数据为全部条目时，底部显示提示“已无更多”，同时锁定顶部下拉刷新功能和底部加载更多功能
    if (this.props.ctnData.total - this.props.ctnData.start <= 10 ) {
      this.bottomNode.innerHTML = '已无更多'
      slideTopConfig.lockState = true
      slideBottomConfig.lockState = true
    }
    // 当获取数据条目为0条时，显示提示“无相关条目”
    if (this.props.ctnData.total === 0) {
      this.bottomNode.innerHTML = '无相关条目'
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('content shouldComponentUpdate')
    // 无数据传入或相同数据传入时，不重新渲染页面
    if (Object.keys(nextProps.ctnData).length === 0 ||
			this.props.ctnData.jsonid === nextProps.ctnData.jsonid) {
      return false
    }
    // 切换tab后，搜索相关条目时，scroll置顶
    if (this.props.ctnData.tabIndex !== nextProps.ctnData.tabIndex ||
            nextProps.ctnData.count <= 10) {
      this.onScrollTopHandle(this)
    }

    this.bottomNode.innerHTML = '正在加载数据...'
    return true
  }

  render () {
    console.log('content render')
    let dataArr = []
    // 处理传入的数据
    if (this.props.ctnData.count) {
      dataArr = util.makeTabDataArr(this.props.ctnData)
    }

    return (
      <div className='content-container' ref={node => this.contentNode = node}>
        <div id='topLoading'>
					下拉刷新数据
        </div>
        {dataArr.map((item, index) => {
          return <ContentItem tab={this.props.ctnData.tabIndex} item={item} key={index}
            onClick={this.onClickHandle.bind(this)} />
        })}
        <div id='bottomLoading' ref={node => this.bottomNode = node}>正在加载数据...</div>
      </div>
    )
  }
}

export default Content
