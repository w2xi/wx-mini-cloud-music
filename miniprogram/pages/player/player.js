// pages/player/player.js
let musiclist = []; // 歌曲列表信息
let musicItemInfo = {}; // 当前播放歌曲信息
let musicIndex = 0; // 当前播放歌曲索引
// 背景音频管理器
const bgAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, // false: 表示未播放；true:表示正在播放
    isLyricShow: false, // 歌词是否显示，默认不显示
    lyric: '',
    isSameMusic: false, // 是否是同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: {musicId: '', musicIndex: ''}
    // 这里的 options.musicIndex是一个字符串  
    musicIndex = parseInt(options.musicIndex)
    musiclist = wx.getStorageSync('musiclist')
    this._loadSongInfo(options.musicId)
  },
  // 获取歌曲信息
  _loadSongInfo: function (musicId){
    // console.log('musicId:'+musicId)
    // console.log('getPlayMusicId: '+app.getPlayMusicId())
    if ( musicId == app.getPlayMusicId() ){ // 是同一首歌
      this.setData({
        isSameMusic: true
      })
    }else{
      this.setData({
        isSameMusic: false
      })
    }
    if ( this.data.isSameMusic ){// 是同一首歌
      // 播放歌曲
      bgAudioManager.play()
    } else {                // 不是同一首歌
      // 暂停播放
      bgAudioManager.stop()
    }
    musicItemInfo = musiclist[musicIndex]
    // 设置导航栏标题为 音乐名称
    wx.setNavigationBarTitle({
      title: musicItemInfo.name
    })
    this.setData({
      picUrl: musicItemInfo.al.picUrl,
      isPlaying: false
    })
    // 全局设置播放音乐id
    app.setPlayMusicId(musicId)
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId: musicId,
        $url: 'songInfo'
      }
    }).then((res)=>{
      // console.log(res)
      // 歌曲资源来源于网易云音乐，有些歌曲可能需要会员权限
      if ( res.result.data[0].url == null ){ 
        wx.showToast({
          icon: 'none',
          title: '无权限播放',
        })
        return 
      }
      if ( !this.data.isSameMusic ){ // 如果不是同一首歌
        bgAudioManager.src = res.result.data[0].url
        bgAudioManager.title = musicItemInfo.name
        bgAudioManager.epname = musicItemInfo.al.name
        bgAudioManager.singer = musicItemInfo.ar[0].name
        bgAudioManager.coverImgUrl = musicItemInfo.al.picUrl
        // 记录播放历史
        const openid = app.globalData.openid
        let playHistory = wx.getStorageSync(openid)
        let isHasPlayed = false // 是否已经播放过的标志
        for ( let i =0; i < playHistory.length; i++ ){
          if ( playHistory[i].id == musicItemInfo.id ){
            isHasPlayed = true
            break
          }
        }
        if ( !isHasPlayed ){ // 如果未播放过
          // 存入本地记录
          playHistory.unshift(musicItemInfo)
          wx.setStorageSync(openid, playHistory)
        }
      }
      // else{ // 如果是同一首歌，更新播放总时长
      //   this.selectComponent('.progress-bar')._setTotalTime(bgAudioManager.duration)
      // }     
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
      // 调用云函数获取歌词信息
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId: musicId,
          $url: 'lyric'
        }
      }).then((res)=>{
        // console.log(res)
        let lyric = "暂无歌词"
        if (res.result.lrc){
          lyric = res.result.lrc.lyric
        }
        this.setData({
          lyric
        })
      }).catch((err)=>{
        console.log(err)
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 下一首歌曲
  nextSong: function(){
    musicIndex++
    if ( musicIndex === musiclist.length ){
      musicIndex = 0
    }
    this._loadSongInfo(musiclist[musicIndex].id)
  },
  // 上一首歌曲
  preSong: function () {
    musicIndex--
    if ( musicIndex < 0 ){
      musicIndex = musiclist.length -1
    }
    this._loadSongInfo(musiclist[musicIndex].id)
  },
  onPlay: function(){
    this.setData({
      isPlaying: true
    })
  },
  onPause: function(){
    this.setData({
      isPlaying: false
    })
  },
  // 切换播放状态
  togglePlayingStatus: function(){
    if ( this.data.isPlaying ){
      bgAudioManager.pause()
    }else{
      bgAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 唱片和歌词的切换显示
  toggleLyricShow: function(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  songTimeChange: function(event){
    // console.log(event)
    // 父组件还可以通过 wx.selectComponent 方法获取子组件实例对象，这样就可以直接访问组件的任意数据和方法
    // 这里获取 lyric 组件, passCurrentTime()是lyric组件的一个方法
    this.selectComponent('.lyric').passCurrentTime(event.detail.currentTime)
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