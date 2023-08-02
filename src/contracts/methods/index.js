import Web3 from 'web3'
import { bep20ABI } from '../abi/bep20'
import store from '../../store'
import { getNetwork } from '../index'
import { ZERO_ADDRESS } from '../../lib/util'
import { createProviderController } from '../../wallet/createProviderController'
import { networkCheck } from '../../wallet/connectWallet'

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


export function getBalance(user, contractAddress) {
  console.log(user, contractAddress)
  const web3 = createCurWeb3()
  // return 0
  return user.includes('0x') && contractAddress ?(contractAddress == ZERO_ADDRESS ?web3.eth.getBalance(user):new web3.eth.Contract(bep20ABI, contractAddress).methods.balanceOf(user).call()):0
}
export function sign(
  msg
) {
  return new Promise(async (res, rej) => {
    try{
      
      const provider = await createProviderController().connect()
      const web3 = new Web3(provider)

      const chainId = await web3.eth.getChainId()
      if(chainId != getNetwork().networkId) {
        networkCheck(web3, provider, chainId)
        return
      }
      const accounts = await web3.eth.getAccounts();
      const sig = await web3.eth.personal.sign(msg, accounts[0]);
      res(sig)
    } catch (err) {
      rej(err);
    }
  })
}