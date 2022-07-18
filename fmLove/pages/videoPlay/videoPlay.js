// pages/videoplay/videoPlay.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img_path:"",
    statusBarHeight:"20",
    videoTitle:"",
    id:"",
    url:"",
    reminder_date:"",
    isShowShareDialog:false,
    isWeidabiao:false,
    isDabiao:false,
    isShowHand:false
  },

  videoErrorCallback(e) {
    console.log('视频错误信息:')
    app.util.toast(e.detail.errMsg)
    console.log(e.detail.errMsg)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = options.url;
    var img = options.img;
    var title = options.title;
    var id = options.id;
    var reminder_date = options.reminder_date;
    this.setData({
      img_path:img,
      videoTitle:title,
      id:id,
      reminder_date:reminder_date,
      url:url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("statusBarHeight",app.globalData.statusBarHeight)
    this.videoContext = wx.createVideoContext('myVideo')
    app.eventBus.on(this, 'shareDialogAction')
    this.getPriseStatus();
    this.setData({
      statusBarHeight : app.globalData.statusBarHeight
    })
  },
  /**视频播放结束 */
  ended:function(e){
    this.setData({
      isShowHand:true
    })
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand:false
      })
    }, 2000)
  },

  closeBtn:function(e){
    app.util.navigateBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.eventBus.off('shareDialogAction')
  },

  onShareAppMessage: function (options) {
    return {
      title: app.globalData.userInfo.miniprogrampage_invite_info.title,
      path: '/pages/index/index'
    }
  },

  /**获取点赞的状态 */
  getPriseStatus:function(e){
    // 获取点赞状态，并修改 
    app.request(app.urls.isPriseData,{
      data:{
        audio_id:this.data.id
      },
      success: (res) => {
        let status = res.data.code
        if(status == 200) { //没毛病
          var prise = res.data.data.is_collect == 0 ? false : true;
          this.setData({
            isWeidabiao : prise
          })
          console.log("点赞状态 = "+res.data.data.is_collect);
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
      }
    })

    // 获取达标状态，并修改 isDabiao
    app.request(app.urls.isdabiaoData,{
      data:{
        audio_id:this.data.id
      },
      success: (res) => {
        let status = res.data.code
        if(status == 200) { //没毛病
          var prise = res.data.data.is_accomplish == 0 ? false : true;
          this.setData({
            isDabiao : prise,
          })
          // console.log("点赞状态 = "+res.data.data.is_collect);
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
      }
    })
  },
  /**点击达标 */
  clickDabiao:function(e){
    app.request(app.urls.dabiaoData,{
      data:{
        audio_id:this.data.id
      },
      success: (res) => {
        let status = res.data.code
        if(status == 200) { //没毛病
          var prise = !this.data.isDabiao;
          this.setData({
            isDabiao : prise
          })
          
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
      }
    })
  },
  /**未达标*/
  clickWeidabiao:function(e){
    app.request(app.urls.priseData,{
      data:{
        audio_id:this.data.id
      },
      success: (res) => {
        let status = res.data.code
        if(status == 200) { //没毛病
          var prise = !this.data.isWeidabiao;
          this.setData({
            isWeidabiao : prise,
          })
          // console.log("点赞结果 = "+res.data.msg);
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
      }
    })
  },

  //点击分享
  clickShare: function(e) {
    console.log("点击分享")
    this.setData({
      isShowShareDialog:true
    })
  },

  onEventBusRefresh: function(data) {
    if(data == 0){// 分享給朋友
      this.setData({
        isShowShareDialog:false
      })
      wx.showShareMenu({
        withShareTicket: true
      })
    }else if(data == 1){//海报页面
      console.log("id = "+this.data.id+", reminder_date = "+this.data.reminder_date)
      app.util.navigateTo("../todayRemindPic/todayRemindPic?id="+(this.data.id)+"&reminder_date="+(this.data.reminder_date));
      this.setData({
        isShowShareDialog:false
      })

    }else if(data == 2){//分享弹窗取消
      this.setData({
        isShowShareDialog:false
      })
    }
  },
})