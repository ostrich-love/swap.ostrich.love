import axios from './myAxios';

// 创建IDOProject
export const reqCreateProject = (params) => axios.post('/harwell/project', params)
// 获取list
export const loadProjectList = (data) => {
    let url = '/harwell/projectList'
    if(data) {
        let params = []
        for(let i in data) {
          params.push(`${i}=${data[i]}`)
        }
        url+=('?'+params.join('&'))
    }
    return axios.get(url)
} 
// 获取单个项目
export const getProject = (data) => {
    let url = '/harwell/project'
    if(data) {
        let params = []
        for(let i in data) {
          params.push(`${i}=${data[i]}`)
        }
        url+=('?'+params.join('&'))
    }
    return axios.get(url)
} 