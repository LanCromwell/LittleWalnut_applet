// components/shareDialog/shareDialog.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    height:100,
    isShowHand:true
  },
  
  ready: function() { 
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowHand:false
      })
    }, 2000)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //分享給朋友
    shreToFriend:function(e){
      app.eventBus.run('shareDialogAction',0)
    },
    //製作海報
    makeHaibao:function(e){
      app.eventBus.run('shareDialogAction',1)
    },
    //取消
    cancelBtn:function(e){
      console.log("隐藏了")
      app.eventBus.run('shareDialogAction',2)
    },
  }
})
