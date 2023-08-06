/*
 * @Author: RONGWEI PENG
 * @Date: 2020-05-06 16:47:17
 * @LastEditTime: 2020-05-08 22:49:01
 * @LastEditors: Do not edit
 * @FilePath: /my__kkb__project/server/app/controller/base.js
 * @Description:
 */
'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  success(data, message = '成功') {
    this.ctx.body = {
      code: 0,
      data,
      message,
    };
  }
  message(message) {
    this.ctx.body = {
      code: 0,
      message,
    };
  }
  error(code = -1, errors = {}, message = '失败') {
    this.ctx.body = {
      code,
      errors,
      message,
    };
  }
}

module.exports = BaseController;
