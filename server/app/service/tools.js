/*
 * @Author: RONGWEI PENG
 * @Date: 2020-05-08 17:02:22
 * @LastEditTime: 2023-08-06 23:35:47
 * @LastEditors: pengrongwei
 * @FilePath: \my__kkb__project\server\app\service\tools.js
 * @Description:
 */

'use strict';

const { Service } = require('egg');
const nodemailer = require('nodemailer');

const path = require('path');
const fse = require('fs-extra');
// const chalk = require('chalk');

// 配置发送验证码邮箱的权限
const user_email = '347300979@qq.com';
const auth_code = 'mpkohupkdlqrbgfi';


const transporter = nodemailer.createTransport({
  service: 'qq',
  secureConnection: true,
  port: 465,
  auth: {
    user: user_email, // 账号
    pass: auth_code, // 授权码
  },
});

class ToolService extends Service {
  // 发送邮件
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: user_email, // 发送者,与上面的user一致
      to: email, // 接收者,可以同时发送多个,以逗号隔开
      subject, // 标题
      text, // 文本
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return false;
    }
  }

  // *合并文件-处理路径
  async mergeFile(filePath, fileHash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, fileHash); // 切片文件夹
    let chunks = await fse.readdir(chunkDir); // *返回文件夹下所有文件
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    chunks = chunks.map(cp => path.resolve(chunkDir, cp));
    await this.mergeChunks(chunks, filePath, size);
  }

  // *合并文件
  async mergeChunks(chunks, src, chunkSize) {
    const pipStream = (filePath, writeStream) =>
      new Promise(resolve => {
        const readStream = fse.createReadStream(filePath);
        readStream.on('end', () => {
          fse.unlinkSync(filePath);
          resolve();
        });
        readStream.pipe(writeStream);
      });

    await Promise.all(
      chunks.map((file, index) => {
        return pipStream(
          file,
          fse.createWriteStream(src, {
            start: index * chunkSize,
            end: (index + 1) * chunkSize,
          })
        );
      })
    );
  }
}

module.exports = ToolService;
