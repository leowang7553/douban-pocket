import React, { Component } from 'react'
import './style.css'

import Search from './search'
import Content from './content'
import Navigation from './navigation'
import DetailHeader from './detail-header'
import DetailContent from './detail-content'
import Toast from './toast'
import Loading from './loading'

import fetchJsonp from 'fetch-jsonp'
import { util } from './util/util.js'

class App extends Component {
  constructor () {
    super()
    this.state = {
      pageState: 0, // 0~列表页面；1~详情页面
      reqState: 1, // 0~请求数据不正常；1~请求数据正常
      loadState: 1, // 0~loading结束；1~正在loading
      currentIndex: 0, // 0~图书；1~电影；2~音乐
      backScrollTop: 0, // 内容页面距离顶部的距离
      dataStart: 0, // 请求json数据的offset
      dataCount: 10, // 请求json数据的条数
      contentData: {}, // 当前的json data
      prevData: {},  //上一次的json data
      detailId: '', //点击具体条目的id
      keyword: '',  //搜索的关键字
      isAddContent: false //是否为增加显示内容条目的状态
    }
  }

  // 服务器响应状态改变（无响应）时触发
  changeReqState () {
    this.setState({
      reqState: 0
    })
  }

  // 改变loading的状态
  changeLoadState (value) {
    this.setState({
      loadState: value
    })
  }

  // 切换导航中tab时触发
  changeTabState (value) {
    this.setState({
      dataStart: 0,
      dataCount: 10,
      detailId: '',
      keyword: '',
      currentIndex: value
    })
  }

  // 显示内容发生改变时触发
  changeContentState (json) {
    // 判断是否为在当前状态下新增显示内容
    if (this.state.isAddContent) {
      let index = this.state.currentIndex
      json[util.dataType[index]] = this.state.contentData[util.dataType[index]].concat(
        json[util.dataType[index]])
      json.count = this.state.contentData.count + json.count
      this.state.isAddContent = !this.state.isAddContent
    }
    this.setState({
      reqState: 1,
      loadState: 0,
      prevData: this.state.contentData,
      contentData: json
    })
  }

  // 搜索关键字改变时触发
  changeKeywordState (keywords) {
    this.setState({
      dataStart: 0,
      dataCount: 10,
      keyword: keywords
    })
  }

  // 由详情页面回退到列表条目页面时触发
  backContentState () {
    this.state.prevData.backScrollTop = this.state.backScrollTop
    this.setState({
      detailId: '',
      loadState: 0,
      contentData: this.state.prevData
    })
  }

  // 拉到底部加载更多时触发
  addContentState () {
    this.setState({
      isAddContent: true,
      dataStart: (this.state.dataStart + 10)
    })
  }

  // 顶部下拉刷新时触发
  refreshContentState () {
    this.setState({
      dataStart: (this.state.dataStart + 10)
    })
  }

  // 点击具体条目显示详情页面时触发，同时记录列表详情页面的滚动条的位置
  changeShowDetailState (id, backScrollTop) {
    this.setState({
      backScrollTop: backScrollTop,
      detailId: id
    })
  }

  // 请求服务器获取数据
  getDataFromServer (tabIndex, keyWords, id, jsonStart, jsonCount) {
    console.log('getting from server')
    this.changeLoadState(1)
    fetchJsonp(util.makeServerUrl(tabIndex, keyWords, id, jsonStart, jsonCount)
    ).then((response) => {
      console.log(response)
      return response.json()
    }).then((json) => {
      json.jsonid = Math.floor(Math.random() * 10000)
      json.tabIndex = this.state.currentIndex
      console.log('json:', json)
      this.changeContentState(json)
    }).catch((ex) => {
      console.log('parsing failed', ex)
      this.changeReqState()
    })
  }

  // 刚打开APP，第一次向服务器请求数据
  componentDidMount () {
    console.log('app did mount')
    this.getDataFromServer(this.state.currentIndex, '', '', '', 10)
  }

  // mount后，结束loading
  // componentDidUpdate () {
  //   console.log('app did update')
  //   this.setState({
  //     loadState: 0
  //   })
  // }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.currentIndex !== nextState.currentIndex) {
      // 切换tab时触发
      this.getDataFromServer(nextState.currentIndex)
    } else if (nextState.detailId && this.state.detailId !== nextState.detailId) {
      // 点击具体条目时触发
      this.getDataFromServer(this.state.currentIndex, '', nextState.detailId)
    } else if (this.state.keyword !== nextState.keyword) {
      // 搜索内容时触发
      this.getDataFromServer(this.state.currentIndex, nextState.keyword)
    } else if (this.state.dataStart < nextState.dataStart) {
      // 下拉刷新或者加载更多时触发
      this.getDataFromServer(this.state.currentIndex, this.state.keyword, '', nextState.dataStart, this.state.dataCount)
    }
    // 当服务器请求正常时，过滤掉数据相同重复渲染的情况
    if (this.state.contentData.jsonid !== nextState.contentData.jsonid ||
      this.state.currentIndex !== nextState.currentIndex) {
      return true
    }
    // 当服务器请求出现异常时
    if (this.state.reqState !== nextState.reqState) {
      return true
    }
    // 当loading发生时
    if (this.state.loadState !== nextState.loadState) {
      return true
    }
    return false
  }

  render () {
    // 渲染具体条目详情页面
    if (this.state.detailId) {
      console.log('App render detail: ' + this.state.currentIndex)
      return (
        <div className='app'>
          <DetailHeader detTitle={this.state.contentData.title}
            tabIndex={this.state.currentIndex}
            loadState={this.state.loadState}
            onClick={this.backContentState.bind(this)} />
          <DetailContent detData={this.state.contentData}
            tabIndex={this.state.currentIndex}
            loadState={this.state.loadState} />
          <Loading loadState={this.state.loadState} />
          <Toast reqState={this.state.reqState} />
        </div>
      )
    }

    // 渲染列表条目页面
    if (!this.state.detailId) {
      console.log('App render content: ' + this.state.currentIndex)
      return (
        <div className='app'>
          <Search tabIndex={this.state.currentIndex}
            onClick={this.changeKeywordState.bind(this)} />
          <Content ctnData={this.state.contentData}
            onClick={this.changeShowDetailState.bind(this)}
            scrollBottom={this.addContentState.bind(this)}
            pullTop={this.refreshContentState.bind(this)} />
          <Navigation onChange={this.changeTabState.bind(this)} />
          <Loading loadState={this.state.loadState} />
          <Toast reqState={this.state.reqState} />
        </div>
      )
    }
  }
}

module.exports = App
