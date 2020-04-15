// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({event})

  app.router('bloglist', async (ctx, next)=>{
    const keywords = event.keywords
    let w = {}
    if ( keywords.trim() != '' ){
      w = {
        content: db.RegExp({
          regexp: keywords,
          options: 'i'
        })
      }
    }
    ctx.body = await db.collection('blog')
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res)=>{
        return res
      })
  })

  app.router('blogItem', async(ctx, next)=>{
    ctx.body = await db.collection('blog')
      .where({_id: event.blogId})
      .get()
      .then((res)=>{
        return res
      })
  })

  app.router('blogComment', async(ctx, next)=>{
    ctx.body = await db.collection('comment')
      .where({blog_id: event.blog_id})
      .orderBy('createTime', 'desc')
      .get()
      .then((res)=>{
        return res
      })
  }),

  app.router('myBlog', async(ctx, next)=>{
    ctx.body = await db.collection('blog')
      .where({ _openid: wxContext.OPENID })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  return app.serve()
}