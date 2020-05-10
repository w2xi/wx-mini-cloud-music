// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getMiniCode(){
    wx.showLoading({
      title: '正在生成',
    })
    wx.cloud.callFunction({
      name: 'getMiniCode'
    }).then(res=>{
      wx.hideLoading()
      // console.log(res)
      wx.previewImage({
        urls: [res.result.fileID],
        current: res.result.fileID
      })
    })
  },
  // 清除全部缓存数据
  clearAll(){
    wx.showModal({
      title: '清除本地缓存数据',
      content: '如果点击确定，则当前正在播放的歌曲信息被清除，请谨慎选择',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.clearStorage()
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
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
  onShareAppMessage: function () {

  }
})