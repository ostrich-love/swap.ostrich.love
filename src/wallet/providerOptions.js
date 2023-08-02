
import WalletConnectProvider from '@walletconnect/web3-provider';
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
    }
  }