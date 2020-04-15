// 发布内容字数的最大数量 
const MAX_WORDS_NUM = 140
// 最多可以发布的图片数量
const MAX_IMAGE_NUM = 9
// 发布内容
let content = ''
// 用户昵称
let nickname = ''
// 用户头像
let avatar = ''
// 初始化云数据库引用
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentLen: 0, // 内容长度
    images: [], // 要发布的图片
    footerBottom: 0, // footer标签 距离底部的 bottom
    isShowAddIcon: true, // 是否显示添加图片的图标
  },
  // 提交发布
  submitRelease() {
    if (!content.trim()) {
      wx.showToast({
        icon: 'none',
        title: '请说点什么吧...',
      })
      return;
    }

    wx.showLoading({
      title: '发布中',
      mask: true
    })
    // 将文件上传到云存储
    let promiseArr = []
    // 文件id
    let fileIdArr = []
    for (let item of this.data.images) {
      promiseArr.push(new Promise((reselve, reject) => {
        let suffix = /\.\w+$/.exec(item)[0]; // 获取图片url后缀
        wx.cloud.uploadFile({
          cloudPath: 'blog/'+new Date().getTime() + '-' + Math.random()*100000 + suffix,
          filePath: item, // 文件路径
        }).then(res => {
          fileIdArr = fileIdArr.concat(res.fileID)
          reselve()
        }).catch(error => {
          // handle error
          console.log(error)
          reject()
        })
      }))
    }

    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({
        data: {
          nickname,
          avatar,
          content: content,
          img: fileIdArr,
          createTime: db.serverDate()
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          icon: 'success',
          title: '发布成功',
        })
        // 获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
        const pages = getCurrentPages()
        // console.log(pages)
        setTimeout(function () {
          wx.navigateBack({
            
          })
          pages[0].setData({
            blogList: [],
            keywords: '',
          })
          pages[0]._loadBlogInfo()
        }, 500);
      }).catch((err)=>{
        wx.hideLoading()
        console.log(err)
      })
    }).catch((err)=>{
      wx.hideLoading()
      console.log(err)
    })
  },
  // 预览图片
  onPreview(event) {
    let currentUrl = event.currentTarget.dataset.imgsrc
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  // 选择要发布的图片
  addImage() {
    // 最多还可以选择的图片数量
    let maxSelectedImgNum = MAX_IMAGE_NUM - this.data.images.length
    wx.chooseImage({
      count: maxSelectedImgNum, // 用户每次选择，最多可以选择的图片张数 (动态变化)
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res.tempFilePaths)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 最多还可以选择的图片数量
        maxSelectedImgNum = MAX_IMAGE_NUM - this.data.images.length
        this.setData({
          isShowAddIcon: maxSelectedImgNum <= 0 ? false : true
        })
      }
    })
  },
  // 移除预览的图片
  removeImg(event) {
    // console.log(event)
    let index = event.currentTarget.dataset.index
    // 移除对应索引的图片
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMAGE_NUM - 1) {
      this.setData({
        isShowAddIcon: true
      })
    }
  },
  contentChange(event) {
    // console.log(event.detail.value)
    content = event.detail.value
    let contentLen = content.length
    if (contentLen >= MAX_WORDS_NUM) {
      contentLen = "字数最多为 " + contentLen
    }
    this.setData({
      contentLen
    })
  },
  // 聚焦
  onFocus(event) {
    // console.log(event.detail.height)
    // 模拟器获取的 键盘高度 为0，可以在真机上测试
    this.setData({
      footerBottom: event.detail.height
    })
  },
  // 失去焦点
  onBlur(event) {
    this.setData({
      footerBottom: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    nickname = options.nickname
    avatar = options.avatar
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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