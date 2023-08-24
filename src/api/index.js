import axios from "axios"
import { OpenNotification } from "../lib/util";


axios.interceptors.response.use(
  response => {
    console.log(response)
    return response
  },
  error => {
    if(error.response && error.response.status == 401) {
      // showLogin()
    }
    return Promise.reject(error);
  }
)

export const baseUrl = 'https://api-beta.ostrich.love'

export function get_without_tips(
  url,
  data
) {
  return new Promise((res, rej) => {
    if(data) {
      let params = []
      for(let i in data) {
        params.push(`${i}=${data[i]}`)
      }
      url+=('?'+params.join('&'))
    }
    axios({
      method: 'get',
      url: url.slice(0, 4) === 'http' ? url : (baseUrl + url),
       headers: {
          'authorization': ''
       }
   }).then(result => {
     console.log(result)
     res(result.data)
 }).catch(err => rej(err))
  })
}
export function get(
  url,
  data
) {
  return new Promise((res, rej) => {
    if(data) {
      let params = []
      for(let i in data) {
        params.push(`${i}=${data[i]}`)
      }
      url+=('?'+params.join('&'))
    }
    axios({
      method: 'get',
      url: url.slice(0, 4) === 'http' ? url : (baseUrl + url),
       headers: {
          'authorization': ''
       }
   }).then(result => {
     console.log(result)
    if (result.data.code == 1){
      res(result.data)
    } else {
     rej(result.data)
     OpenNotification('error', result.data.msg)
    }
 }).catch(err => rej(err))
  })
}
export function post(
  url,
  data
) {
  return new Promise((res, rej) => {
    axios({
      method: 'post',
      url: baseUrl + url,
      data,
      transformRequest: [
         function (data) {
            let ret = ''
            for (let it in data) {
               ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
            return ret
         }
       ],
       headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authorization': ''
       }
   }).then(result => {
     console.log(result)
     console.log(Number(result.code) == 1)
    if(Number(result.data.code) == 1) {
      res(result.data)
    } else {
      rej(result.data)
     }
 }).catch(err => rej(err))
  })
}

export function axios_get(
  url,
  data
) {
  return new Promise((res, rej) => {
    if(data) {
      let params = []
      for(let i in data) {
        params.push(`${i}=${data[i]}`)
      }
      url+=('?'+params.join('&'))
    }
    axios({
      method: 'get',
      url: url
   }).then(result => {
      res(result.data)
 }).catch(err => {
   rej(err)
 })
  })
}