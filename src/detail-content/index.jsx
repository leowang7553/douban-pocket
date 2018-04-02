import React, { Component } from 'react'

import './index.css'

import DetailBook from './detail-book'
import DetailFilm from './detail-film'
import DetailMusic from './detail-music'

import { util } from '../util/util.js'

class DetailContent extends Component {

  shouldComponentUpdate (nextProps, nextState) {
    console.log('detail content shouldUpdate')
    if (Object.keys(nextProps.detData).length === 0 ||
      this.props.detData.jsonid === nextProps.detData.jsonid) {
      return false
    }
    return true
  }

  render () {

    // 显示loading
    if (this.props.loadState) {
      return (
        <div className='detailContent-container'></div>
      )
    }
    // 图书详情页面
    if (this.props.tabIndex === 0) {
      return (
        <div className='detailContent-container'>
          <DetailBook detail={util.makeDetailData(this.props.detData)} />
        </div>
      )
    }
    // 电影详情页面
    if (this.props.tabIndex === 1) {
      return (
        <div className='detailContent-container'>
          <DetailFilm detail={util.makeDetailData(this.props.detData)} />
        </div>
      )
    }
    // 音乐详情页面
    if (this.props.tabIndex === 2) {
      return (
        <div className='detailContent-container'>
          <DetailMusic detail={util.makeDetailData(this.props.detData)} />
        </div>
      )
    }
  }
}

export default DetailContent
