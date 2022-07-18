Component({
  properties: {
    model: { //strong[前两个关卡：强提示积分数] weak[弱提示积分数] share[最后一个关卡：课程学完分享弹框]
      type: String, 
      value: 'weak'
    },
    login: { //每日登录积分
      type: Boolean,
      value: false
    },
    gloryImage: {
      type: String,
      value: '' //../../../images/integral-share.png
    },
    gloryName: {
      type: String,
      value: ''
    }
  },
  data: {
    hide: true
  },
  methods: {
    complete: null,
    show: function(fun) {
      this.complete = fun ? fun : null
      this.setData({
        hide: false
      })
      if(this.data.model === 'weak') {
        if(this.weakTimer != null) {
          clearTimeout(this.weakTimer)
        }
        this.weakTimer = setTimeout((e)=> {
          this.onDismiss(e)
        }, 3000)
      }
    },
    onDismiss: function(e) {
      this.setData({
        hide: true
      })
      //Page页里边事件监听取e.detail（自定义组件触发事件时提供的detail对象）
      this.triggerEvent('dismiss', e)
      if(this.complete != null) {
        this.complete()
      }
    }
  }
})
