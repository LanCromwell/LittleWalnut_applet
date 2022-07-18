// components/vipDialog/vipDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath: { //二维码图片
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    }
  }
})
