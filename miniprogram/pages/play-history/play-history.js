// pages/play-history/play-history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playHistory: [], // 播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = getApp().globalData.openid
    const playHistory = wx.getStorageSync(openid)
    if ( playHistory.length == 0 ){
      wx.showModal({
        title: '无最近播放记录',
        content: '',
      })
    }else{
      this.setData({
        playHistory
      })
      // 将播放列表替换为 playHistory
      wx.setStorageSync('musiclist', playHistory)
    }
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
  onShareAppMessage: function () {

  }
})