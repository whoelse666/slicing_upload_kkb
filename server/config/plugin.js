/*
 * @Author: WHO ELSE
 * @Date: 2020-04-13 20:37:46
 * @LastEditTime: 2023-08-08 16:10:04
 * @LastEditors: pengrongwei
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
