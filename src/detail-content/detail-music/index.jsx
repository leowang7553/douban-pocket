import React, { Component } from 'react'

import './index.css'

import { util } from '../../util/util.js'

class DetailMusic extends Component {
  render () {
    console.log('render music detail')
    return (
      <div>
        <header className='detailContent-music-basic'>
          <div className='detailContent-music-img'><img src={util.getImage(this.props.detail.image)} alt={this.props.detail.title} /></div>
          <ul className='detailContent-music-list'>
            <li>名称：{this.props.detail.title}</li>
            <li>作者：
            {this.props.detail.author.map((item, index) => {
              if (index > 0) {
                return <span key={index}>, {item.name}</span>
              }
              return <span key={index}>{item.name}</span>
            })}
            </li>
            <li>发布商：{this.props.detail.publisher}</li>
            <li>发布时间：{this.props.detail.pubdate}</li>
            <li>评分：{this.props.detail.rating.average}</li>
            <li>
              {this.props.detail.tags.map((item, index) => {
                return <span key={index} className='detailContent-music-list-tag'>{item.name}</span>
              })}
            </li>
          </ul>
        </header>
        <article>
          <h3 className='margin-top-10 margin-bottom-5'>简介</h3>
          <section className='text-indend-2'>{this.props.detail.summary}</section>
          <h3 className='margin-top-10 margin-bottom-5'>内容</h3>
          <section className='text-indend-2'>{this.props.detail.tracks.map((track) => {
            return (track.split(/[\n\r]/g).map((item, index) => {
              return <p key={index}>{item}</p>
            })
            )
          })}</section>
        </article>
      </div>
    )
  }
}

export default DetailMusic
