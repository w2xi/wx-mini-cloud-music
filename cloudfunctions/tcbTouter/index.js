// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  // app.use 表示该中间件会适用于所有的路由
  app.use(async (ctx, next) => {
    ctx.data = {};
    ctx.data.openId = event.userInfo.openId;
    await next(); // 执行下一中间件
  });
  // 路由为字符串，该中间件只适用于 music 路由
  app.router('music', async (ctx, next) => {
    ctx.data.name = '梦中的婚礼';
    await next(); // 执行下一中间件
  }, async (ctx, next) => {
    ctx.data.type = '轻音乐';
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  });
  // 路由为字符串，该中间件只适用于 movie 路由
  app.router('movie', async (ctx, next) => {
    ctx.data.name = '最近妹妹的样子有点奇怪';
    await next(); // 执行下一中间件
  }, async (ctx, next) => {
    ctx.data.type = '日漫';
    await next(); // 执行下一中间件
  }, async (ctx) => {
    // ctx.body 返回数据到小程序端
    ctx.body = { code: 0, data: ctx.data };
  });

  return app.serve();
}