const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    screenHeight:0,
    swiperHeigh:0,
    headerHeigh:0,
    isShowShareDialog:false,
    hasLogin: false,
    loginInfo: null,
    isShowVipExpireDialog:false,//是否显示体验到期弹窗
    weekArr:["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    week:"",
    month:'',
    day:'',
    lurDay:'',
    videoList:[],
    curIndex :0,//swiper当前下表
    curPage:0,//今日提醒数据当前页数
    pageSize:90,
    setInter:'',
    daojishi:'',
    needShowRefresh:false,//是否需要在onShow的时候刷新
    isShowHand:false,//是否显示小手
  },
  onLoad: function () {
    this.systemInfo = wx.getSystemInfoSync();
  },

  /**
   * 根据年月日获取是周几
   * @param {*} year 
   * @param {*} month 
   * @param {*} day 
   */
  getWeekDay:function(year,month,day){
    var myDate = new Date(Date.parse(year+"/"+month+"/"+day));  
    return this.data.weekArr[myDate.getDay()];
  },

  onPullDownRefresh: function() {
    // app.util.toast("刷新")
    this.setData({
      curPage:0
    })
    this.getData(true);
  },

  /**
   * 获取今日提醒数据
   */
  getRemindInfos:function(isShowLoading){
    let that = this;
    if(isShowLoading){
      app.util.startRefresh()
    }
    
    app.request(app.urls.getTodayRemindInfo,{
      data:{
        page:that.data.curPage,
        page_size:that.data.pageSize
      },
      success: (res) => {
        if(200 == res.data.code) { //没毛病，成功了
          var mVideoList = that.data.videoList;
          
          if(that.data.curPage == 0){
            mVideoList.length = 0;//清空数组
          }

          for(var i=res.data.data.length-1;i>=0;i--){
            mVideoList.unshift(res.data.data[i]);
          }
          
          //添加明日预告信息到列表中
          that.setData({
            videoList:mVideoList,
            needShowRefresh:false
          })
          if(that.data.curPage == 0){
            that.endSetInter();
            that.startSetInter();
            this.dealRemindList(mVideoList[mVideoList.length-2],mVideoList.length-2)
            this.cupHeight();
          }
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('获取失败，请稍后重试[code: '+res.data.code+']')
        }
        app.util.stopRefresh()
      },
      fail: (res) => {
        app.util.stopRefresh()
        if(that.data.curPage >=1){
          that.setData({
            curPage:that.data.curPage-1
          })
        }
        
      }
    })
  },

  /**
   * 媒体提醒切换
   * @param {*} e 
   */
  swiperChange:function(e){
    var index = e.detail.current;
    var item = this.data.videoList[index];
    this.dealRemindList(item,index);
    if(this.data.videoList.length >= this.data.pageSize && this.data.curIndex == 10){
      this.setData({
        curPage:this.data.curPage+1
      })
    }
    //最后一页
    if(index == this.data.videoList.length - 1){
      var that = this;
      this.setData({
        isShowHand:true
      })
      setTimeout(function() {
        that.setData({
          isShowHand:false
        })
      }, 2000)
    }else{
      this.setData({
        isShowHand:false
      })
    }
  },

  /**
   * 处理今日提醒数据
   */
  dealRemindList:function(itemInfo,index){
    if(itemInfo){
      var lastItemArr = itemInfo.reminder_date.split("-");
      var mWeekDay = this.getWeekDay(lastItemArr[0],lastItemArr[1],lastItemArr[2])
      this.setData({
        lurDay:itemInfo.lunar_calendar.month+itemInfo.lunar_calendar.day,
        month:lastItemArr[1],
        day:lastItemArr[2],
        week:mWeekDay,
        curIndex:index
      })
    }
  },

  //微信小程序设置一个定时器
  startSetInter: function(){
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
        function () {//
            var curDate = new Date();
            var curtimestamp = curDate.getTime();
            var nextDayDate = new Date(Date.parse(curDate.getFullYear()+"/"+(curDate.getMonth()+1)+"/"+curDate.getDate()+" 23:59:59")); 
            var durMills = parseInt((nextDayDate.getTime() - curtimestamp)/1000) ;//秒
            // console.log(parseInt(durMills/60/60),parseInt(durMills/60)%60,durMills%60);
            that.setData({
              daojishi:parseInt(durMills/60/60)+"小时"+(parseInt(durMills/60)%60)+"分"+(durMills%60)+"秒"
            })
        }
    , 1000)
  },

  //微信小程序在页面卸载的时候删除定时器
  endSetInter: function(){
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },

  onReady:function(){
    let that = this;
    console.log("首页 onReady")
    app.eventBus.on(this, 'shareDialogAction')
    // this.cupHeight()
  },

  cupHeight:function(){
    
    let mScreenHeight = this.systemInfo.windowHeight;
    this.setData({
      screenHeight:mScreenHeight,
    })
    wx.createSelectorQuery().selectAll('.header').boundingClientRect((res) => {
      if(res && res[0]) {
        let headerHeight = res[0].height;
        let mswiperHeigh = this.data.screenHeight - headerHeight;//这里无法拿到this.screenHeight值
        // console.log("头部高度",headerHeight ,"mswiperHeigh高度",mswiperHeigh);
        this.setData({
          swiperHeigh:mswiperHeigh,
          headerHeigh:headerHeight
        })
      }
    }).exec()
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
      app.util.navigateTo("../todayRemindPic/todayRemindPic?id="+(this.data.videoList[this.data.curIndex].id)+"&reminder_date="+(this.data.videoList[this.data.curIndex].reminder_date));
      this.setData({
        isShowShareDialog:false
      })

    }else if(data == 2){//分享弹窗取消
      this.setData({
        isShowShareDialog:false
      })
    }else if(data == 4){//重新设置了用户信息，刷新当前页面
      this.setData({
        curPage:0,
        isShowShareDialog:false
      })
      this.getData(false);
    }else if(data == 5){//登录或设置完成后刷新页面
      this.setData({
        needShowRefresh:true,
        isShowShareDialog:false
      })
    }
  },
  //点击设置
  clickSetting: function(e) {
    if(this.data.hasLogin){
      app.util.navigateTo("../setting/setting");
    }else{
      app.util.navigateTo("../login/login");
    }
  },
  //点击今日提醒
  clickRemind: function(e) {
    if(!this.data.hasLogin){
      app.util.navigateTo("../login/login");
    }else{
      if(this.data.videoList[this.data.curIndex].file_type == 1){//0是音频,1是视频
        app.util.navigateTo("../videoPlay/videoPlay?url="+(this.data.videoList[this.data.curIndex].audio_path)+"&img="+this.data.videoList[this.data.curIndex].img_path+"&title="+this.data.videoList[this.data.curIndex].title+"&id="+this.data.videoList[this.data.curIndex].id+"&reminder_date="+this.data.videoList[this.data.curIndex].reminder_date);
      }else{
        app.util.navigateTo("../play/play?url="+(this.data.videoList[this.data.curIndex].audio_path)+"&img="+this.data.videoList[this.data.curIndex].img_path+"&title="+this.data.videoList[this.data.curIndex].title+"&id="+this.data.videoList[this.data.curIndex].id+"&reminder_date="+this.data.videoList[this.data.curIndex].reminder_date);
      }
    }
  },
  //点击分享
  clickShare: function(e) {
    if(!this.data.hasLogin){
      app.util.navigateTo("../login/login");
    }else{
      this.setData({
        isShowShareDialog:true
      })
    }
  },
 
  /**
   * 获取用户信息
   */
  getUserInfo:function(isShowLoading){
    if(isShowLoading){
      app.util.startRefresh()
    }
    
    app.request(app.urls.getUserInfo,{
      success: (res) => {
        let status = res.data.code
        app.util.stopRefresh()
        if(status == 200) { //没毛病，登录成功了
          app.globalData.userInfo = res.data.data
          this.dealData(res.data.data,isShowLoading)
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('信息失败，请稍后重试[code: '+status+']')
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
      }
    })
  },

  /**
   * 处理用户信息
   * @param {*} data 
   */
  dealData:function(data,isShowLoading){
    console.log("体验期",data.remainder_days)

    if(data.remainder_days <=0){//体验期已过
      var that = this;
      setTimeout(function() {
        that.setData({
          isShowVipExpireDialog:true
        })
      }, 1000)
    }
    this.getRemindInfos(isShowLoading);
  },

  onShow:function(){
    let loginInfo = app.core.getLoginInfo()
    if(app.util.isEmpty(loginInfo)) {//未登录
      this.getRemindInfos(true);
      this.setData({
        loginInfo: null,
        hasLogin: false,
      })
      // app.util.navigateTo("../login/login");
    }else{
      if(this.data.videoList.length <= 0 || this.data.needShowRefresh){
        this.setData({
          curPage:0,
          needShowRefresh:false,
          hasLogin:true
        })
        this.getData(true);
      }
    }
  },

  /**
   * 检查登录
   */
  getData: function(isShowLoading) {
    let loginInfo = app.core.getLoginInfo()
    if(app.util.isEmpty(loginInfo)) {//未登录
      this.setData({
        loginInfo: null,
        hasLogin: false,
      })
      app.util.stopRefresh()
    } else {//已登录
      this.setData({
        loginInfo: loginInfo,
        hasLogin: true
      })
      this.getUserInfo(isShowLoading);
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.eventBus.off('shareDialogAction')
    console.log("首页 onUnload")
    this.endSetInter()
  },

  handleContact:function (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  
  onShareAppMessage: function (options) {
    return {
      title: app.globalData.userInfo.miniprogrampage_invite_info.title,
      imageUrl:this.data.videoList[this.data.curIndex].img_path,
      path: '/pages/index/index'
    }
  }

})
