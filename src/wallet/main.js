

import { providerOptions } from './providerOptions';


export const getETHNetwork = () => {
  return {
    name: 'ETH',
    networkId: 1,
    params: {
          blockExplorerUrls: ['https://etherscan.io/'],
    },
    httpProviderURL: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    connectors: {
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: providerOptions({
        walletconnectOptions: {
          infuraId: "9aa3d95b3bc440fa88ea12eaa4456161"
        }
      })
    }
  }
}

export default {
  getETHNetwork
}