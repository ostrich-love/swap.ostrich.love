import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import SwapAggregator from '../abi/SwapAggregator'
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


export function getAmountOut(path, tokenAmountIn) {
  // let paths = path.map(item => item =='Orich'?'OSTR':item)
  console.log(path, tokenAmountIn)
  // let bytes32Path = path.map((item) => stringToBytes32(item))
  const web3 = createCurWeb3()
  return new web3.eth.Contract(SwapAggregator, findAddressByName('SwapAggregator')).methods.getAmountOut(path, tokenAmountIn).call()
}
export function getAmountIn(path, tokenAmountOut) {
  console.log(path, tokenAmountOut)
  // let bytes32Path = path.map((item) => stringToBytes32(item))
  const web3 = createCurWeb3()
  return new web3.eth.Contract(SwapAggregator, findAddressByName('SwapAggregator')).methods.getAmountIn(path, tokenAmountOut).call()
}

export function swap(
  amountIn,
  amountOutMin,
  path,
  deadline,
  method,
  cb
) {
  return new Promise(async (res, rej) => {
    console.log(
      amountIn,
      amountOutMin,
      path,
      deadline,
      method,
      cb
    )
    try {
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let value = 0
      if (path[0] === ZERO_ADDRESS) {
        value = amountIn;
      }
      // if (path.includes('WE') && path[path.length-1] !== 'WE') {
      //   method = 'swapExactTokenForTokenSupportingFeeOnTransferTokens';
      // }
      console.log(method)
      // let bytes32Path = path.map((item) => stringToBytes32(item))
      new web3.eth.Contract(SwapAggregator, findAddressByName('SwapAggregator')).methods[method](
        path,
        amountIn,
        amountOutMin,
        store.getState().account,
        web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + Number(deadline || 180) * 60)
      ).estimateGas({ from: address, value }).then(async (resp) => {
        let gas_price = await web3.eth.getGasPrice() * 1.3 / 1000000000
        console.log(resp)
        new web3.eth.Contract(SwapAggregator, findAddressByName('SwapAggregator')).methods[method](
          path,
          amountIn,
          amountOutMin,
          store.getState().account,
          web3.utils.numberToHex(Math.floor(new Date().getTime() / 1000) + Number(deadline || 180) * 60)
        ).send({ from: address, value, gas: resp, gasPrice: Math.ceil(gas_price * 1000000000) }).on('transactionHash', function (hash) {
          console.log(hash)
        })
          .on('receipt', (result) => {
            OpenNotification('success', 'Transaction Successful', 'success')
            res()
            cb && cb()
            // addHistory(`Swap ${toFixed(fromUnit(amountIn), 4)} ${path[0]} for ${toFixed(fromUnit(result.events.SWAP.returnValues.amountOut), 4)} ${path[path.length-1]} `, result.transactionHash)
          }).on('error', function (error) {
            console.log(error)
            // OpenNotification('error', 'error', 'Transaction Failed')
            rej(error);
          })
          .catch((error) => {
            let msg = error.code == -32603 ? 'Insufficient funds for gas * price + value': (error.data.message||'Transaction Failed')
            OpenNotification('error', 'error', msg)
            rej(error);
          });

      })

    } catch (err) {
      rej(err);
    }
  })
}

// approve
export const approve = async (tokenaddress, contractAddress) => {
  return new Promise(async (res, rej) => {
    try {
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const handler = new web3.eth.Contract(bep20ABI, tokenaddress).methods.approve(contractAddress, MaxUint256)
      handler.estimateGas({ from: address }).then(async (resp) => {
        let gas_price = await web3.eth.getGasPrice() * 1.3 / 1000000000
        handler.send({ from: address, gas: resp, gasPrice: Math.ceil(gas_price * 1000000000) })
          .on('transactionHash', function () {
          })
          .on('receipt', function (result) {
            res(Number(MaxUint256.toString()))
            OpenNotification('success', 'Approve Successful', 'success')
          }).on('error', function (error) {
            OpenNotification('error', 'error', 'Transaction Failed')
            rej(error);
          })
          .catch((error) => {
            OpenNotification('error', 'error', 'Transaction Failed')
            rej(error);
          });

      })
    } catch (err) {
      rej(err);
    }
  })
}
export function allowance(
  address,
  contractAddress
) {
  const web3 = createCurWeb3()
  if (address == ZERO_ADDRESS) {
    return MaxUint256
  }
  return new web3.eth.Contract(bep20ABI, address).methods.allowance(store.getState().account, contractAddress).call()
}