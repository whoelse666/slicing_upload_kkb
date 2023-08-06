/*
 * @Author: RONGWEI PENG
 * @Date: 2020-04-13 20:37:46
 * @LastEditTime: 2020-05-12 23:06:02
 * @LastEditors: Do not edit
 * @Description:
 */
'use strict';

/** @type Egg.EggPlugin */
/* module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
}; */

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

/* 接口校验 */
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
