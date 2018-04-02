import React, { Component } from 'react'

import './index.css'

import { util } from '../../util/util.js'

class DetailFilm extends Component {
  render () {
    console.log('render film detail')
    return (
      <div>
        <header className='detailContent-film-img'><img src={this.props.detail.image} alt={this.props.detail.title} /></header>
        <article>
          <h3 className='margin-top-10 margin-bottom-5'>简介</h3>
          <section>
            <ul>
              <li>名称：{this.props.detail.title} &nbsp;
                {this.props.detail.genres.map((item, index) => {
                  return <span key={index} className='detailContent-film-genre'>{item}</span>
                })}</li>
              <li>上映时间：{this.props.detail.year}</li>
              <li>导演：
              {this.props.detail.directors.map((item, index) => {
                if (index > 0) {
                  return <span key={index}>, {item.name}</span>
                }
                return <span key={index}>{item.name}</span>
              })}
              </li>
              <li>评分：{this.props.detail.rating.average}</li>
              <li>原名：{this.props.detail.original_title}</li>
            </ul>
          </section>
          <h3 className='margin-top-10 margin-bottom-5'>演员</h3>
          <section className='detailContent-film-casts'>
            {this.props.detail.casts.map((item, index) => {
              let url = ''
              if (item.avatars) {
                url = item.avatars.medium
              }
              return (
                <div className='detailContent-film-cast margin-top-5' key={index}>
                  <img src={util.getImage(url)} alt={item.name} />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </section>
          <h3 className='margin-top-10 margin-bottom-5'>剧情简介</h3>
          <section className='text-indend-2'>{this.props.detail.summary.split(/[\n\r]/g).map((item, index) => {
            return <p key={index}>{item}</p>
          })}</section>
        </article>
      </div>
    )
  }
}

export default DetailFilm
