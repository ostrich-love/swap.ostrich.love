import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { OpenNotification, ZERO_ADDRESS, findAddressByName } from '../../lib/util'
import FixedPool from '../abi/FixedPool'
import RewardUnlocker from '../abi/RewardUnlocker'
import FlexiblePool from '../abi/FlexiblePool'
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


export function queryPool(type, name) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(type=='fixed'?FixedPool:FlexiblePool, findAddressByName(name)).methods.queryPool().call()
}
export function queryUserDeposition(type, user, name) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(type=='fixed'?FixedPool:FlexiblePool, findAddressByName(name)).methods[type=='fixed'?'queryUserDepositions':'queryUserDeposition'](user).call()
}
export function queryUserDepositions(user) { //rewardunlocker
  const web3 = createCurWeb3()
  return new web3.eth.Contract(RewardUnlocker, findAddressByName('RewardUnlocker')).methods['queryUserDepositions'](user).call()
}
export function queryPoints(user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(RewardUnlocker, findAddressByName('RewardUnlocker')).methods.queryPoints(user).call()
}

export function queryPools() {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(RewardUnlocker, findAddressByName('RewardUnlocker')).methods.queryPools().call()
}
export function queryMyNFT(user) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(erc721ABI, findAddressByName('OstrichNFT')).methods.tokensOfOwner(user).call()
}
export function queryTokenURI(id) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(erc721ABI, findAddressByName('OstrichNFT')).methods.tokenURI(id).call()
}

export function queryAccelerateConfig(type, name) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(type=='fixed'?FixedPool:FlexiblePool, findAddressByName(name)).methods.queryAccelerateConfig().call()
}
export function queryUserAccelerateNFT(type, user, name) {
  const web3 = createCurWeb3()
  console.log(type, user, name)
  console.log(findAddressByName(name))
  return new web3.eth.Contract(type=='fixed'?FixedPool:FlexiblePool, findAddressByName(name)).methods.queryUserAccelerateNFT(user).call()
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
export function deposit_flexible (amount, name) {
    console.log(amount)
    return new Promise(async (res, rej) => {
      try{
        const provider = await createProviderController().connect()
        const web3 = new Web3(provider)
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        let hanlder = new web3.eth.Contract(FlexiblePool, findAddressByName(name)).methods.deposit(
          amount
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
export function deposit_fixed (amount, lockUnits, name) {
  console.log(amount)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(FixedPool, findAddressByName(name)).methods.deposit(
        amount, lockUnits
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
// reduce流动性
export function deposit_unlocker (amount) {
  console.log(amount)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(RewardUnlocker, findAddressByName('RewardUnlocker')).methods.deposit(
        findAddressByName('Orich-USDC'),
        amount
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
export function withdraw_flexible (amount, name) {
  console.log(amount)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(FlexiblePool, findAddressByName(name)).methods.withdraw(
        amount
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

export function harvest_flexible (name) {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(FlexiblePool, findAddressByName(name)).methods.harvest()
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

export function withdraw_fixed (depositid, name) {
  console.log(depositid)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(FixedPool, findAddressByName(name)).methods.withdraw(
        depositid
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
export function withdraw_unlocker (amount) {
  console.log(amount)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(RewardUnlocker, findAddressByName('RewardUnlocker')).methods.withdraw(
        findAddressByName('Orich-USDC'),
        amount
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

export function depositAccelerateNFT (type, tokenid, name) {
  console.log(tokenid)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(type=='fixed'?FixedPool:FlexiblePool, findAddressByName(name)).methods.depositAccelerateNFT(
        tokenid
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
export function withdrawAccelerateNFT (type, tokenid, name) {
  console.log(tokenid)
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(type=='fixed'?FixedPool:FlexiblePool, findAddressByName(name)).methods.withdrawAccelerateNFT(
        tokenid
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
export function isApprovedForAll (
  nftaddress,
  contractAddress,
  user
) {
  const web3 = createCurWeb3()
  return new web3.eth.Contract(erc721ABI, nftaddress).methods.isApprovedForAll(user, contractAddress).call()
}

export const setApprovalForAll = async (nftaddress, contractAddress) => {
  return new Promise(async (res, rej) => {
    try{
      const provider = await createProviderController(store.getState().chain).connect()
      const web3 = new Web3(provider)
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      let hanlder = new web3.eth.Contract(erc721ABI, nftaddress).methods.setApprovalForAll(
        contractAddress, true
      )

      let msg = {from: address}
      hanlder.estimateGas(msg).then(async(resp)=>{
        console.log(resp)
        let gas_price = await web3.eth.getGasPrice()*1.2/1000000000
        hanlder.send({...msg, gas: resp, gasPrice: Math.ceil(gas_price*1000000000)})
      .on('transactionHash', function() {
      })
      .on('receipt', function(result){
        res()
        OpenNotification('success', 'Successful', 'success')
      }).on('error', function (error) {
        console.log(error)
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