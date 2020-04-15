// 每一次获取的博客数量
const COUNT = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMyBlog()
  },
  // 获取我的博客信息
  _getMyBlog(){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start: this.data.blogList.length,
        count: COUNT,
        $url: 'myBlog'
      }
    }).then(res => {
      const myBlog = res.result.data
      this.setData({
        blogList: this.data.blogList.concat(myBlog)
      })
      wx.hideLoading()
    }).catch(err=>{
      console.log(err)
    })
  },
  // 去博客详情页
  toBlogDetail(event) {
    wx.navigateTo({
      url: '../blog-detail/blog-detail?blogId=' + event.target.dataset.blogid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this._getMyBlog()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    // console.log(event)
    const blogItem = event.target.dataset.blog
    return {
      title: blogItem.content,
      path: '/pages/blog-detail/blog-detail?blogId=' + blogItem._id
    }
  }
})