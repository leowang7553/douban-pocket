// 工具函数

// 常量定义
const dataType = ['books', 'subjects', 'musics']

/**
 * 生成访问服务器的url
 * @param  {number} index - current tab index
 * @param  {string} keyWords - keywords of searching
 * @param  {string} id - id of content item
 * @return {string} url - server url
 */
function makeServerUrl (index, keyWords, id, jsonStart, jsonCount) {
  const serverIp = 'https://api.douban.com/v2'
  let kw = keyWords
  let start = jsonStart ? 'start=' + jsonStart : 'start=0'
  let count = jsonCount ? 'count=' + jsonCount : 'count=10'
  let url = ''

  switch (index) {
    case 0:
      if (id) {
        url = serverIp + '/book/' + id
        break
      }
      let fields = '&fields=title,rating,author,pubdate,tags,image,id'
      kw = kw || '认知'
      url = serverIp + '/book/search?q=' + kw + '&' + start + '&' + count + fields
      break
    case 1:
      if (id) {
        url = serverIp + '/movie/subject/' + id
        break
      }
      kw = kw ? 'search?q=' + kw + '&' : 'top250?'
      url = serverIp + '/movie/' + kw + start + '&' + count
      break
    case 2:
      if (id) {
        url = serverIp + '/music/' + id
        break
      }
      kw = kw ? 'q=' + kw : 'tag=avril'
      url = serverIp + '/music/search?' + kw + '&' + start + '&' + count
      break
  }
  console.log(url)
  return url
}

/**
 * tags or genres 处理函数，当标签过多时，进行截断，限制总字符长度为12
 * @param  {array} arr - original array
 * @return {array} toArr - handled array
 */
function sliceArr (arr, objAttr) {
  let toArr = []
  if (arr.length >= 3) {
    if (typeof arr[0] === 'object') {
      toArr = [arr[0][objAttr], arr[1][objAttr], arr[2][objAttr]]
    } else {
      toArr = [arr[0], arr[1], arr[2]]
    }
  } else if (arr.length > 0) {
    if (typeof arr[0] === 'object') {
      arr.map((item) => { toArr.push(item[objAttr]) })
    } else {
      arr.map((item) => { toArr.push(item) })
    }
  } else {
    toArr = ['']
  }
  while (toArr && toArr.join().length > 12) {
    toArr.splice(-1, 1)
  }
  return toArr
}

/**
 * tab页面的json数据处理函数
 * @param  {object} json - json object
 * @return {array}  dataArr - target data
 */
function makeTabDataArr (json) {
  let tab = json.tabIndex
  let key = dataType[tab]
  let dataArr = []
  json[key].map((item) => {
    let obj = {}
    obj.title = item.title
    obj.rating = item.rating.average
    obj.id = item.id
    switch (tab) {
      case 0:
        obj.tags = sliceArr(item.tags, 'name')
        obj.author = item.author || []
        obj.pubdate = item.pubdate || ''
        obj.image = item.image || ''
        break
      case 1:
        obj.genres = sliceArr(item.genres, 'name')
        obj.casts = item.casts || []
        obj.image = item.images.small || ''
        break
      case 2:
        obj.author = item.author || []
        obj.image = getImage(item.image)
        break
    }
    dataArr.push(obj)
  })
  return dataArr
}

/**
 * 各个条目详细信息的json数据处理函数
 * @param  {object} json - item detail json data object
 * @return {object} obj - data obj for show detail information
 */
function makeDetailData (json) {
  let tab = json.tabIndex
  let obj = {}
  switch (tab) {
    case 0:
      obj.title = json.title
      obj.author = json.author || []
      obj.publisher = json.publisher || ''
      obj.pubdate = json.pubdate || ''
      obj.rating = json.rating
      obj.price = json.price || ''
      obj.image = json.image || ''
      obj.tags = json.tags || []
      obj.catalog = json.catalog || ''
      obj.summary = json.summary || ''
      break
    case 1:
      obj.title = json.title
      obj.year = json.year || ''
      obj.directors = json.directors || []
      obj.rating = json.rating
      obj.original_title = json.original_title || ''
      obj.image = json.images.large || ''
      obj.genres = json.genres || []
      obj.casts = json.casts || []
      obj.summary = json.summary || ''
      break
    case 2:
      obj.title = json.title
      obj.author = json.author || []
      obj.publisher = json.attrs.publisher || ''
      obj.pubdate = json.attrs.pubdate || ''
      obj.rating = json.rating
      obj.image = json.image || ''
      obj.tags = json.tags || []
      obj.summary = json.summary || ''
      obj.tracks = json.attrs.tracks || ['']
      break
  }
  return obj
}

/**
 * 图片url处理函数
 * @param  {string} url - image url
 * @return {string} url - new image url
 */
