// pages/demo/demo.js

// 1. 获取数据库引用
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: ['wxml', 'wxss', 'js', 'json']
  },
  handleTap1() {
    console.log('handleTap1')
  },
  handleTap2() {
    console.log('handleTap2')
  },
  handleTap3() {
    console.log('handleTap3')
  },
  handleTap4() {
    console.log('handleTap4')
  },
  getLocation: function() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude // 纬度
        var longitude = res.longitude // 经度
        console.log(latitude, longitude)
      }
    })
  },
  getMusicInfo: function() {
    // 调用名为 tcbRouter 的云函数，路由名为 music
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: "tcbTouter",
      // 传递给云函数的参数
      data: {
        $url: "music", // 要调用的路由的路径，传入准确路径或者通配符*
      }
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  },
  getMovieInfo: function() {
    // 调用名为 tcbRouter 的云函数，路由名为 movie
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: "tcbTouter",
      // 传递给云函数的参数
      data: {
        $url: "movie", // 要调用的路由的路径，传入准确路径或者通配符*
      }
    }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  },
  swap: function() {
    const x = Math.floor(Math.random() * this.data.arr.length)
    const y = Math.floor(Math.random() * this.data.arr.length)
    const tmp = this.data.arr[x]
    this.data.arr[x] = this.data.arr[y]
    this.data.arr[y] = tmp
    console.log(x, y);
    this.setData({
      arr: this.data.arr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 一次最多取20条数据
    // db.collection('playlist').count().then(res => {
    //   console.log(res)
    //   // for ( let item of res.data ){
    //   //   console.log(item.id)
    //   // }
    // }).catch(err => {
    //   console.log(err)
    // })
    // wx.cloud.callFunction({
    //   name: 'login'
    // }).then((res) => {
    //   console.log(res);
    //   // this.setData({
    //   //   openid: res.result.openid
    //   // });
    // }).catch(err => {
    //   console.log(err);
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    /**
     * js 是单线程的，同一时间只能执行一个任务
     * 对于 异步调用，如 setTimeout(()=>console.log(1), 1000)，js会把他放入一个任务队列中，
     * 由于js的单线程，脚本将继续向下执行，当setTimeout()满足执行条件就会被执行
     */
    // callback hell (回调深渊) 下一个任务的执行依赖是一个任务的完成，形成层层回调，可读性差
    // setTimeout(()=>{
    //   console.log(1)
    //   setTimeout(()=>{
    //     console.log(2)
    //     setTimeout(()=>{
    //       console.log(3)
    //     }, 3000)
    //   }, 2000)
    // }, 1000)

    /**
     * ES6 提出的一种解决方案
     * promise  承诺将来执行
     * 三种状态：
     * pending   初始
     * fulfilled 成功
     * rejected  失败
     * 从初始状态到 成功或失败 状态 是不可逆的
     */
    // new Promise((resolve, rejected) => {
    //   setTimeout(() => {
    //     console.log(1)
    //     resolve() // 执行成功调用，进入后面的 then
    //   }, 1000)
    // }).then((res) => {
    //   setTimeout(() => {
    //     console.log(2)
    //   }, 2000)
    // })

    // let p1 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log('p1')
    //     resolve('p1')
    //   }, 2000)
    // })
    // let p2 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log('p2')
    //     resolve('p2')
    //   }, 1000)
    // })
    // let p3 = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log('p3')
    //     resolve('p3')
    //   }, 3000)
    // })

    // Promise.all([p1, p2, p3]).then((res)=>{ // 任务全部执行成功会进入这里
    //   console.log('全部成功')
    //   console.log(res)
    // }).catch((err)=>{ // 执行失败的任务会进入这里
    //   console.log('失败')
    //   console.log('erroe', err)
    // })

    // Promise.race([p1, p2, p3]).then((res) => { // 只有最先完成的任务会进入这里
    //   console.log('成功')
    //   console.log(res)
    // }).catch((err) => { // 执行失败的任务会进入这里
    //   console.log('失败')
    //   console.log('erroe', err)
    // })

    /**
     * async / await  ES7 用法
     */
    // this.foo()
  },

  async foo() {
    console.log('foo')
    // this.timeout() 返回一个 promise对象
    // 加了 await 后 使其等待，直到执行完毕后再执行后面的语句
    const res = await this.timeout()
    console.log(res)
  },
  timeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(1)
        resolve('resolved')
      }, 3000)
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})