import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import NFTAirdrop from '../abi/NFTAirdrop'
import { createProviderController } from '../../wallet/createProviderController'
import * as SIDFunctions from '@siddomains/sidjs'
import { default as SID } from '@siddomains/sidjs'    
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
const chainMap={
  'bsc': {
    httpProviderURL: 'https://bsc-dataseed.binance.org/',
    chainId: 56
  },
  'arb': {
    httpProviderURL: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161
  }
}
export async function getDomain (name) {
  const rpc  = chainMap['bsc'].httpProviderURL 
  const provider = new Web3.providers.HttpProvider(rpc)
  const chainId = chainMap['bsc'].chainId
  let sid = new SID({ provider, sidAddress: SIDFunctions.getSidAddress(chainId) })
  return await sid.name(name).getAddress()                                                                                  
}
export async function resolveDomain (address) {
  const rpc  = chainMap['bsc'].httpProviderURL 
  const provider = new Web3.providers.HttpProvider(rpc)
  const chainId = chainMap['bsc'].chainId
  let sid = new SID({ provider, sidAddress: SIDFunctions.getSidAddress(chainId) })
  return await sid.getName(address)                                                                                  
}


export function queryUserTokenId(user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(NFTAirdrop, findAddressByName('NFTAirdrop')).methods.queryUserTokenId(user).call()
}
export function queryClaimCount() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(NFTAirdrop, findAddressByName('NFTAirdrop')).methods.queryClaimCount().call()
}
export function claim(
  signature
) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      new web3.eth.Contract(NFTAirdrop, findAddressByName('NFTAirdrop')).methods.claim(signature).estimateGas({from: address}).then(async(resp)=>{
        let gas_price = await web3.eth.getGasPrice()*1.2/1000000000
        console.log(resp)
        new web3.eth.Contract(NFTAirdrop, findAddressByName('NFTAirdrop')).methods.claim(signature).send({from: address, gas: resp, gasPrice: Math.ceil(gas_price*1000000000)}).on('transactionHash', function(hash) {
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
