import axios from './myAxios';
import harwell_axios from './harwellAxios';
import qs from 'qs';

export const reqKlineList = (params) => axios({
  method: 'GET',
  url: '/api/evm/swap/kline',
  params: qs.parse(params)
})
export const reqTrendlineList = (params) => axios({
  method: 'GET',
  url: '/api/evm/swap/trendLine',
  params: qs.parse(params)
})
export const reqTokensConstant = (params) => axios({
  method: 'GET',
  url: '/api/evm/swap/tokens',
  params: qs.parse(params)
})

export const reportSuccess = (params) => {
  return harwell_axios.post('/aptos/transaction/report', params)
}