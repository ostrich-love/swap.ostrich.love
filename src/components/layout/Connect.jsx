import './Connect.scss'
import { NavLink, useLocation } from 'react-router-dom'
import { Button, Drawer, Radio, Space, Tooltip } from 'antd';
import {HexString} from 'aptos'
import { useCallback, useEffect, useState } from 'react'
import BgTop from '../../assets/image/connect/top.png'
import BgBottom from '../../assets/image/connect/bottom.png'
import { addPoint, decimal, findAddressByName, fromUnit, hideLogin, OpenNotification, showLogin, toFixed } from '../../lib/util'
import {connect as reducxConnect} from 'react-redux'
import { useWallet} from '@manahippo/aptos-wallet-adapter';
import {
  CopyOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import store, {setChain, setconnect, connect, disconnect, setUserStore} from '../../store'
import { getBalance } from '../../contracts/methods';
import { getTokenByName } from '../../pages/Dex/components/list';
import { getUserStore } from '../../methods/staking';
import Loading from '../common/Loading';
import { createProviderController } from '../../wallet/createProviderController';
import connectWallet from '../../wallet/connectWallet';
import metamask from '../../assets/image/wallets/metamask.png'
import walletconnect from '../../assets/image/wallets/walletconnect.png'
import okx from '../../assets/image/wallets/okx.jpg'
import zks from '../../assets/image/wallets/zks.jpg'
import btc from '../../assets/image/token/BTC.svg'
import { useTranslation } from 'react-i18next';
import {MetaMaskSDK} from '@metamask/sdk'

const coinList = ['Orich', 'ETH', 'BALD']

function Connect (props) {
    let [show, setShow] = useState(false)
    let [selectWalletName, setSelectWalletName] = useState('')
    let [assetList, setAssetList] = useState([])
    let [loading, setLoading] = useState('')

    let { t, i18n } = useTranslation()
     let { pathname } = useLocation()
    const { wallets:aptosWallets, select: aptosSelect, disconnect:aptosDisconnect, connect:aptosConnect,  wallet: aptosWallet, account} = useWallet();

  const [providerController, setProviderController] = useState({});
    console.log(useWallet)
    const [aptosConnecting, setAptosConnecting] = useState(false)

    const handleConnect = async (id) => {
      const provider = await createProviderController().connectTo(id)
      connectWallet(provider)
    }
    const hexStringV0ToV1 = (v0) => {
    if (typeof v0 === 'string') {
        return new HexString(v0);
    } else if (v0.hexString) {
        return new HexString(v0.toString());
    } else {
        throw new Error(`Invalid hex string object: ${v0}`);
    }
    };
    const toCopy = useCallback(async () => {
      if (props.account) {
        await navigator.clipboard.writeText(props.account);
        OpenNotification('success', t('Copy finshed'))
      }
    }, [props.account]);
    const toLogout = () => {
      store.dispatch(disconnect(''))

      providerController.clearCachedProvider();
      // aptosDisconnect()
    }
    useEffect(async () => {
        if ( aptosWallet && aptosConnecting) {
          props.dispatch(setconnect('1'))
          try {
            await aptosConnect()
          } catch(e) {
            console.log(e)
          } finally {
            setAptosConnecting(false)
          }
        }
      }, [aptosWallet, aptosConnecting])

      useEffect(() => {
        console.log(account)
        if ( account?.address) {
          const address = hexStringV0ToV1(account?.address)
          console.log(address.toString())
          props.dispatch(connect(address?.toString()))
          props.dispatch(setconnect(''))
        }
      }, [account]) 

      useEffect(async ()=>{
        if(!props.account) {
          return
        }
        setLoading(true)
        let p = []
        let list = []
        coinList.map(item => {
          p.push(getBalance(props.account, findAddressByName(item)))
        })
        Promise.all(p).then(res => {
          coinList.map((item, index) => {
            list.push({
              name: item,
              value: res[index]
            })
          })
          setAssetList(list)
          setLoading(false)
        })
        
      }, [props.account])
      
      useEffect(() => {
        setShow(false)
      }, [pathname])
      useEffect(() => {
        setShow(props.showLogin)
      }, [props.showLogin])

      useEffect(() => {
          setProviderController(createProviderController());
          connectWallet();
      }, []);

    return (
        <div className='connect'>
            <div className='fz-14 button connect-btn ta pointer hover' onClick={()=>{setShow(!show)}}>
                 {
                    props.account ? addPoint(props.account):t('Connect Wallet')
                 }  
            </div>
            <Drawer
              title={t("My Wallet")}
              placement='right'
              closable={true}
              onClose={()=>{setShow(false);hideLogin()}}
              visible={show}
              className="connect-drawer"
              key='right'
            > 
            {
              props.account ? (
                <>
                <div className="name fz-18 fwb ">{t('Wallet Address')}</div>
                <div className="wallet-item ta flex flex-between w100   pointer p-l-20 p-r-20">
                  <span>
                  {addPoint(props.account)}
                  </span>
                    
                    <span>
                      <Tooltip title={t('copy address')}>
                          <CopyOutlined className="pointer m-r-10" onClick={toCopy}/>
                      </Tooltip>
                      <Tooltip title={t('logout')}>
                      <LogoutOutlined className="pointer" title={t('logout')} onClick={toLogout}/>
                      </Tooltip>

                    </span>
                </div>
                </>
              ):(
                <>
                <div className="name fz-18 fwb">{t('Choose Wallet')}</div>
                <div   className={"wallet-item ta flex flex-center flex-middle pointer"} onClick={async _ => {handleConnect(window.ethereum ?'injected':'walletconnect')}} >
                  <img src={metamask} alt={`MetaMask icon`} className='wallet-logo m-r-5'/>
                                <div className="wallet-name tl">MetaMask</div>
                            </div>
                            <div   className={"wallet-item ta flex flex-center flex-middle pointer"} onClick={async _ => {handleConnect('walletconnect')}} >
                  <img src={walletconnect} alt={`walletconnect icon`} className='wallet-logo m-r-5'/>
                                <div className="wallet-name tl">WalletConnect</div>
                            </div>
                            {/* <div   className={"wallet-item ta flex flex-center flex-middle pointer"} onClick={async _ => {handleConnect('custom-okx')}} >
                  <img src={okx} alt={`okx icon`} className='wallet-logo m-r-5'/>
                                <div className="wallet-name tl">OKX</div>
                            </div> */}
                </>
              )
            }
                    
                    <div className="name fz-18 fwb m-t-24 flex flex-between">
                      <span>
                      {t('My Asset')}
                      </span>
                    </div>
                    {
                      props.account ? (
                        <div className='w100 flex flex-wrap flex-between'>
                        {
                          loading ? <div className='w100 flex flex-middle p-t-30 p-b-30'><Loading/></div> :assetList.map(item => {
                            return <div className="account-item flex  flex-center  w50 p-l-5 p-r-5" key={item.name}>
                              <img src={getTokenByName(item.name).icon} alt="" className='token-icon m-r-5'/>
                              <span className='lh-15'>
                              {toFixed(fromUnit(item.value)||'0', decimal)} {item.name}
                              </span>
                              
                            </div>
                          })
                        }
                        </div>
                          
                      ):(
                        <div className="no-wallet-account c2b fz-14 m-t-13 flex flex-center flex-column flex-middle">
                          <img src={require('../../assets/image/connect/ostrich.svg').default} className="m-b-17" alt="" />
                          {t('no wallet connected')}
                        </div>
                      )
                    }
                    
                    <div className="name fz-18 fwb m-t-24">{t('Quick Shortcuts')}</div>
                    <div className="nav-wrap flex flex-between flex-wrap">
                        {/* <NavLink className="nav-item" to="/launch">LaunchPad</NavLink>
                        <NavLink className="nav-item" to="/getquota">Get Quota</NavLink> */}
                        <NavLink className="nav-item" to="/swap">{t('Swap')}</NavLink>
                        <NavLink className="nav-item" to="/farm">{t('Farm')}</NavLink>
                        <NavLink className="nav-item" to="/launch">{t('Launch')}</NavLink>
                        {
                          props.account && <div className="nav-item pointer" onClick={toLogout}>
                            <LogoutOutlined className="pointer m-r-10" title="logout"/>
                            {t('Logout')}</div>
                        }
                        
                    </div>
                    <div className="reward-area p-12 w100 flex flex-between flex-center gap-20 m-t-21">
                       <span className="cy fz-14">You have <span className='fwb underline italic'>45.6 Orich</span>  trading rewards to claim</span>
                       <NavLink className="cf check-btn ta" to="/swap_rewards">Details</NavLink>
                    </div>

                    <img src={BgTop} alt="" className='bg bg-top' />
                    {/* <img src={BgBottom} className='bg bg-bottom' alt="" /> */}
              </Drawer>
      
            
        </div>
    )
}
export default reducxConnect(
    (state, props) => {
      return {...state, ...props}
    }
  )(
    Connect
  );