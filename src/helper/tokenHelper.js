import axios from 'axios'
import apiPath from "@/service/apiPath";

export function getRefreshToken(param) { // 刷新token 注意这里用到的service
  let params = {
    refreshToken: param
  }
  return axios.post(apiPath.REFRESH_TOKEN, params)
    .then((res) => {
      return Promise.resolve(res.data)
    })
}

export function isRefreshTokenExpired(timestamp) {
  clearInterval(window.interval);
  window.interval = setInterval(() => {
    timestamp = timestamp - 1
    sessionStorage.setItem('resetTime', timestamp)
  }, 1000);
}