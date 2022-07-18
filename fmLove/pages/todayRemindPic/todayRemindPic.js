// pages/todayRemindPic/todayRemindPic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList:[],
    curIndex:0,
    userauth:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.util.startRefresh();
    app.request(app.urls.getHaibaoInfo,{
      data:{
        audio_id:options.id,
        reminder_date:options.reminder_date
      },
      method:'GET',
      success: (res) => {
        let status = res.data.code
        app.util.stopRefresh()
        if(status == 200) { //没毛病，登录成功了
          that.setData({
            picList:res.data.data
          })
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('海报获取失败，请稍后重试[code: '+status+']')
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
        app.util.toast('海报获取失败，请稍后重试')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * swipe切换
   */
  onSwipeChange : function(e){
    this.setData({
      curIndex:e.detail.current
    })
  },

  /**
   * 下载图片到相册
   * @param {*} e 
   */
  saveBtn:function(e){
    // console.log("图片下载地址",this.data.picList[this.data.curIndex].path);
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum'] != undefined && res.authSetting['scope.writePhotosAlbum'] == false) {
          //没有授权
          // app.util.toast("保存到相册授权未打开！")
          this.setData({
            userauth:false
          })
        } else {
          this.download();
        }
      }
    })
  },

  download:function(){
    app.util.startRefresh()
    wx.downloadFile({
      url: this.data.picList[this.data.curIndex].path,
      success: res => {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath:res.tempFilePath,
            success(res) { 
              app.util.toast("海报已保存到手机相册，每日传递好心情")
              console.log("图片下载成功",res);
            }
          })
        }
      }, fail: res => {
        app.util.toast("海报保存失败")
        console.log("图片下载失败，请稍后重试",res);
      },complete: res => {
        app.util.stopRefresh()
      }
    });
  },

  getseetting: function(res) {
    if (res.detail.authSetting['scope.writePhotosAlbum'] == true) {
      this.download();
    } else {
      wx.showToast({
        title: '保存到相册授权未打开！',
        icon: 'none'
      })
    }
    this.setData({
      userauth: true
    });
  },

  closeauth:function(e){
    this.setData({
      userauth: true
    });
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
  onShareAppMessage: function (options) {
    return {
      title: app.globalData.userInfo.miniprogrampage_invite_info.title,
      path: '/pages/index/index'
    }
  }
})