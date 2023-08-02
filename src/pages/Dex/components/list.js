import { findAddressByName } from '../../../lib/util'

 const list =  [
    {
      title: 'BNB',
      desc: 'BNB',
      icon: require('../../../assets/image/token/BNB.svg').default,
      hide: true
    },
    {
      title: 'Orich',
      desc: 'Orich token',
      icon: require('../../../assets/image/token/OSTR.png')
    },
    {
      title: 'BUSD',
      desc: 'BUSD token',
      icon: require('../../../assets/image/token/BUSD.svg').default,
      hide: true
    },
    {
      title: 'ETH',
      desc: 'ETH token',
      icon: require('../../../assets/image/token/ETH.svg').default
    },
    {
      title: 'MockETH',
      desc: 'ETH token',
      icon: require('../../../assets/image/token/ETH.svg').default,
      hide: false
    },
    {
      title: 'WETH',
      desc: 'ETH token',
      icon: require('../../../assets/image/token/ETH.svg').default,
      hide: false
    },
    {
      title: 'ARB',
      desc: 'ARB token',
      icon: require('../../../assets/image/token/ARB.jpg')
    },
    {
      title: 'AVAX',
      desc: 'AVAX token',
      icon: require('../../../assets/image/token/AVAX.svg').default
    },
    {
      title: 'MATIC',
      desc: 'MATIC token',
      icon: require('../../../assets/image/token/MATIC.png'),
      hide: true
    },
    {
      title: 'USDT',
      desc: 'USDT token',
      icon: require('../../../assets/image/token/USDT.svg').default
    },
    {
      title: 'USDC',
      desc: 'USDC token',
      icon: require('../../../assets/image/token/USDC.svg').default
    },
    {
      title: 'BTC',
      desc: 'BTC token',
      icon: require('../../../assets/image/token/BTC.svg').default
    },
    {
      title: 'SHIB',
      desc: 'SHIB token',
      icon: require('../../../assets/image/token/SHIB.png')
    },
    {
      title: 'LINK',
      desc: 'LINK token',
      icon: require('../../../assets/image/token/LINK.png')
    },
    {
      title: 'TEST',
      desc: 'TEST token',
      icon: require('../../../assets/image/token/TEST.png')
    }
  ]

  export const getTokenByName = (name) => {
    let token = {}
    list.map(item => {
        if(item.title == name) {
            token = item
        }
    })
    return token
  }

  export const getSwapTokenList = () => {
    return list.filter(item => !item.hide && findAddressByName(item.title))
  }
  export default list