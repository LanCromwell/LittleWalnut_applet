// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    isShowHand:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }else if(app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo,
        hasUserInfo: false,
      })
    }else if(this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }else{
      //在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand:false
      })
    }, 2000)
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("获取用户信息",res);
          app.core.putEncryptedData(res.encryptedData)
          app.core.putIv(res.iv)
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        complete: (res) => {
          this.wxLogin()
        }
      })
  },

  getUserInfo: function(e) {
      wx.getUserInfo({
        withCredentials: true,
        success: (res) => {
          console.log("获取用户信息",res.rawData);
          app.core.putEncryptedData(res.encryptedData)
          app.core.putIv(res.iv)
          app.globalData.userInfo = res.userInfo;
        },
        complete: (res) => {
          this.wxLogin()
        }
      })
  },
  /**
   * 微信登录换取code
   */
  wxLogin:function(){
    app.util.startRefresh();
    wx.login({
      success: (res) => {
        if (res.code) {
          app.core.putCode(res.code)
          this.bindLogin(res.code)
        }
      }
    })
  },

  /**
   * 请求登录接口
   * @param {} wxCode 
   */
  bindLogin:function(wxCode){
    console.log("请求后的登录信息，",app.globalData.userInfo )
    app.util.startRefresh()
    app.request(app.urls.login,{
      data:{
        code:wxCode,
        third_icon:app.globalData.userInfo.avatarUrl,
        third_name:app.globalData.userInfo.nickName
      }
      ,success: (res) => {
        let status = res.data.code
        console.log("登录成功",res.data.data)
        app.util.stopRefresh()
        if(status == 200) { //没毛病，登录成功了
          this.loginSuccess(res)
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('登录失败[code: '+status+'],'+res.data.msg)
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
        console.log("登录失败",res)
        app.util.toast("登录失败"+(res.data.msg));
      }
    })
  },

   /**
   * 登录成功
   * @param {*} res 
   */
  loginSuccess: function(res) {
    let loginInfo = res.data.data
    app.core.putOpenId(res.data.data.openid);
    app.core.putSessionKey(res.data.data.session_key);
    
    if(app.util.isEmpty(loginInfo.nickname)) {
      loginInfo['nickname'] = app.globalData.userInfo.nickName
    }
    if(app.util.isEmpty(loginInfo.head_img)) {
      loginInfo['head_img'] = app.globalData.userInfo.avatarUrl
    }
    loginInfo['open_id'] = res.data.data.openid;
    app.core.putUserId(res.data.data.id);
    app.core.putLoginInfo(loginInfo)

    if(res.data.data.first_login == 1){//是否第一次登陆
      app.util.redirectTo("../setting/setting")
    }else{
      app.eventBus.run('shareDialogAction',4)
      app.util.navigateBack()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})