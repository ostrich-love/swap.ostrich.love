import harwell_axios from './harwellAxios';


export const getListData = (data) => {
  let url = '/harwell/marketplace/listItems'
    if(data) {
        let params = []
        for(let i in data) {
          params.push(`${i}=${data[i]}`)
        }
        url+=('?'+params.join('&'))
    }
    return harwell_axios.get(url)
}