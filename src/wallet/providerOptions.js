
import WalletConnectProvider from '@walletconnect/web3-provider';
import math from '../assets/image/wallets/math.png'
import okx from '../assets/image/wallets/okx.jpg'
export const providerOptions = ({walletconnectOptions}) => {
    return {
      injected: {
        display: {
          name: 'MetaMask',
          description: 'Home-BrowserWallet',
        },
      },
      // walletconnect: {
      //   package: WalletConnectProvider,
      //   options: walletconnectOptions,
      // },
      walletconnect: {
        package: WalletConnectProvider,
        options: walletconnectOptions,
      },
      'custom-okx': {
        display: {
          name: 'Okx',
          description: 'Okx-Wallet',
          logo: okx,
        },
        package: 'okxwallet',
        connector: async (ProviderPackage, options) => {
          if (window.okxwallet || (window.ethereum && window.ethereum.isOkxWallet)) {
            const provider = window.okxwallet || window.ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://www.okx.com/cn/web3')
          return null;
        },
      },
      'custom-coinbase': {
        display: {
          name: 'Coinbase',
          description: 'Coinbase-Wallet',
          logo: okx,
        },
        package: 'coinbase',
        connector: async (ProviderPackage, options) => {
          if (window.coinbaseWalletExtension|| window.ethereum.isCoinbaseWallet) {
            const provider =  window.ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://www.coinbase.com/')
          return null;
        },
      },
      'custom-math': {
        display: {
          name: 'Math',
          description: 'Math-Wallet',
          logo: math,
        },
        package: 'math',
        connector: async (ProviderPackage, options) => {
          if (window.ethereum && window.ethereum.isMathWallet) {
            console.log('MathWallet is installed!');
            const provider = (window).ethereum;
            await provider.enable();
            return provider;
          }
          window.open('https://mathwallet.org/')
          return null
        },
      },
    }
  }