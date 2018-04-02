import React, { Component } from 'react'

import './index.css'

class Loading extends Component {
  constructor () {
    super()
    this.state = {
      isShow: true
    }
  }

  changeShowState (bool) {
  	this.setState({
  	  isShow: bool
  	})
  }

  componentWillMount () {
    if (!this.props.loadState) {
      this.changeShowState(false)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('update loading state this' + this.props.loadState)
    console.log('update loading state next' + nextProps.loadState)
  	if (this.props.loadState !== nextProps.loadState) {
      if (nextProps.loadState === 0) {
        this.changeShowState(false)
      } else {
        this.changeShowState(true);
      }
  	}
  	if (this.state.isShow !== nextState.isShow) {
  	  return true	
  	}
  	return false
  }

  render () {
    console.log('loading render: ' + this.state.isShow)
    console.log('loading render: ' + this.props.loadState)

    if (!this.state.isShow) {
      return false
    }

    return (
      <div className="loader-container">
	    <div className="loader-dot"></div>
	    <div className="loader-dot"></div>
	    <div className="loader-dot"></div>
	    <div className="loader-dot"></div>
	    <div className="loader-dot"></div>
	  </div>
    )
  }
}

export default Loading
