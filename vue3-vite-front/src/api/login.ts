import request from '@/http/request';
const pre = '/system/info';
// 登录方法

export type LoginType = {
  username: string;
  password: string;
  code: string;
  uuid: string;
};
export function login(data: LoginType) {
  return request({
    url: pre + '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

// 注册方法
export type registerType = {
  username: string;
  password: string;
};
export function register(data: registerType) {
  return request({
    url: '/system/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  });
}

// music
export function getMusic() {
  return request({
    url: '/wyy/music?id=557731988&type=song&media=netease',
    method: 'get'
  });
}
// 获取用户详细信息
export function getInfo() {
  return request({
    url: pre + '/getInfo',
    method: 'get'
  });
}

