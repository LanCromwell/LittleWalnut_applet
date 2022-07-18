// pages/play/play.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundAudioManager:"",
    img_path:"",
    statusBarHeight:"20",
    curAudioIndex:0,
    videoTitle:"",
    id:"",
    isShowShareDialog:false,
    isDabiao:false,//是否选择达标
    isWeidabiao:false//是否选择未达标
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
      reminder_date:reminder_date
    })

    //播放音频
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = "小核桃语音助理"
    backgroundAudioManager.src = url
    backgroundAudioManager.onEnded((res) => {//播放完毕后，播放结束语
      if(this.data.curAudioIndex == 0){
        this.data.backgroundAudioManager.src = app.globalData.userInfo.append_audio
        this.setData({
          curAudioIndex:1
        })
        console.log("播放完毕111")
        // this.playEndVoice()
        
      }else{
        console.log("语音播放完毕222")
        app.util.toast("播放完毕")
        app.util.navigateBack()
      }
     
    })
    backgroundAudioManager.onError((res) => {
      app.util.toast("播放失败，请稍后重试!")
      app.util.navigateBack()
    })
    
    this.setData({
      backgroundAudioManager:backgroundAudioManager
    })
  },

  // /**
  //  * 播放结束语
  //  */
  // playEndVoice:function () {
  //   this.data.backgroundAudioManager.src = app.globalData.userInfo.append_audio
  //   this.data.backgroundAudioManager.onEnded((res) => {
  //     console.log("播放完毕")
  //     app.util.toast("播放完毕")
  //     app.util.navigateBack()
  //   })
  //   this.data.backgroundAudioManager.onError((res) => {
  //     app.util.toast("播放失败，请稍后重试!")
  //     app.util.navigateBack()
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("statusBarHeight",app.globalData.statusBarHeight)
    app.eventBus.on(this, 'shareDialogAction')
    this.getPriseStatus();
    this.setData({
      statusBarHeight : app.globalData.statusBarHeight
    })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.backgroundAudioManager.stop();
    app.eventBus.off('shareDialogAction')
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

  onShareAppMessage: function (options) {
    return {
      title: app.globalData.userInfo.miniprogrampage_invite_info.title,
      path: '/pages/index/index'
    }
  },
  /**获取达标和不达标的状态 */
  getPriseStatus:function(e){
    // 获取不达标状态，并修改isWeidabiao
    app.request(app.urls.isPriseData,{
      data:{
        audio_id:this.data.id
      },
      success: (res) => {
        let status = res.data.code
        if(status == 200) { //没毛病
          var prise = res.data.data.is_collect == 0 ? false : true;
          this.setData({
            isWeidabiao : prise,
          })
          // console.log("点赞状态 = "+res.data.data.is_collect);
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

  /**点击未达标*/
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
            isWeidabiao : prise
          })
          console.log("点赞结果 = "+res.data.msg);
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
      }
    })
  },

  // //点击分享
  // clickShare: function(e) {
  //   console.log("点击分享")
  //   this.setData({
  //     isShowShareDialog:true
  //   })
  // },

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