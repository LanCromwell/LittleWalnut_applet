/**
 * 日志输出（用它方便统一控制输出与格式展示）
 * @param {日志标签} tag 
 * @param  {日志内容，数组类型，可以接收多个逗号分隔的日志内容} args 
 */
const log = (tag, ...args) => {
  if(args.length > 0) {
    console.log('(｡ŏ_ŏ) ' + tag, args)
  } else {
    console.log('(｡ŏ_ŏ) ' + tag)
  }
}

/**
 * 字符串空判断
 * @param {string} value 
 */
const isEmpty = (value) =>{
	return !value || value==='null' || value===''
}

/**
 * 手机号验证
 * @param {*} mobile
 */
const isMobile = (mobile) => {
  if (!/^1\d{10}$/.test(mobile)) {
    return false
  }
  return true
}

/**
 * 邮箱验证
 * @param {*} email 
 */
const isEmail = (email) => {
  var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w{2,})*\.\w{2,}([-.]\w{2,})*$/;
  if (regEmail.test(email)) {
      return true;
  } else {
      return false;
  }
}

/**
 * 本地存储-异步保存
 * @param {*} key 
 * @param {*} value 
 */
const putValue = (key, value) => {
  wx.setStorage({
    key: key,
    data: value,
    success: () => {
      log('putValue success ', key , value)
    },
    fail: function(e){
      log('putValue fail ', key , value)
    }
  })
}

/**
 * 本地存储-同步查询
 * @param {*} key 
 */
const getValue = (key) => {
  let value
  try {
    value = wx.getStorageSync(key)
    log('getValue success', value)
  } catch (e) {
    value = null
    log('getValue fail', e)
  }
  return value
}

/**
 * 本地存储-异步删除
 * @param {*} key 
 */
const delValue = (key) => {
  wx.removeStorage({
    key: key,
    success (res) {
      log('delValue success ', key, res)
    },
    fail: (res) => {
      log('delValue fail ', key, res)
    }
  })
}

/**
 * 格式化时间 2020/02/14 18:13:24
 * @param {时间戳-Date.now()} date 
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 保留小数位数
 * @param {number|string} num 
 * @param {小数位} decimal 
 * @param {是否四舍五入} round 
 */
const keepDecimal = (num, decimal, isRound) => {
	try {
        decimal = typeof decimal == 'number' ? decimal : 2
        let result
      	if(isRound == true) { //四舍五入
         	result = parseFloat(num).toFixed(decimal)
      	} else { //不四舍五入
        	let n = num.toString()
          let p = n.indexOf('.')
          if(p > -1 && decimal > 0) {
            let a = n.substring(0, p)
              let b = n.substring(p+1, n.length)
              if(decimal > b.length) {
                for(let i=decimal-b.length; i>0; i--) {
                    b += '0'
                }	
              }else {
                b = b.substring(0, decimal)
              }
              result = a+'.'+b
          } else {
            result = decimal > 0 ? n+'.' : n
            for(let i=decimal; i>0; i--){
              result += '0'
            }
          }
      	}
      return result
    }catch(e) {
    	return num
    }
}
const numSize = n => {
  let s = n.toString()
  let idx = s.indexOf(".")
  if (idx > -1) {
    s = s.substring(0, idx)
  }
  return s.length
}

/**
 * 数值单位格式化 '', 千', '万', '亿'
 * @param {数值} num 
 * @param {是否返回拼接好的字符串例如：1.5万} isJoin 
 */
const formatUnit = (num, isJoin) => {
  let units = ['', '万', '亿']
  let currNum = num
  let m = {num:0, unit:''}
  if (numSize(currNum) < 5) {
    m.num = keepDecimal(currNum, 0)
    return isJoin ? m.num+m.unit : m
  } else if (numSize(currNum) < 9) { // 万
    m.num = keepDecimal(currNum / 10000, 1)
    m.unit = units[1]
    return isJoin ? m.num+m.unit : m
  } else if (numSize(currNum) < 10) { //亿
    m.num = keepDecimal(currNum / 100000000, 1)
    m.unit = units[2]
    return isJoin ? m.num+m.unit : m
  } else {
	  m.num = num
	  return isJoin ? m.num+m.unit : m
  }
}

/**
 * 是否从target开始
 * @param {*} source 
 * @param {*} target 
 */
const startWith = (source, target) => {
  let reg = new RegExp("^"+target)
  return reg.test(source)
}

/**
 * 是否以target结尾
 * @param {*} source 
 * @param {*} target 
 */
const endWith = (source, target) => {
  let reg = new RegExp(target+"$")
  return reg.test(source)
}

/**
 * 设置头部标题
 * @param {*} title 
 */
const setTitle = (title) => {
  wx.setNavigationBarTitle({
    title: title,
  })
}

/**
 * Toast提示
 * @param {*} title 
 * @param {*} icon (none, success, failed更多参数值查看小程序文档) 
 */
const toast = (title, icon) => {
  wx.showToast({  
    title: title,
    icon: icon ? icon : 'none',
    duration: 3000
  })
}

/**
 * 跳转页面
 * @param {*} url 
 */
const navigateTo = (url) => {
  wx.navigateTo({
    url: url,
  })
  log('navigateTo', url)
}

/**
 * 重定向页面
 * @param {*} url 
 */
const redirectTo = (url) => {
  wx.redirectTo({
    url: url,
  })
  log('redirectTo', url)
}

/**
 * 跳转底部导航页面
 * @param {*} url 
 */
const switchTab = (url) => {
  wx.switchTab({
    url: url,
  })
  log('switchTab', url)
}

/**
 * 回退页面
 * @param {返回页面数，如果 delta 大于现有页面数，则返回到首页} delta 
 */
const navigateBack = (delta) => {
  wx.navigateBack({
    delta: delta ? delta : 1
  })
}

/**
 * 开始下拉刷新
 * @param mask 是否显示透明蒙层，防止触摸穿透。默认false
 */
const startRefresh = (mask=false) => {
  wx.showLoading({
    title: '加载中...',
    mask: mask
  })
}

/**
 * 停止下拉刷新
 */
const stopRefresh = () => {
  wx.stopPullDownRefresh()
  wx.hideLoading()
}

/**
 * 图片预览
 * @param {需要预览的图片链接列表 |Array.<string>} urls 
 * @param {当前显示图片的链接, 不传默认urls 的第一张 |string} current 
 */
const previewImage = (urls, current) => {
  wx.previewImage({
    urls: urls,
    current: current ? current : urls[0]
  })
}

/**
 * 按百分比计算进度
 * @param {当前进度} currentProgress 
 * @param {总进度} totalProgress 
 */
const percent = (currentProgress, totalProgress) => {
  return (parseFloat(currentProgress / totalProgress).toFixed(2)) * 100
}

module.exports = {
  log: log,
  isEmpty: isEmpty,
  isMobile: isMobile,
  isEmail: isEmail,
  putValue: putValue,
  getValue: getValue,
  delValue: delValue,
  formatTime: formatTime,
  keepDecimal: keepDecimal,
  formatUnit: formatUnit,
  startWith: startWith,
  endWith: endWith,
  setTitle: setTitle,
  toast: toast,
  navigateTo: navigateTo,
  redirectTo: redirectTo,
  switchTab: switchTab,
  navigateBack: navigateBack,
  startRefresh: startRefresh,
  stopRefresh: stopRefresh,
  previewImage: previewImage,
  percent: percent
}
