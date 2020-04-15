// components/progress-bar/progress-bar.js
let movableAeraWidth = 0
let movableViewWidth = 0
const bgAudioManager = wx.getBackgroundAudioManager()
// 当前歌曲播放时间
let currentSec = -1
// 进度是否在拖拽，false表示没有拖拽，解决：拖拽时进度和 onTimeUpdate事件更新进度 冲突
// 因为拖拽时歌曲还在播放，就会触发 onTimeUpdate事件
let isDragDrop = false

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSameMusic: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    moveDistance: 0, // movable-view移动的距离
    progress: 0      // 进度条已播放所占的份数，总共100份
  },
  // 组件生命周期
  lifetimes: {
    // 在组件在视图层布局完成后执行
    ready: function(){
      if ( this.properties.isSameMusic && this.data.showTime.totalTime == '00:00' ){
        this._setTotalTime()
      }
      this._getMovableWidth()
      // 监听背景音频事件
      this._bindBGMvent()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableWidth() {
      // 在自定义组件中，this指向wx
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((res) => {
        movableAeraWidth = res[0].width
        movableViewWidth = res[1].width
        // console.log(movableAeraWidth, movableViewWidth)
      })
    },
    _bindBGMvent(){
      // 监听背景音频播放事件
      bgAudioManager.onPlay(()=>{
        console.log('onPlay')
        isDragDrop = false
        // 用以联动自带音频控制台
        this.triggerEvent('musicPlay')
      }),
      // 监听背景音频暂停事件
      bgAudioManager.onPause(()=>{
        console.log('onPause')
        // 用以联动自带音频控制台
        this.triggerEvent('musicPause')
      }),
      // 监听背景音频停止事件
      bgAudioManager.onStop(()=>{
        console.log('onStop')
      }),
      // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      // 比如，当拖动进度条，但是音频还没有加载到这个位置，这时就会停止相应的加载，触发该事件
      bgAudioManager.onWaiting(()=>{
        console.log('onWaiting')
      }),
      // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      bgAudioManager.onCanplay(()=>{
        console.log('onCanplay')
        let duration = bgAudioManager.duration
        // console.log('duration: '+duration)
        if ( typeof duration != 'undefined' ){
          // console.log('duration: ' + duration)
          this._setTotalTime()
        }else{ // 如果 duration === undefined
          // 这里有个小坑，隔1秒后 bgAudioManager,duration能够获得准确值
          setTimeout(()=>{
            duration = bgAudioManager.duration
            // console.log('duration: ' + duration)
            this._setTotalTime()
          }, 1000)
        }
      }),
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调
      bgAudioManager.onTimeUpdate(()=>{
        if (!isDragDrop){
          let duration = bgAudioManager.duration;  // 总播放时长
          let currentTime = bgAudioManager.currentTime; // 当前播放时长
          let currentTimeObj = this._durationFormat(currentTime)
          /**
           * 当歌曲播放时，onTimeUpdate事件被触发，
           * 将导致 this.setData() 更新数据过快，会影响性能
           * 因此可以进行一定的优化，使得 每过1秒才更新数据
           */
          if (parseInt(currentTime) != parseInt(currentSec) ){
            this.setData({
              'showTime.currentTime': currentTimeObj.minute + ':' + currentTimeObj.second,
              moveDistance: (currentTime / duration) * (movableAeraWidth - movableViewWidth),
              progress: (currentTime / duration) * 100
            })
            currentSec = currentTime
            // 自定义组件触发事件，引用组件的页面可以监听这些事件
            this.triggerEvent('songTimeChange', {
              currentTime
            })
          }
        }
      }),
      // 监听背景音频播放错误事件
      bgAudioManager.onError((res)=>{
        console.log(res.errMsg)
        console.log(res.errCode)
        wx.showToast({
          icon: 'none',
          title: 'Error: '+res.errCode,
        })
      }),
      // 监听背景音频自然播放结束事件
      bgAudioManager.onEnded(()=>{
        console.log('onEnded')
        // 自定义组件触发事件，引用组件的页面可以监听这些事件
        this.triggerEvent('musicEvent')
      })
    },
    // 将播放时长格式化
    _durationFormat(sec){
      let minute = Math.floor(sec / 60)
      let second = Math.floor(sec % 60)
      if ( minute < 10 ){
        minute = '0' + minute
      }
      if ( second < 10 ){
        second = '0' + second
      }
      return {
        minute: minute,
        second: second
      }
    },
    // 设置总的播放时长
    _setTotalTime(){
      const duration = bgAudioManager.duration
      const durationObj = this._durationFormat(duration)
      // console.log(durationObj)
      this.setData({
        'showTime.totalTime': durationObj.minute + ':' + durationObj.second
      })
    },
    // movable-view拖拽
    onDropDrag(event){
      // console.log(event.detail)
      // 如果是手指拖动，而不是 setData()设置的
      if ( event.detail.source == 'touch' ){
        isDragDrop = true
        let diff = event.detail.x / (movableAeraWidth - movableViewWidth)
        // 将值保存起来，并不会显示在界面中
        this.data.moveDistance = event.detail.x
        this.data.progress = diff * 100
      }
    },
    // 手指拖动离开时触发
    onTouchEnd(){
      isDragDrop = false
      let currentTime = (this.data.progress/100)*bgAudioManager.duration
      let currentTimeObj = this._durationFormat(currentTime)
      this.setData({
        'showTime.currentTime': currentTimeObj.minute + ':' + currentTimeObj.second,
        moveDistance: this.data.moveDistance,
        progress: this.data.progress
      })
      // 音频跳转到指定位置播放 (s)
      bgAudioManager.seek(currentTime)
    }
  }
})