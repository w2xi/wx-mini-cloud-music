// components/blog-card/blog-card.js
let formatTime = require('../../utils/formatTime.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogItemInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },
  observers: {
    'blogItemInfo.createTime': function(date){
      // new Date(date) 将服务器时间格式转换为js时间格式
      // console.log(formatTime(new Date(date)))
      if (date){
        this.setData({
          _createTime: formatTime(new Date(date))
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    onPreview(event){
      wx.previewImage({
        urls: this.properties.blogItemInfo.img,
        current: event.currentTarget.dataset.imgsrc,
      })
    },
  }
})