function getImage (url) {
  // 把现在的图片连接传进来，返回一个不受限制的路径
  if (url !== undefined) {
    return url.replace(/http\w{0,1}:\/\//g, 'https://images.weserv.nl/?url=')
  } else {
    return ''
  }
}

/**
 * 拉到底部加载更多
 * @param  {object} option - config options (container, lock state and function)
 */
function slideBottom (reactComponent, option) {
 	if (!option.container) { console.log('no container dom') }

 	const obj = document.querySelector(option.container)
  const bottomLoading = obj.lastElementChild
  const offset = bottomLoading.clientHeight

  // 监听滚动状态
  obj.addEventListener('scroll', function (e) {
    	let scrollHeight = obj.scrollHeight
    	let clientHeight = obj.clientHeight
    	let scrollTop = obj.scrollTop
    	// 判断是否滚动到底部
    	if (scrollTop > scrollHeight - clientHeight - offset && !option.lockState) {
    		if (typeof option.next === 'function') {
        option.next(reactComponent)
        // 加载中，锁定状态
        option.lockState = true
      }
    	}
  })
  console.log('slide bottom loading start')
}

/**
 * 下拉刷新
 * @param  {object} option - config object
 *
 */
var slideTop = function (reactComponent, option) {
  var defaults = {
    container: '',
    next: function () {}
  }
  var start,
    end,
    length,
    isPageCando = 0, // 定义屏幕是否在滑动
    isCanDo = false, // 是否移动滑块
    hasTouch = 'ontouchstart' in window
  var obj = document.querySelector(option.container)
  var topLoading = obj.firstElementChild
  var offset = topLoading.clientHeight
  var objparent = obj.parentElement
  var fn = {
    // 移动容器
    translate: function (diff) {
      obj.style.webkitTransform = 'translate3d(0,' + diff + 'px,0)'
      obj.style.transform = 'translate3d(0,' + diff + 'px,0)'
    },
    // 设置效果时间
    setTransition: function (time) {
      obj.style.webkitTransition = 'all ' + time + 's'
      obj.style.transition = 'all ' + time + 's'
    },
    // 返回到初始位置
    back: function () {
      fn.translate(0 - offset)
      // 标识操作完成
      option.lockState = false
    },
    addEvent: function (element, event_name, event_fn) {
      if (element.addEventListener) {
        element.addEventListener(event_name, event_fn, false)
      } else if (element.attachEvent) {
        element.attachEvent('on' + event_name, event_fn)
      } else {
        element['on' + event_name] = event_fn
      }
    }
  }

  fn.translate(0 - offset)
  fn.addEvent(obj, 'touchmove', move) // 当手指在屏幕上滑动的时候连续地触发。在这个事件发生期间，调用preventDefault()事件可以阻止滚动。
  fn.addEvent(obj, 'touchstart', start) // 当手指触摸屏幕时候触发，即使已经有一个手指放在屏幕上也会触发
  fn.addEvent(obj, 'touchend', end) // 当手指从屏幕上离开的时候触发

  // 滑动开始
  function start (e) {
    // 当前滚动条距离顶部的距离：$(".pull_down").scrollTop()
    if (obj.scrollTop <= 0 && !option.lockState) {
      // 标识操作进行中
      option.lockState = true
      isCanDo = true
      var even = typeof event === 'undefined' ? e : event
      // 保存当前鼠标Y坐标
      start = hasTouch ? even.touches[0].pageY : even.pageY
      // 消除滑块动画时间
      fn.setTransition(0)
      topLoading.innerHTML = '<img class="arrow" src="../src/resource/images/arrow-down.svg" />下拉刷新数据'
    }
    return false
  }

  // 滑动中
  function move (e) {
    if (objparent.scrollTop <= 0 && isCanDo) {
      isPageCando++
      var even = typeof event === 'undefined' ? e : event

      if (option.lockState) {
        end = hasTouch ? even.touches[0].pageY : even.pageY
      }

      if (start < end) { // 结束指针位置 大于 开始指针位置
        even.stopPropagation()
        // 消除滑块动画时间
        //              fn.setTransition(0);
        // 移动滑块
        if ((end - start - offset) <= 30) {
          length = (end - start - offset) / 2
          fn.translate(length)
          topLoading.childNodes[1].data = '下拉刷新数据'
          topLoading.childNodes[0].classList.remove('arrow_up')
        } else {
          length += 0.3
          fn.translate(length)
          topLoading.childNodes[1].data = '释放刷新数据'
          topLoading.childNodes[0].classList.add('arrow_up')
        }
      }
    }
  }
  // 滑动结束
  function end (e) {
    if (isCanDo) {
      if (isPageCando > 0) {
        // 判断滑动距离大小
        if (end - start >= offset + 20) {
          // 设置滑块回弹时间
          fn.setTransition(1)
          // 保留提示部分
          fn.translate(1)
          topLoading.innerHTML = '正在刷新数据...'
          if (typeof option.next === 'function') {
            // option.next.call(fn, e);
            option.next(reactComponent)
          }
        } else {
          // 返回初始状态
          fn.setTransition(1)
          fn.back()
        }
      } else {
        fn.back()
      }

      isPageCando = 0
      isCanDo = false
    }
  }
  console.log('pull top loading start')
}

export let util = {
  dataType: dataType,
  getImage: getImage,
  slideBottom: slideBottom,
  slideTop: slideTop,
  makeServerUrl: makeServerUrl,
  makeTabDataArr: makeTabDataArr,
  makeDetailData: makeDetailData
}
