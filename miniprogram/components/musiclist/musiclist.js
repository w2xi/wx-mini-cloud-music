// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },
  /**
   * 组件的初始数据
   */
  data: {
    musicid: -1
  },
  // “组件所在页面的生命周期”
  pageLifetimes: {
    // 组件所在的页面被展示时执行，这里的页面指 
    // pages/musiclist/musiclist
    show() {
      this.setData({
        musicid: parseInt(app.getPlayMusicId())
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelected: function(event){
      // 事件源 
      const dataset = event.currentTarget.dataset
      const musicId = parseInt(dataset.musicid)

      let isSameMusic = ( musicId === this.data.musicid ) ? 1 : 0
      const musicIndex = dataset.index 
      this.setData({
        musicid: musicId
      })
      wx.navigateTo({
        url: '../../pages/player/player?musicId='+musicId+'&musicIndex='+musicIndex,
      })
    }
  }
})
