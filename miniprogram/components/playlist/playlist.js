// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },
  // 数据监听器
  observers: {
    // 监听 playCount 的变化
    'playlist.playCount': function(count){
      this.setData({
        _count: this._transCount(count, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    moveToMusicList: function(){
      wx.navigateTo({
        url: '../../pages/musiclist/musiclist?id='+this.properties.playlist.id
      })
    },
    _transCount: function(count, point){
      let result = count
      let numIntStr = count.toString().split('.')[0]
      if ( numIntStr.length >= 6 && numIntStr.length <= 8 ){
        // 123456
        let decimal = numIntStr.substr(numIntStr.length - 4, point)
        result = parseInt(count/10000) + '.' + decimal + '万'
      }else if ( numIntStr.length > 8 ){
        let decimal = numIntStr.substr(numIntStr.length - 8, point)
        result = parseInt(count/100000000) + '.' + decimal + '亿'
      }
      return result
    }
  } 
})
