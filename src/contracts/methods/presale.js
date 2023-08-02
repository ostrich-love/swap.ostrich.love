import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import Presale from '../abi/Presale'
import { createProviderController } from '../../wallet/createProviderController'
import { MaxUint256 } from '@ethersproject/constants'

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



export function queryUserInfo(user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.queryUserInfo(user).call()
}
export function queryPrice(c) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.queryPrice(c).call()
}
export function queryUsdAmount(currency, amount) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.queryUsdAmount(currency, amount).call()
}

export function queryGlobalView() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.queryGlobalView().call()
}
export function buy(
  currency,
  amount,
  signature
) {
  return new Promise(async (res, rej) => {
    console.log(currency,
      amount,
      signature)
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.buy(currency, amount, signature).estimateGas({from: address}).then(async(resp)=>{
        let gas_price = await web3.eth.getGasPrice()*1.2/1000000000
        console.log(resp)
        new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.buy(currency, amount, signature).send({from: address, gas: resp, gasPrice: Math.ceil(gas_price*1000000000)}).on('transactionHash', function(hash) {
          console.log(hash)
        })
        .on('receipt',(result) => {
          OpenNotification('success', 'Successful', 'success')
          res()
        }).on('error', function (error) {
          rej(error);
        })
        .catch((error) => {
          rej(error);
        });

      })
      
    } catch (err) {
      rej(err);
    }
  })
}

export function claim() {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.claim().estimateGas({from: address}).then(async(resp)=>{
        let gas_price = await web3.eth.getGasPrice()*1.2/1000000000
        console.log(resp)
        new web3.eth.Contract(Presale, findAddressByName('Presale')).methods.claim().send({from: address, gas: resp, gasPrice: Math.ceil(gas_price*1000000000)}).on('transactionHash', function(hash) {
          console.log(hash)
        })
        .on('receipt',(result) => {
          OpenNotification('success', 'Successful', 'success')
          res()
        }).on('error', function (error) {
          rej(error);
        })
        .catch((error) => {
          rej(error);
        });

      })
      
    } catch (err) {
      rej(err);
    }
  })
}

