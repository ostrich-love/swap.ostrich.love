import TESTADDRESS from './test.json'
import MAINADDRESS from './main.json'
import { NET_TYPE } from '../global'

import { providerOptions } from '../wallet/providerOptions';
import Web3 from 'web3';
const BASE_MAIN = {
  name: 'BASE',
  params: {
    chainId: Web3.utils.toHex(8453),
    chainName: 'Base MainNet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org/'],
  },
  networkId: 8453,
  httpProviderURL: 'https://mainnet.base.org',
  connectors: {
    network: 'base',
    cacheProvider: true,
    providerOptions: providerOptions({
      walletconnectOptions: {
        rpc: {
          8453: 'https://mainnet.base.org'
        }
      }
    })
  }
}
const BASE_TEST = {
  name: 'BASE',
  params: {
    chainId: Web3.utils.toHex(84531),
    chainName: 'BASE TestNet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli.base.org'],
    blockExplorerUrls: ['https://goerli.basescan.org'],
  },
  networkId: 84531,
  httpProviderURL: 'https://goerli.base.org',
  connectors: {
    network: 'base',
    cacheProvider: true,
    providerOptions: providerOptions({
      walletconnectOptions: {
        rpc: {
          84531: 'https://goerli.base.org'
        }
      }
    })
  }
}
const ZKS_TEST = {
     name: 'zkSync Era Testnet',
     params: {
       chainId: Web3.utils.toHex(280),
       chainName: 'zkSync Era Testnet',
       nativeCurrency: {
         name: 'Ethereum',
         symbol: 'ETH',
         decimals: 18,
       },
       blockExplorerUrls: ['https://goerli.explorer.zksync.io/'],
       rpcUrls: ['https://testnet.era.zksync.dev/']
     },
     networkId: 280,
     httpProviderURL: 'https://testnet.era.zksync.dev/',
     connectors: {
       network: 'mainnet',
       cacheProvider: true,
       providerOptions: providerOptions({
         walletconnectOptions: {
           rpc: {
             280: 'https://testnet.era.zksync.dev/',
           }
         }
       })
     }
   }
   const ZKS_MAIN = {
     name: 'zkSync Era Mainnet',
     params: {
       blockExplorerUrls: ['https://zksync2-testnet.zkscan.io'],
     },
     networkId: 280,
     httpProviderURL: 'https://testnet.era.zksync.dev/',
     connectors: {
       network: 'mainnet',
       cacheProvider: true,
       providerOptions: providerOptions({
         walletconnectOptions: {
           rpc: {
             280: 'https://testnet.era.zksync.dev/',
           }
         }
       })
     }
   }

export const getAddress = () => {
     return NET_TYPE == 'test' ? TESTADDRESS : MAINADDRESS
}
export const getNetwork = () => {
     return NET_TYPE == 'test' ? BASE_TEST : BASE_MAIN
}
export const SyncSwapClassicPoolFactory = NET_TYPE == 'test' ?'0xf2FD2bc2fBC12842aAb6FbB8b1159a6a83E72006':'0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb'