import React, { Component } from 'react'

import './index.css'

class ContentItem extends Component {
  // 点击具体条目时触发
  onClickHandle (id, event) {
    console.log('content item click')
    this.props.onClick && this.props.onClick(id)
  }

  render () {
    switch (this.props.tab) {
      case 0:
        return (
          <div className='content-item' onClick={this.onClickHandle.bind(this, this.props.item.id)}>
            <div className='content-item-img'><img src={this.props.item.image} alt={this.props.item.title} /></div>
            <ul className='content-item-list'>
              <li className='text-ellipsis'>名称：{this.props.item.title}</li>
              <li>
                {this.props.item.tags.map((item, index) => {
                  if (item) {
                    return <span key={index} className='content-item-list-bookTag'>{item}</span>
                  } else {
                    return <span key={index}>&nbsp;</span>
                  }
                })}
              </li>
              <li className='text-ellipsis'>作者：
              {this.props.item.author.map((item, index) => {
                if (index > 0) {
                  return <span key={index}>, {item}</span>
                }
                return <span key={index}>{item}</span>
              })}
              </li>
              <li>评分：{this.props.item.rating}</li>
              <li>时间：{this.props.item.pubdate}</li>
            </ul>
          </div>
        )
      case 1:
        return (
          <div className='content-item' onClick={this.onClickHandle.bind(this, this.props.item.id)} >
            <div className='content-item-img'><img src={this.props.item.image} alt={this.props.item.title} /></div>
            <ul className='content-item-list'>
              <li className='content-item-list-filmTitle text-ellipsis'>{this.props.item.title}</li>
              <li>
                {this.props.item.genres.map((item, index) => {
                  if (item) {
                    return <span key={index} className='content-item-list-filmGenre'>{item}</span>
                  } else {
                    return <span key={index}>&nbsp;</span>
                  }
                })}
              </li>
              <li className='text-ellipsis'>
                {this.props.item.casts.map((item, index) => {
                  return <span key={index} className='content-item-list-filmCast text-ellipsis'>{item.name}</span>
                })}
              </li>
              <li>评分：{this.props.item.rating}</li>
            </ul>
          </div>
        )
      case 2:
        return (
          <div className='content-item' onClick={this.onClickHandle.bind(this, this.props.item.id)} >
            <div className='content-item-img'><img src={this.props.item.image} /></div>
            <ul className='content-item-list'>
              <li className='text-ellipsis'>名称：{this.props.item.title}</li>
              <li className='text-ellipsis'>作者：
                {this.props.item.author.map((item, index) => {
                if (index > 0) {
                  return <span key={index}>, {item.name}</span>
                }
                return <span key={index}>{item.name}</span>
              })}
              </li>
              <li>评分：{this.props.item.rating}</li>
            </ul>
          </div>
        )
    }
  }
}

export default ContentItem
