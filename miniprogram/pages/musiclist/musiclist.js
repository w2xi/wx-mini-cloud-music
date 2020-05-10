// pages/musiclist/musiclist.js
// 每次最多加载的歌曲数量
const MAX_MUSIC_NUMS = 15;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    coverInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        id: options.id,
        $url: 'musiclist'
      }
    }).then((res)=>{
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks.slice(0, MAX_MUSIC_NUMS),
        coverInfo: {
          name: pl.name,
          coverImgUrl: pl.coverImgUrl
        }
      })
      // 本地存储 （同步）
      wx.setStorageSync('musiclist', pl.tracks)
      wx.hideLoading()
    }).catch((err)=>{
      console.log(err)
      wx.hideLoading()
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
    const musiclist = wx.getStorageSync('musiclist')
    const len = this.data.musiclist.length
    this.setData({
      musiclist: this.data.musiclist.concat(musiclist.slice(len, len + MAX_MUSIC_NUMS))
    })
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})