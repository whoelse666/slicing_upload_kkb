/*
 * @Author: WHO ELSE
 * @Date: 2020-04-13 20:37:46
 * @LastEditTime: 2023-08-06 20:17:33
 * @LastEditors: pengrongwei
 * @Description
 */
/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1586765212061_629'; // 静态资源，上传文件存储路径 // add your middleware config here

  /* 文件上传需要打开以下配置 */
  config.multipart = {
    mode: 'file',
    whitelist: () => true // 白名单，默认所有格式
  };

  config.UPLOAD_DIR = path.resolve(__dirname, '../app/public'); // config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      // 添加该项，放开post请求
      csrf: {
        enable: false
      }
    },
    // mongoose: {
    //   client: {
    //     url: 'mongodb://127.0.0.1:27017:kkbhub',
    //     options: {}
    //   }
    // },
    jwt: {
      secret: '@kaikeba!123'
    }
  };
};
