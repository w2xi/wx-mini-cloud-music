// pages/blog-detail/blog-detail.js
let formatTime = require('../../utils/formatTime.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    blogInfo: {},
    blogId: 0, // 博客id
    blogComment: [], // 博客评论
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.blogId)
    this.setData({
      blogId: options.blogId
    })
    this._getBlogInfo()
    this._getCommentInfo()
  },
  // 获取博客详情
  _getBlogInfo(){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'blogItem'
      }
    }).then((res)=>{
        wx.hideLoading()
        // console.log(res)
        this.setData({
          blogInfo: res.result.data[0]
        })
      }).catch((err) => {
        wx.hideLoading()
        // console.log(err)
    })
  },
  // 刷新页面
  onRefresh(){
    // 清空评论数据
    this.setData({
      blogComment: []
    })
    this._getCommentInfo()
  },
  // 获取博客评论信息
  _getCommentInfo(){
    // console.log('there are some comments')
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blog_id: this.data.blogId,
        $url: 'blogComment'
      }
    }).then((res)=>{
      // console.log(res)
      let data = res.result.data
      for (let i = 0; i < data.length; i++ ){
        // console.log(formatTime(new Date(data[i].createTime)))
        data[i].createTime = formatTime(new Date(data[i].createTime))
      }
      this.setData({
        blogComment: this.data.blogComment.concat(data)
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blogItem = event.target.dataset.blog
    return {
      title: blogItem.content,
      path: '/pages/blog-detail/blog-detail?blogId=' + blogItem._id
    }
  }
})