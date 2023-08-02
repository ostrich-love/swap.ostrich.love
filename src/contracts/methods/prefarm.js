import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import BOrichPool from '../abi/BOrichPool'
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


export function queryPoolInfo(address) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.queryPoolInfo(address).call()
}
export function queryAllPoolInfos() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.queryAllPoolInfos().call()
}
export function queryUserPoolInfo(pool, user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.queryUserPoolInfo(pool, user).call()
}
export function queryAllUserPoolInfos(user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.queryAllUserPoolInfos(user).call()
}

// approve
export const approve = async (tokenaddress, contractAddress) => {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(bep20ABI, tokenaddress).methods.approve(contractAddress, MaxUint256)
      .send({from: address})
      .on('transactionHash', function() {
      })
      .on('receipt', function(result){
        OpenNotification('success', 'Successful', 'success')
        res(Number(MaxUint256.toString()))
      }).on('error', function (error) {
        console.log(error)
        rej(error);
      })
      .catch((error) => {
        rej(error);
      });
    } catch (err) {
      rej(err);
    }
  })
}
export function allowance (
  address,
  contractAddress
) {
  const web3 = createCurWeb3()
  if(address == ZERO_ADDRESS) {
    return MaxUint256
  }
  return new web3.eth.Contract(bep20ABI, address).methods.allowance(store.getState().account, contractAddress).call()
}

// reduce流动性
export function deposit (amount, pool) {
    console.log(amount, pool)
    return new Promise(async (res, rej) => {
      try{
        const provider = await createProviderController().connect()
        const web3 = new Web3(provider)
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        let hanlder = new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.deposit(
          pool, amount
        )
        let value = pool == ZERO_ADDRESS ? {value: amount}: {}
        let msg = {from: address, ...value}
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
export function claim (token) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.claim(token)
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


export function withdraw (amount, token) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(BOrichPool, findAddressByName('BOrichPool')).methods.withdraw(token, amount)
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