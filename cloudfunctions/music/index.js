// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')

const BASE_URL = 'http://musicapi.xiecheng.live'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  // 路由为字符串，该中间件只适用于 playlist 路由
  // 推荐歌单
  app.router('playlist', async(ctx, next) => {
    // ctx.body 返回数据到小程序端
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })
  // 歌曲列表
  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail' + '?id=' + event.id).then((res) => {
      return JSON.parse(res)
    }).catch((err) => {
      return err
    })
  })
  // 歌曲信息
  app.router('songInfo', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/song/url?id=' + event.musicId).then((res) => {
      return JSON.parse(res)
    }).catch((err) => {
      return err
    })
  })
  // 歌词
  app.router('lyric', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/lyric/url?id=' + event.musicId).then((res) => {
      return JSON.parse(res)
    })
  })

  return app.serve()
}