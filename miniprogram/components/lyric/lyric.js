// components/lyric/lyric.js
let currentPlayTime = 0
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 父元素调用该组件传过来的值
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },
  // 数据监听器
  observers: {
    'lyric': function(lyric){
      // console.log(lyric)
      if ( lyric == '暂无歌词' ){
        this.setData({
          lyricInfo: [{
            lyric: lyric,
          }],
          playLyricIndex: -1
        })
        return
      }
      // 歌词解析
      this._parseLyric(lyric)
      // console.log(this.data.lyricInfo)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lyricInfo: [],
    scrollTop: 0,
    playLyricIndex: 0, // 当前播放歌词索引,高亮
  },
  // 组件生命周期
  lifetimes: {
    // 在视图层布局完成是执行
    ready(){
      wx.getSystemInfo({
        success: function(res) {
          // 屏幕宽度，单位 px
          // res.screenWidth
          /**
           * 小程序中，屏幕的宽度固定为 750rpx
           * 64 表示歌词的高度(在lyric.wxss中有设置)，单位 rpx
           * lyricHeight: 歌词高度，单位 px
           */
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // currentTime  歌曲当前播放时间，秒
    passCurrentTime(currentTime){
      this._relatedLyric(currentTime)
    },
    // 联动歌词
    _relatedLyric(currentTime){
      const lyricInfo = this.data.lyricInfo
      const lyricInfoLen = lyricInfo.length
      // 还没有歌词
      if (lyricInfoLen == 0 || (lyricInfoLen == 1 && lyricInfo[0].lyric == '暂无歌词')){
        return
      }
      // 如果传过来的currentTime比lyricInfo的最后一条歌词的时间还大
      if (currentTime > lyricInfo[lyricInfoLen-1].time ){
        this.setData({
          playLyricIndex: -1,
          scrollTop: lyricInfoLen * lyricHeight
        })
        return
      }

      for (let i =0; i < lyricInfo.length; i++){
        if ( currentTime <= lyricInfo[i].time ){
          this.setData({
            playLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break;
        }
      }
    },
    _parseLyric(lyric){
      let lyricInfo = []
      let lyricArr = lyric.split('\n')
      let regTime = /\[\d{2,}:\d{2,}\.\d{2,}\]/g
      for (let item of lyricArr) {
        let time = item.match(regTime)
        // console.log(time) ["01:05.952"]
        if (time != null) {
          // 歌词信息
          let lycItem = item.split(time)[1]
          let timeArr = time[0].match(/(\d{2,}):(\d{2,})\.(\d{2,})/)
          // ["01:05.952", "01", "05", "952", index: 1, input: "[01:05.952]", groups: undefined]
          // 歌曲时间，秒
          let currentTime = parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]) + parseInt(timeArr[3]) / 1000
          lyricInfo.push({
            lyric: lycItem,
            time: currentTime
          })
        }
      }
      this.setData({
        lyricInfo
      })
    }
  }
})
