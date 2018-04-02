import React, { Component } from 'react'

import './index.css'

class DetailBook extends Component {
  render () {
    console.log('render book detail')
    return (
      <div>
        <header className='detailContent-book-basic'>
          <div className='detailContent-book-img'><img src={this.props.detail.image} alt={this.props.detail.title} /></div>
          <ul className='detailContent-book-list'>
            <li>名称：{this.props.detail.title}</li>
            <li>作者：
            {this.props.detail.author.map((item, index) => {
              if (index > 0) {
                return <span key={index}>, {item}</span>
              }
              return <span key={index}>{item}</span>
            })}
            </li>
            <li>出版社：{this.props.detail.publisher}</li>
            <li>日期：{this.props.detail.pubdate}</li>
            <li>评分：{this.props.detail.rating.average}</li>
            <li>价钱：￥{this.props.detail.price}</li>
            <li>
              {this.props.detail.tags.map((item, index) => {
                return <span key={index} className='detailContent-book-list-tag'>{item.name}</span>
              })}
            </li>
          </ul>
        </header>
        <article>
          <h3 className='margin-top-10 margin-bottom-5'>序言</h3>
          <section className='text-indend-2'>{this.props.detail.catalog.split(/[\n\r]/g).map((item, index) => {
            return <p key={index}>{item}</p>
          })}</section>
          <h3 className='margin-top-10 margin-bottom-5'>简介</h3>
          <section className='text-indend-2'>{this.props.detail.summary.split(/[\n\r]/g).map((item, index) => {
            return <p key={index}>{item}</p>
          })}</section>
        </article>
      </div>
    )
  }
}

export default DetailBook
