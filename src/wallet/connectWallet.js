import Web3 from 'web3'
import store, {connect, disconnect, setconnect} from '../store'
// import {web3} from '../../http'
import {createProviderController} from './createProviderController'
import { OpenNotification } from '../lib/util';
import { getNetwork } from '../contracts';
export const addNetwork = () => {
  if(window.ethereum) {
    const params = getNetwork().params
    window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    })
    .then(async(res) => {
      console.log(res)
      const now_chainId = await Web3.eth.getChainId()
      const now_chainId_number = Web3.utils.isHex(now_chainId) ? Web3.utils.hexToNumber(now_chainId) : now_chainId
      if(now_chainId_number == getNetwork().networkId) {
        OpenNotification('success', 'Switch network success')
      } else {
        OpenNotification('error', 'Please connect to the correct network first')
      }
    })
    .catch((err) => {
      console.log(err)
      OpenNotification('error', 'Please connect to the correct network first')
    });
  }
  
}
export const networkCheck  = (web3, provider, chainId, showTips) => {
  const _networkId = getNetwork().networkId
  const networkId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
  if(networkId !== _networkId && store.getState().connect) {
    OpenNotification('error', 'Please connect to the correct network first')
    try {
      provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: web3.utils.toHex(_networkId),
        }],
      })
      .then((res) => {
        OpenNotification('success', 'Switch network success')
      })
      .catch((err) => {
        if(err.code == 4902 ||err.code == -32603) {
          addNetwork()
        }
      });
    } catch {
      addNetwork()
    }
  } else {
    showTips && OpenNotification('success', 'Switch network success')
  }
}

const setAccount = async (provider) => {
  const httpProviderURL = getNetwork().httpProviderURL
  
  let web3 = new Web3(provider)
  if(!web3) {
    web3 = new Web3(new Web3.providers.HttpProvider(httpProviderURL));
  }
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });
  const accounts = await web3.eth.getAccounts();
  // const accounts = ['0x8333A45A74C33b99C31e228B7E168D1F18513F33']
  
  const address = accounts[0];
  store.dispatch(connect(address))
  store.dispatch(setconnect(''))
  const chainId = await web3.eth.getChainId()
  networkCheck(web3, provider, chainId)
  provider.on('accountsChanged', async (accounts) => {
    console.log('account changed', accounts)
    if (accounts[0]) {
      store.dispatch(connect(accounts[0]))
    } else {
      store.dispatch(disconnect(''))
    }
  });
  provider.on('chainChanged', async (chainId) => {
    networkCheck(web3, provider, chainId, true)
  });
}
const connectWallet = async (provider)=> {
  try {
    store.dispatch(setconnect('1'))
    if (provider) {
      setAccount(provider)
    } else {
      const provider = await createProviderController().connect()
      localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER') && setAccount(provider)
    }
  } catch (error) {
    console.log(error)
    localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER')
  }
}
// export function approve (
//   spender:string,
//   amount: number
// ) {
//   return
// }
export default connectWallet

