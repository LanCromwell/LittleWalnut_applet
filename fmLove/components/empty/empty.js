Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: '../../images/empty.png'
    },
    text: {
      type: String,
      value: '暂无内容'
    },
    offsetY: {
      type: String,
      value: '0rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showEmpty: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function() {
      this.setData({
        showEmpty: false
      })
    },
    hide: function() {
      this.setData({
        showEmpty: true
      })
    }
  }
})
