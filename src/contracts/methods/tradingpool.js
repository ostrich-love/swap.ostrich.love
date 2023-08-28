import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import RewardUnlocker from '../abi/RewardUnlocker'
import FlexiblePool from '../abi/FlexiblePool'
import TradingPool from '../abi/Tradingpoolv2'
import { createProviderController } from '../../wallet/createProviderController'
import { MaxUint256 } from '@ethersproject/constants'
import { erc721ABI } from '../abi/erc721'

let httpProviderURL = getNetwork().httpProviderURL


export const web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL))
function createWeb3(chain) {
  return new Web3(new Web3.providers.HttpProvider(httpProviderURL))
}

function createCurWeb3() {
  const chain = store.getState().chain
  return createWeb3(chain)
}

// / 将string转成bytes32
const stringToBytes32 = (s) => {
  let result = web3.utils.fromAscii(s);
  while (result.length < 66) {
    result = result + "0";
  }
  return result;
}



export function queryRewardToken() {
  const web3 = createCurWeb3()
  return findAddressByName('TradingPoolV2') ? new web3.eth.Contract(TradingPool, findAddressByName('TradingPoolV2')).methods.queryRewardToken().call():0
}
export function queryAllPoolViews() {
  const web3 = createCurWeb3()
  return findAddressByName('TradingPoolV2')?new web3.eth.Contract(TradingPool, findAddressByName('TradingPoolV2')).methods.queryAllPoolViews().call():[]
}
export function queryAllUserPoolViews(user) {
  const web3 = createCurWeb3()
  return findAddressByName('TradingPoolV2')?new web3.eth.Contract(TradingPool, findAddressByName('TradingPoolV2')).methods.queryAllUserPoolViews(user).call():[]
}

export function queryUserStakePoints(user) {
  const web3 = createCurWeb3()
  return findAddressByName('TradingPoolV2')?new web3.eth.Contract(TradingPool, findAddressByName('TradingPoolV2')).methods.queryUserStakePoints(user).call():0
}
export function claim () {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(TradingPool, findAddressByName('TradingPoolV2')).methods.claimAll()
      let msg = {from: address}
      hanlder.estimateGas(msg).then(async(resp)=>{
        console.log(resp)
        let gas_price = await web3.eth.getGasPrice()*1.2/1000000000
        hanlder.send({...msg, gas: resp, gasPrice: Math.ceil(gas_price*1000000000)})
     .on('transactionHash', function(hash) {
      // res({transactionHash:hash})
     })
     .on('receipt', function(result){
      res({transactionHash:result.transactionHash})
      OpenNotification('success', 'Successful', 'success')
      
     }).on('error', function (error) {
       rej(error);
     })
     .catch((error) => {
       rej(error);
     });
    })
    .catch((error) => {
      rej(error);
    });
   } catch (err) {
     rej(err);
   }
  })
}

