/*
 * @Author: WHO ELSE
 * @Date: 2020-05-07 17:24:55
 * @LastEditTime: 2020-05-08 13:53:34
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\server\app\model\user.js
 * @Description:
 */
'use strict'
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const UserSchema = new Schema(
    {
      __v: {
        type: Number,
        select: false,
      },
      email: {
        type: String,
        required: true,
      },
      nickname: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },
      avatar: {
        type: String,
        required: false,
        default: '/user.png',
      },
    },
    { timestamps: true }
  )
  return mongoose.model('User', UserSchema, 'kkbhub') // 返回model，其中kkbhub为数据库中表的名称
}
