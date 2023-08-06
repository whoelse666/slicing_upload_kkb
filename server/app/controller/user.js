/*
 * @Author: RONGWEI PENG
 * @Date: 2020-05-06 16:47:17
 * @LastEditTime: 2020-05-08 20:37:01
 * @LastEditors: Do not edit
 * @FilePath: /my__kkb__project/server/app/controller/user.js
 * @Description:
 */
'use strict';

const md5 = require('md5');
// const jwt = require('jsonwebtoken')
const BaseController = require('./base');
const HashSalt = ':Kaikeba@good!@123';
const chalk = require('chalk');
const registerRule = {
  email: { type: 'email' },
  password: { type: 'string' },
  checkPass: { type: 'string' },
  nickname: { type: 'string' },
  captcha: { type: 'string' },
};
const loginRule = {
  email: { type: 'email' },
  password: { type: 'string' },
  code: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {
  async login() {
    const { ctx } = this;
    console.log(chalk.blue('emailcode=>', JSON.stringify(ctx.request.body)));

    // try {
    //   ctx.validate(loginRule);
    // } catch (e) {
    //   return this.error('参数校验失败', -1, e.errors);
    // }
    const { email, password, emailcode, captcha } = ctx.request.body;
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误!');
    }
    if (await !this.checkEmail({ email, password: md5(password + HashSalt) })) {
      return this.error('用户密码错误');
    }

    console.log(
      'emailcode !== ctx.session.emailcode',
      emailcode,
      ctx.session.emailcode
    );
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误');
    }

    this.message('登录成功');
  }

  // 注册
  async register() {
    const { ctx } = this;
    try {
      // 检验ctx.query的话，那就ctx.validate({ userName: 'string' }, ctx.query);，params就ctx.params
      ctx.validate(registerRule);
    } catch (e) {
      return this.error('参数校验失败', -1, e.errors);
    }
    const { email, password, checkPass, nickname, captcha } = ctx.request.body;
    const regExp = /^[\u4e00-\u9fa5]+$/; //  \u4e00-\u9fa5 是中文字符的unicode编码
    if (await this.checkEmail({ email })) {
      return this.error('邮箱已存在!');
    }
    if (password !== checkPass) {
      return this.error('两次密码不相同!');
    }

    console.log(
      'console======',
      captcha.toUpperCase(),
      ctx.session.captcha.toUpperCase()
    );
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误!');
    }
    if (!nickname.match(regExp)) {
      return this.error('昵称格式包含非中文!');
    }

    const res = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password + HashSalt),
    });
    if (res._id) {
      this.message('注册成功');
    }
  }

  /**
   * @Name: RONGWEI PENG
   * @Date: 2020-05-08 11:21:19
   * @LastEditTime: Do not edit
   * @Description: 校验邮箱是否已存在
   * @param {email:string}
   * @return: {}
   */
  async checkEmail(data) {
    const user = await this.ctx.model.User.findOne({ ...data });
    console.log('model.User', user);
    return user;
  }
}

module.exports = UserController;
