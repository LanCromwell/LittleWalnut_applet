/**
 * 阿拉丁统计SDK
 * app.aldstat.sendEvent(key, value)
 * key: string
 * value: string or object
 * @description http://doc.aldwx.com/mini-program/join/wx-sdk/base-program
 */
//const aldstat = require('./lib/aldstat/ald-stat.js')

App({
  onLaunch: function () {
    var that = this;
    let model = '';
    wx.getSystemInfo({
      success:  function (res)  {
      console.log(res)
      // 获取手机
      model = res.model;
      that.globalData.statusBarHeight = res.statusBarHeight;
      if (model.search('iPhone X') != -1) {
        that.globalData.isIphoneX = true
        }
        wx.setStorageSync('modelmes', model)
      },
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {
    //       this.core.delLoginInfo()
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  },
  util: require('./common/util.js'),
  urls: require('./common/urls.js'),
  http: require('./common/http.js'),
  core: require('./common/core.js'),
  config:require('./common/config.js'),
  eventBus: require('./common/eventbus.js'),
  request: function(url, map={}) {
    return this.http.request(url, map)
  },
})