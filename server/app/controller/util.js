'use strict';

const BaseController = require('./base');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const svgCaptcha = require('svg-captcha');
const chalk = require('chalk');
class UtilController extends BaseController {
  // 图片验证码
  async captcha() {
    const { ctx } = this;
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      ignoreChars: '0o1il', // 验证码字符中排除 0o1i
      noise: 2, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: 'white', // 验证码图片背景颜色
      fontSize: 50,
      width: 100,
      height: 40
    });
    console.log(chalk.green('captcha=>', captcha.text));
    this.ctx.session.captcha = captcha.text;
    this.ctx.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }

  /* 发送邮件 */
  async sendcode() {
    const { ctx } = this;
    // console.log('ctx.request.query=>', ctx.request.query);
    const { email } = ctx.request.query;
    const code = Math.random().toString().slice(2, 6);
    // const email = '18180987910@163.com'; // 接收者的邮箱
    const subject = 'whoelse 邮件';
    const text = '这是一封whoelse邮件';
    const html = `<h2>whoelse的验证码:</h2>
    <span class="elem-a"  >
      ${code}</span>
      `;
    this.ctx.session.emailcode = code;
    const has_send = await this.service.tools.sendMail(email, subject, text, html);

    if (has_send) {
      this.message('发送成功');
      return;
    }
    this.message('失败');
  }

  // 文件下载(image) 流
  async download() {
    const { ctx } = this;
    const filePath = path.resolve(this.config.UPLOAD_DIR, '1.jpg');
    ctx.attachment('1.jpg', { type: 'inline' });
    // 预览图片 ctx.attachment(filename, { type: 'inline' });
    // 下载图片 ctx.attachment(filename); //默认attachment
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = fs.createReadStream(filePath);
  }

  // 图片下载
  /*   async downloadImage() {
    const { ctx } = this;
    const url = 'http://cdn2.ettoday.net/images/1200/1200526.jpg';
    const res = await this.ctx.curl(url, {
      streaming: true,
    });
    ctx.type = 'jpg';
    ctx.body = res.res;
  } */

  // 文件上传
  async uploadfile() {
    // TODO 模拟报错  重新请求次数控制
    /*    if (Math.random > 0.8) {
      return (this.ctx.status = 500);
    } */
    const { ctx } = this;
    const file = ctx.request.files[0];
    const { name } = ctx.request.body;
    const items = fs.readdirSync(this.config.UPLOAD_DIR);
    console.log('uploadfile-items', items);
    console.log('uploadfile-name', name);
    if (items.indexOf(name) < 0) {
      await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename);
      this.success(`/public/${file.filename}`, '上传成功');
    } else {
      this.error(-1, {}, '文件已存在');
    }
  }

  // 切片文件上传
  async uploadfilechunks() {
    const { ctx } = this;
    // TODO 模拟报错  重新请求次数控制
    /*   if (Math.random() > 0.85) {
      return (this.ctx.status = 500);
    } */

    const file = ctx.request.files[0];
    const { name, hash /* chunk, progress  */ } = ctx.request.body;
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
    console.log('console', chunkPath);
    const items = fs.readdirSync(this.config.UPLOAD_DIR);
    const prefixName = name.split('-')[0];
    console.log('console', items, prefixName);
    if (items.indexOf(prefixName + '.jpg') >= 0) {
      this.error(-1, {}, '文件已存在');
      return;
    }

    // 判断切片文件夹是否已存在
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdir(chunkPath);
    }
    await fse.move(file.filepath, `${chunkPath}/${name}`);
    this.message({
      message: '切片文件上传成功'
    });
  }

  // 合并文件切片
  async mergefile() {
    console.log('this.ctx.request.body', this.ctx.request.body);
    const { size, hash, ext } = this.ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    await this.ctx.service.tools.mergeFile(filePath, hash, size);
    /* 
       this.ctx.body = {
      code:0,
      msg:'合并成功'
    }
    */
    this.success({
      url: `/public/${hash}.${ext}`
    });
  }
  // 检查是否已上传或着存在切片
  async checkfile() {
    const { ctx } = this;
    const { hash, ext } = ctx.request.body;
    const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
    let uploaded = false,
      uploadedList = [];
    if (fse.existsSync(filePath)) {
      uploaded = true;
    } else {
      // uploadedList = await this.getUploadedList(this.config.UPLOAD_DIR.hash);
      // 文件没有完全上传完毕，但是可能存在部分切片上传完毕了
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_DIR, hash));
    }
    console.log('uploaded', uploaded);
    this.success({
      code: 0,
      uploaded,
      uploadedList // 过滤诡异的隐藏文件
    });
  }

  async getUploadedList(dirPath) {
    // return fse.existsSync(dirPath) ? await fse.readdirSync(dirPath).filter(name => name[0] !== '') : [];
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.') // 过滤诡异的隐藏文件 比如.DS_store
      : [];
  }
}

module.exports = UtilController;
