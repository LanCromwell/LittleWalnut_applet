// pages/setting/setting.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    years:[],
    curYear: "请选择",
    months:[],
    curMonth: "请选择",
    days:[],
    curDay: "请选择",
    dateValue: [2,2,2],
    roleValue:[2],
    languageValue:[2],
    roles:[],
    luas:[],
    curRole:{},
    curLan:{},
    isShowHand1:true,
    isShowHand2:false,
    isShowHand3:false,
    isShowHand4:false,
    backgroundAudioManager:"",
  },

  /**
   * 角色点击
   * @param {*} e 
   */
  bindRolePickerChange(e){
    const val = e.detail.value
    this.setData({
      curRole:this.data.roles[val],
      isShowHand3:true
    })
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand3:false
      })
    }, 2000)
  },

  /**
   * 语言选择
   * @param {*} e 
   */
  bindLuaPickerChange(e){
    const val = e.detail.value
    this.setData({
      curLan:this.data.luas[val],
      isShowHand4:true
    })
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand4:false
      })
    }, 2000)
  },

  /**
   * 日期选择回调
   * @param {*} e 
   */
  bindDatePickerChange(e) {
    const val = e.detail.value
    const month = this.data.months[val[1]];
    const days = [];

    if([1,3,5,7,8,10,12].indexOf(month) > -1){//31天
      for (let i = 1; i <= 31; i++) {
        days.push(i)
        if(i == 5){
          days.push("请选择")
        }
      }
    }else if(month == 2){//28天
      for (let i = 1; i <= 28; i++) {
        days.push(i)
        if(i == 5){
          days.push("请选择")
        }
      }
    }else{//30天
      for (let i = 1; i <= 30; i++) {
        days.push(i)
        if(i == 5){
          days.push("请选择")
        }
      }
    }

    this.setData({
      curYear: this.data.years[val[0]],
      curMonth: month,
      curDay: this.data.days[val[2]],
      days:days,
      isShowHand2:true
    })

    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand2:false
      })
    }, 2000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const date = new Date()
    const years = []
    const months = []
    const days = []

    const curYear = date.getFullYear();
    
    for (let i = curYear - 6; i <= curYear + 1; i++) {
      years.push(i)
      if(curYear - i == 2){
        years.push("请选择")
      }
    }
    
    for (let i = 1; i <= 12; i++) {
      months.push(i)
      if(i == 5){
        months.push("请选择")
      }
    }
    
    for (let i = 1; i <= 31; i++) {
      days.push(i)
      if(i == 5){
        days.push("请选择")
      }
    }
    
    this.setData({
      years:years,
      months:months,
      days:days,
    })

    var birthday = app.globalData.userInfo.child_birthday;
    if(birthday >0){//设置过生日
      var mDate = new Date(birthday * 1000);
      var year = mDate.getFullYear();
      var month = mDate.getMonth()+1
      var day = mDate.getDate();

      // console.log("年月日 = ",year,month,day);

      var curYearIndex = 5;
      var curMonthIndex = 5;
      var curDayIndex = 5;
      for(var i=0;i<years.length;i++){
        if(year == years[i]){
          curYearIndex = i;
          break
        }
      }

      for(var i=0;i<months.length;i++){
        if(month == months[i]){
          curMonthIndex = i;
          break
        }
      }

      for(var i=0;i<days.length;i++){
        if(day == days[i]){
          curDayIndex = i;
          break
        }
      }

      console.log(this.data.years[curYearIndex],this.data.months[curMonthIndex],this.data.days[curDayIndex])

      this.setData({
        dateValue:[curYearIndex,curMonthIndex,curDayIndex],
        curYear: this.data.years[curYearIndex],
        curMonth: this.data.months[curMonthIndex],
        curDay: days[curDayIndex],
        days:days
      })
    }else{
      this.setData({
        dateValue:[5,5,5]
      })
    }

    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand1:false
      })
    }, 2000)

  
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRoleList();
    this.getLanguageList();

    //播放音频
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.title = "小核桃语音助理"
    backgroundAudioManager.src = "https://mamaucan.oss-cn-beijing.aliyuncs.com/audio_info/2021-05-13-05-27-26-609cb8be71bcc.mp3"
    backgroundAudioManager.onEnded((res) => {//播放完毕后，播放结束语
        console.log("语音播放完毕")
    })
    backgroundAudioManager.onError((res) => {
      console.log("播放失败，请稍后重试!")
    })
    
    this.setData({
      backgroundAudioManager:backgroundAudioManager
    })
  },

  /**
   * 获取角色列表
   */
  getRoleList:function(){
    let that = this;
    app.util.startRefresh()
    app.request(app.urls.getRoleList,{
      success: (res) => {
        let status = res.data.code
        // console.log("角色列表",res.data.data)
        app.util.stopRefresh()
        if(status == 200) { //没毛病，登录成功了
          res.data.data.unshift({name:"请选择"});
          that.setData({
            roles : res.data.data,
          })
          var roleId = app.globalData.userInfo.role_id;
          if(roleId > 0){//说明之前设置过
            for(var i=0;i<res.data.data.length;i++){
              var roleInfo = res.data.data[i];
              if(roleId == roleInfo.id){//为当前的角色
                that.setData({
                  roleValue:[i],
                  curRole:roleInfo
                })
                break
              }
            }
          }
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('角色信息获取失败[code: '+status+']')
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
        app.util.toast("角色信息获取失败");
      }
    })
  },

  /**
   * 获取语言列表
   */
  getLanguageList:function(){
    let that = this;
    app.request(app.urls.getLanguageList,{
      success: (res) => {
        let status = res.data.code
        // console.log("语言列表",res.data.data)

        
        if(status == 200) { //没毛病，登录成功了
          res.data.data.unshift({name:"请选择"});
          that.setData({
            luas : res.data.data
          })

          var languageId = app.globalData.userInfo.language_id;
          if(languageId > 0){//说明之前设置过
            for(var i=0;i<res.data.data.length;i++){
              var lanInfo = res.data.data[i];
              if(languageId == lanInfo.id){//为当前的角色
                that.setData({
                  languageValue:[i],
                  curLan:lanInfo
                })
                break
              }
            }
          }

        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('方言列表获取失败[code: '+status+']')
        }
      },
      fail: (res) => {
        app.util.toast("方言列表获取失败");
      }
    })
  },

  /**
   * 点击完成
   * @param {*} e 
   */
  clickComplete:function(e){
    console.log("日期变化" , this.data.curYear,this.data.curMonth,this.data.curDay)

    if(this.data.curYear == "请选择" || this.data.curMonth == "请选择" || this.data.curDay == "请选择"){
      app.util.toast("请选择预产期/出生日期")
      return
    }

    if(app.util.isEmpty(this.data.curRole.id)){
      app.util.toast("请选择角色")
      return
    }

    if(app.util.isEmpty(this.data.curLan.id)){
      app.util.toast("请选择民族方言")
      return
    }

    let time = this.data.curYear+"-"+this.data.curMonth+"-"+this.data.curDay;

    let that = this;
    app.util.startRefresh()
    app.request(app.urls.updateUserInfo,{
      data:{
        'language_id':that.data.curLan.id,
        'role_id':that.data.curRole.id,
        'child_birthday':time,
        'type':1
      },
      success: (res) => {
        let status = res.data.code
        app.util.stopRefresh()
        if(status == 200) { //没毛病，登录成功了
          app.util.toast("设置完成");
          setTimeout(function() {
            // console.log("设置完成")
            app.util.redirectTo("../guide/guide");
            app.eventBus.run('shareDialogAction',5)
        }, 1000)
        } else { // 你再多的状态也是失败啊，赶紧的去看日志吧
          app.util.toast('设置失败，请稍后重试[code: '+status+'], '+res.data.msg)
        }
      },
      fail: (res) => {
        app.util.stopRefresh()
        app.util.toast("设置失败，请稍后重试");
      }
    })
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