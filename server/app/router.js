/*
 * @Author: WHO ELSE
 * @Date: 2020-05-06 16:47:17
 * @LastEditTime: 2020-08-12 14:09:02
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\server\app\router.js
 * @Description:
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // *controller.util
  router.get('/captcha', controller.util.captcha); // 图片验证码
  router.get('/sendcode', controller.util.sendcode); // 邮箱验证码
  router.get('/download', controller.util.download); //  文件下载
  // router.get('/downloadImage', controller.util.downloadImage); //  图片下载
  router.post('/uploadfile', controller.util.uploadfile); // 普通的文件上传
  router.post('/uploadfilechunks', controller.util.uploadfilechunks); // 切片的文件上传
  router.post('/mergefile', controller.util.mergefile); // 文件合并
  // *controller.user
  router.post('/register', controller.user.register); // 注册
  router.post('/login', controller.user.login); // 登录
};
