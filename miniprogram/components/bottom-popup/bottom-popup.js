// components/bottom-popup/bottom-popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPopupShow: Boolean,
    popupBottom: Number
  },
  options: {
    // 样式隔离：
    styleIsolation: 'apply-shared',
    // 开启多个插槽
    multipleSlots: true
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
    onClose(){
      this.setData({
        isPopupShow: false
      })
    }
  }
})
