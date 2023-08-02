import axios from "axios"
import { message } from 'antd'
// import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();
const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? '/' : process.env.REACT_APP_API,
    timeout: 30000,
})
// http request 拦截器
// instance.interceptors.request.use(
//   config => {
//       const token = sessionStorage.getItem('token')
//       if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
//           config.headers['x-token'] = token  //请求头加上token
//       }
//       return config
//   },
//   err => {
//     message.error(err.message)
//     return Promise.reject(err)
// })

// http response 拦截器
// instance.interceptors.response.use(
//     response => {
//         const { code, data, msg } = response.data;
//         // 全局错误处理
//         if (code === 7 && msg === "未登录或非法访问") {
//             message.error(msg);
//             history.push('/login')
//         }
//         return response.data;
//     },
//     //接口错误状态处理，也就是说无响应时的处理
//     error => {
//         message.error(error.msg)
//         return Promise.reject(error)
//     })

export default instance;