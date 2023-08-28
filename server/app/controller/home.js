/*
 * @Author: WHO ELSE
 * @Date: 2020-05-06 16:47:17
 * @LastEditTime: 2020-05-09 09:41:10
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\server\app\controller\home.js
 * @Description:
 */
'use strict';

// * 如何编写 Controller

// * Controller 类（推荐）
/* const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
}
module.exports = HomeController; */

// *Controller 方法（不推荐使用，只是为了兼容）
exports.index = async ctx => {
  // const createRule = {
  //   title: { type: 'string' },
  //   content: { type: 'string' },
  // };
  // // 校验参数
  // ctx.validate(createRule);
  // // 组装参数
  // const author = ctx.session.userId;
  // const req = Object.assign(ctx.request.body, { author });
  // // 调用 service 进行业务处理
  // const res = await ctx.service.post.create(req);
  // // 设置响应内容和响应状态码
  // ctx.body = { id: res.id };
  // ctx.status = 201;
  ctx.body = 'hi, egg';
};
