const COUNT = 10
// 搜索关键字
// let keywords = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopupShow: false, // 底部弹出层是否显示
    blogList: [], // 博客信息
    keywords: '', // 搜索关键字
  },
  // 去博客详情页
  toBlogDetail(event) {
    wx.navigateTo({
      url: '../blog-detail/blog-detail?blogId=' + event.target.dataset.blogid
    })
  },
  // 发布博客
  onRelease: function() {
    // 查看是否授权
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              // console.log(res.userInfo)
              this.authLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else { // 未授权，显示弹出层，让用户授权
          this.setData({
            isPopupShow: true
          })
        }
      }
    })
  },
  // 允许授权，去博客编辑页面
  authLoginSuccess(event) {
    // console.log(event)
    const userInfo = event.detail
    wx.navigateTo({
      url: '../blog-edit/blog-edit?nickname=' + userInfo.nickName + '&avatar=' + userInfo.avatarUrl,
    })
  },
  // 拒绝授权
  authLoginFail(){
    wx.showModal({
      title: '授权用户才能发布',
    })
  },
  // 搜索
  search(event){
    // console.log(event)
    this.setData({
      keywords: event.detail.keywords
    })
    // 清空博客信息
    this.setData({
      blogList: []
    })
    this._loadBlogInfo()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadBlogInfo()
  },
  // 获取博客信息
  _loadBlogInfo(start=0){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        keywords: this.data.keywords,
        count: COUNT,
        $url: 'bloglist',
      }
    }).then((res)=>{
      // console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result.data)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch((err)=>{
      wx.hideLoading()
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 清空博客列表数据，从第0条数据开始加载
    this.setData({
      blogList: []
    })
    this._loadBlogInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._loadBlogInfo(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    // console.log(event)
    const blogItem = event.target.dataset.blog
    return {
      title: blogItem.content,
      path: '/pages/blog-detail/blog-detail?blogId='+blogItem._id
    }
  }
})