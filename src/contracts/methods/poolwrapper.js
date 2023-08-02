import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { SyncSwapClassicPoolFactory as SyncSwapClassicPoolFactoryContract, getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import PoolWrapper from '../abi/PoolWrapper'
import { createProviderController } from '../../wallet/createProviderController'
import { MaxUint256 } from '@ethersproject/constants'
import SyncSwapClassicPoolFactory from '../abi/SyncSwapClassicPoolFactory'

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


export function getReserves(pool) {
  const web3 = createCurWeb3()
  console.log(pool)
  return new web3.eth.Contract(PoolWrapper, findAddressByName(pool.t?'SyncswapPoolWrapper':'UniswapV2PoolWrapper')).methods.getReserves(pool.address).call()
}

export function getSyncPool (token1, token2) {
    const web3 = createCurWeb3()
    return new web3.eth.Contract(SyncSwapClassicPoolFactory, SyncSwapClassicPoolFactoryContract).methods.getPool(token1, token2).call()  
}