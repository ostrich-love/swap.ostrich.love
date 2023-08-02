import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import { erc20ABI } from '../abi/erc20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import SwapRouter from '../abi/SwapRouter'
import SwapFactory from '../abi/SwapFactory'
import { createProviderController } from '../../wallet/createProviderController'
import { MaxUint256 } from '@ethersproject/constants'
import { Pair } from '../abi/pair'

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

export function getReserves (token) {
  console.log(token)
  return new web3.eth.Contract(Pair, token).methods.getReserves().call()
}
export function getLpAmounts (address) {
  return new web3.eth.Contract(erc20ABI, address).methods.totalSupply().call()
}

export function allPairs () {
  return new web3.eth.Contract(SwapFactory, findAddressByName('SwapFactory')).methods.allPairs(1)
}
export function getPair (a, b) {
  return new web3.eth.Contract(SwapFactory, findAddressByName('SwapFactory')).methods.getPair(a, b)
}
// 增加流动性
export function addLiq ( 
  tokenA,
  tokenB,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  isETH
  ) {
    console.log(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      isETH
    )
    return new Promise(async (res, rej) => {
      try{
        const provider = await createProviderController().connect()
        const web3 = new Web3(provider)
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        
        let hanlder = isETH ? (
            new web3.eth.Contract(SwapRouter, findAddressByName('SwapRouter')).methods.addLiquidityETH(
              tokenA,
              amountADesired,
              amountAMin,
              amountBMin,
              store.getState().account,
              web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + 15 * 60)
            )
          ):(
            new web3.eth.Contract(SwapRouter, findAddressByName('SwapRouter')).methods.addLiquidity(
              tokenA,
              tokenB,
              amountADesired,
              amountBDesired,
              amountAMin,
              amountBMin,
              store.getState().account,
              web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + 15 * 60)
          )
        )
        console.log(
          tokenA,
              tokenB,
              amountADesired,
              amountBDesired,
              amountAMin,
              amountBMin,
              store.getState().account,
              web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + 15 * 60)
        )
       let msg = isETH ? {from: address, value:amountBDesired}:{from: address}
       console.log('wozhixingdaozhele')
       console.log(msg)
       hanlder.estimateGas(msg).then(async(resp)=>{
        // console.log(resp)
        let gas_price = await web3.eth.getGasPrice()*1.2/1000000000
        hanlder.send({...msg, gas: resp, gasPrice: Math.ceil(gas_price*1000000000)})
        // hanlder.send({...msg})
       .on('transactionHash', function(hash) {
        //  res({transactionHash:hash})
       })
       .on('receipt', function(result){
        res({transactionHash:result.transactionHash})
        OpenNotification('success', 'Successful', 'success')
      }).on('error', function (error) {
        console.log(error)
         rej(error);
       })
       .catch((error) => {
         console.log(error)
         rej(error);
       });
       }).catch((error) => {
        console.log(error)
        rej(error);
      });
       
       
       
     } catch (err) {
      console.log(err)
       rej(err);
     }
    })
}
// reduce流动性
export function reduceLiq ( 
  tokenA,
  tokenB,
  liquidity,
  amountAMin,
  amountBMin,
  isETH
  ) {
    console.log(tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      store.getState().account,
      web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + 15 * 60))
    return new Promise(async (res, rej) => {
      try{
        const provider = await createProviderController().connect()
        const web3 = new Web3(provider)
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        let hanlder = isETH ? (
          new web3.eth.Contract(SwapRouter, findAddressByName('SwapRouter')).methods.removeLiquidityETH(
            tokenA,
            liquidity,
            amountAMin,
            amountBMin,
            store.getState().account,
            web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + 15 * 60)
          )
        ):(
          new web3.eth.Contract(SwapRouter, findAddressByName('SwapRouter')).methods.removeLiquidity(
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            store.getState().account,
            web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + 15 * 60)
          )
        )
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