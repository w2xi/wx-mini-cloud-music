// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const MAX_LIMIT = 100
const db = cloud.database()

const rp = require('request-promise')
const URL = "http://musicapi.xiecheng.live/personalized"
// 云函数入口函数
exports.main = async(event, context) => {
    // 调用api接口，获取歌单数据
    const playlist = await rp(URL).then((res) => {
      return JSON.parse(res).result
    })
    // 从数据库中获取歌单信息(云函数中一次最多从数据库中取100条数据)
    // 集合中记录总数
    const total = await db.collection('playlist').count().then((res)=>{
      return res.total
    })
    // 计算需要分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的 promise 的数组
    let tasks = []
    for (let i = 0; i < batchTimes; i++) {
      let promise = db.collection('playlist').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    let playlistInDb = {
      data: []
    }
    if ( tasks.length > 0 ){
      // 等待所有
      playlistInDb = (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
          data: acc.data.concat(cur.data),
          // errMsg: acc.errMsg,
        }
      })
    }
    /**
     * 调用api接口获取的数据可能会和已经存入数据库中的数据 重合，因此要做 去重 操作
     */
    let newPlaylist = []
    // 去重操作
    for (let item1 of playlist) {
      let flag = true
      for (let item2 of playlistInDb.data) {
        if (item1.id === item2.id) {
          flag = false
          break
        }
      }
      if (flag) newPlaylist.push(item1)
    }
    // 将数据插入到 数据库
    for (let item of newPlaylist) {
      // 插入数据的过程是一个异步操作，使用 await 使其一条条插入
      await db.collection('playlist').add({
        data: {
          ...item,
          createTime: db.serverDate()
        }
      }).then((res) => {
        console.log('插入成功')
      }).catch((err) => {
        console.log(err)
      })
    }

  return newPlaylist.length
}