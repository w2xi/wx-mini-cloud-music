// components/auth-login/auth-login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPopupShow: Boolean
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
    bindGetUserInfo(event){
      console.log(event)
      const userInfo = event.detail.userInfo
      if ( userInfo ){ // 允许授权
        // 隐藏弹出层
        this.setData({
          isPopupShow: false
        })
        this.triggerEvent('authLoginSuccess', userInfo)
      }else{          // 拒绝授权
        this.triggerEvent('authLoginFail')
      }
    },
  }
})
