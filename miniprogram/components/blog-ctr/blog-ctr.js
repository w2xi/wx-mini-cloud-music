// 用户信息
let userInfo = {}
// 评论内容
let content = '' 

const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blogItemInfo: Object
  },
  // 使用外部样式
  externalClasses: ['iconfont', 'icon-fenxiang', 'icon-comment'],
  /**
   * 组件的初始数据
   */
  data: {
    isLoginShow: false, // 是否显示授权登录弹出层
    isCommentShow: false, // 是否弹出评论框
    content: '',  // 评论内容
    popupBottom: 0,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 提交评论
    submitComment(){
      let content = this.data.content
      if ( !content.trim() ){
        wx.showToast({
          icon: 'none',
          title: '请写点评论吧~',
        })
        return
      }
      wx.showLoading({
        title: '',
        mask: true
      })
      db.collection('comment').add({
        data: {
          content,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          blog_id: this.properties.blogId,
          createTime: db.serverDate()
        }
      }).then((res)=>{
        this.setData({
          isCommentShow: false,
          content: ''
        })
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
          icon: 'success'
        })
        this.triggerEvent('onRefresh')
      }).catch((err)=>{
        console.log(err)
      })
    },
    onInput(event){
      // console.log(event.detail.value)
      this.setData({
        content: event.detail.value
      })
    },
    onComment(event) {
      // console.log(this.properties.blogId)
      wx.getSetting({
        success: (res) => {
          // 已经授权
          if (res.authSetting['scope.userInfo']) {
            // 获取用户信息
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // console.log(userInfo)
                this.setData({
                  isCommentShow: true
                })
              }
            })
          } else { // 未授权
            this.setData({
              isLoginShow: true
            })
          }
        }
      })
    },
    // 聚焦
    onFocus(event) {
      // console.log(event.detail.height)
      // 模拟器获取的 键盘高度 为0，可以在真机上测试
      this.setData({
        popupBottom: event.detail.height
      })
    },
    // 失去焦点
    onBlur(event) {
      this.setData({
        popupBottom: 0
      })
    },
    // 允许授权处理
    authLoginSuccess(event) {
      userInfo = event.detail
      // 先隐藏授权登录框，再显示评论框
      this.setData({
        isLoginShow: false
      }, () => {
        setTimeout(()=>{
          this.setData({
            isCommentShow: true
          })
        }, 500)
      })
    },
    // 拒绝授权处理
    authLoginFail() {
      wx.showModal({
        title: '授权用户才能评论',
      })
    },
  }
})