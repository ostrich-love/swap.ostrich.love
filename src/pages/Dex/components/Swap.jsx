import './Swap.scss'
import Pinecone from '../../../assets/image/swap/egg.svg'
import settingIcon from '../../../assets/image/launchpad/shezhi.svg';
import refreshIcon from '../../../assets/image/launchpad/refresh.svg';
import bottomIcon from '../../../assets/image/launchpad/bottom-icon.svg';
import circularIcon from '../../../assets/image/launchpad/circular-icon.svg';
import wallet from '../../../assets/image/launchpad/wallet.svg';
import Column from '../../../assets/image/launchpad/column-icon.svg'
import question from '../../../assets/image/common/question.svg';
import MyChart from './MyChart'
import { Button, Skeleton, Tooltip } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import Settings from './Settings'
import SelectToken from './SelectToken'
import { findAddressByName, fromUnit, OpenNotification, showLogin, testInput, toFixed, toUnit, toWei, UNIT_DECIMAL } from '../../../lib/util'
import { getTokenByName } from './list'
import {connect as reducxConnect} from 'react-redux'
import { getBalance } from '../../../contracts/methods'; 
import { useWallet } from '@manahippo/aptos-wallet-adapter'
import { useSubmitTransiction } from '../../../methods/submit'
import Loading from '../../../components/common/Loading'
import { allowance, approve ,swap} from '../../../contracts/methods/dexaggregator';
import { getAmountIn, getAmountOut} from '../../../contracts/methods/swap';
import { getReserves } from '../../../contracts/methods/liquidity';
import { queryUserInfo, reqeust } from '../../../contracts/methods/faucet';

import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { calcRouterPriceByInput, calcRouterPriceByOutput, findRouter, formatRouter, formatRouterIcon, getAllReserves } from './aggregator';
import useInterval from '@use-it/interval';
const decimal = 6

function Swap(props) { 
  const optionsData = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: 'ALL', value: 'all' }
  ]

  const DOUBLE_BTN = [
    { label: 'Max', value: '100' },
    {label: '75%',value: '75' },
    {label: '50%',value: '50' },
    {label: '25%',value: '25' }
  ]

  let {signAndSubmitTransaction} = useWallet()
  const [showSetting, setShowSetting] = useState(false);
  const [showSelectToken, setShowSelectToken] = useState(false);
  const [selectType, setSelectType] = useState('input');
  const [buyer, setBuyer] = useState('');
  const [seller, setSeller] = useState('');
  const [inputToken, setInputToken] = useState('USDC')
  const [outToken, setOutToken] = useState('Orich')
  const [inputBalance, setinputBalance] = useState(0)
  const [outBalance, setOutBalance] = useState(0)
  const [refresh, setRefresh] = useState(0)

  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [slip, setSlip] = useState(localStorage.getItem('slip')||'10')
  const [aggregated, setAggregated] = useState(localStorage.getItem('aggregated')||0)
  const [type, setType] = useState('input')
  const [loadingInputBalance, setLoadingInputBalance] = useState(false)
  const [loadingOutputBalance, setLoadingOutputBalance] = useState(false)
  const [canSwap, setCanSwap] = useState(false) // 是否能交易
  const [errMsg, setErrMsg] = useState('Enter an amount') // 错误提示
  const [routers, setRouters] = useState([])
  const [routers_with_price, setRoutersWithPrice] = useState([])
  const [reserveX, setReserveX] = useState(0)
  const [reserveY, setReserveY] = useState(0)
  const [usdcBal, setUSDCBal] = useState(null)
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimTimes, setClaimTimes] = useState(0)
  const [claimDate, setClaimDate] = useState(0)
  const [needApprove, setNeedApprove] = useState(true)
  const [approveRefresh, setApproveRefresh] = useState(0)
  const [reserveList, setReserveList] = useState([])
  const [isgettingReserve, setIsGettingReserve] = useState(false)
  const [isShowChart, setShowChart] = useState(false) // 是否显示k线图

  let { t, i18n } = useTranslation()
  

 const toSelect = (type) => {
  setSelectType(type)
  setShowSelectToken(true)
 }
 const slipChange = (num) => {
  setSlip(num)
 }
 const aggregatedChange = (bool) => {
  setAggregated(bool)
 }
 const confirmSelectToken = (name, type) => {
  type == 'input' ? setInputToken(name):setOutToken(name)
 }

const toSwap = useCallback(async() => {
  setLoading(true)
  console.log(buyer)
  console.log(seller)
  // let method = type == 'input' ? 'swapExactTokenForToken':'swapTokenForExactToken'
  let inputNum = type =='input' ? toWei(toFixed(buyer*(1), UNIT_DECIMAL)):toWei(toFixed(buyer*(1+slip/100), UNIT_DECIMAL))
  let outputNum = type == 'input' ? toWei(toFixed(seller*(1-slip/100), UNIT_DECIMAL)):toWei(toFixed(seller, UNIT_DECIMAL))
  console.log(routers_with_price)
  let pools = []
  routers_with_price[0].router.map(item => {
    pools.push({
      a: item.pair,
      t: item.t
    })
  })
  swap(
    pools,
    findAddressByName(inputToken),
    inputNum,
    0,
    10,
    () => {
          setLoading(false)
          setBuyer('')
          setSeller('')
          setRefresh(refresh+1)
      }
  ).finally(err => {
    setLoading(false)
    setRefresh(refresh+1)
  })
}, [routers_with_price]) 
const toApprove = ()=>{
  setLoading(true)
  approve(findAddressByName(inputToken), findAddressByName('DexAggregator')).then(res => {
    setApproveRefresh(approveRefresh+1)
  }).finally(err => {
    setLoading(false)
  })
}
const toClaim = () => {
  if(claimLoading) {
    return
  }
  if(!props.account) {
    showLogin()
    return
  }
  if(new Date().getTime()/1000 - claimDate < 24*60*60) { // 一天之内
    OpenNotification('warning', 'Claim failed', `please claim in ${24-Math.floor((new Date().getTime()/1000 - claimDate)/60/60)} hour(s)`)
    return
  }

  setClaimLoading(true)
  reqeust().then(res => {
    setRefresh(refresh+1)
    setClaimLoading(false)
  }).finally(err=>{
    setClaimLoading(false)
  })
}
//  互换
 const exChange = () => {
  let name = inputToken
  setInputToken(outToken)
  setOutToken(name)
  type == 'input' ? setBuyer(''):setSeller('')
  type == 'input' ? setSeller(buyer):setBuyer(seller)
  setType(type == 'input'?'output':'input')
 }
 const getReservesFun = async() => {
  if(isgettingReserve) {
    return
  }
  setIsGettingReserve(true)
  let result = await getAllReserves(aggregated)
  setReserveList(result)
  setIsGettingReserve(false)
 }
//  useEffect(async() => {
//   try {
//     if(type == 'input' && buyer) {
//       let amountOut = await getAmountOut([findAddressByName(inputToken) , findAddressByName(outToken)], toWei(buyer))
//        setPrice(amountOut/buyer)
//        setSeller(toFixed(fromUnit(amountOut),4))
//     } else if(type == 'input' && !buyer ) {
//       setSeller('')
//     }
//   } catch {
//     setSeller('')
//   }
//  }, [buyer, type, inputToken, outToken])
useEffect(() => {
  if(type == 'input' && buyer) {
     let routerswithprice = []
     routers.map(item => {
       routerswithprice.push(calcRouterPriceByInput(findAddressByName(inputToken), findAddressByName(outToken), item, toWei(toFixed(buyer*(1), UNIT_DECIMAL))))
     })
     routerswithprice = [...routerswithprice.sort((a, b) => {return Number(b.amountOut) - Number(a.amountOut)})]
     console.log(routerswithprice)
     setRoutersWithPrice(routerswithprice)
     setPrice(routerswithprice[0].amountOut/routerswithprice[0].amountIn)
     setSeller(fromUnit(routerswithprice[0].amountOut))
     console.log(routerswithprice)
    setReserveX(findAddressByName(inputToken)<findAddressByName(outToken)?routerswithprice[0].router[0].reserve_x:routerswithprice[0].router[0].reserve_y)
    console.log(findAddressByName(inputToken)<findAddressByName(outToken)?routerswithprice[0].router[0].reserve_x:routerswithprice[0].router[0].reserve_y)
  } else if(type == 'input' && !buyer ) {
    setSeller('')
  }
 }, [buyer, type, routers])
 useEffect(() => {
  if(type == 'output' && seller) {
    let routerswithprice = []
     routers.map(item => {
      routerswithprice.push(calcRouterPriceByOutput(findAddressByName(inputToken), findAddressByName(outToken), item, toUnit(seller)))
     })
     routerswithprice = [...routerswithprice.sort((a, b) =>  {return Number(a.amountIn) - Number(b.amountIn)})]
     let routerhasin = []
     let routernoin = []
     routerswithprice.map(item => {
       if(item.amountIn) {
        routerhasin.push(item)
       } else {
        routernoin.push(item)
       }
     })
     routerswithprice = [...routerhasin, ...routernoin]
     setRoutersWithPrice(routerswithprice)
     setPrice(routerswithprice[0].amountOut/routerswithprice[0].amountIn)
    setBuyer(fromUnit(routerswithprice[0].amountIn))
    setReserveX(findAddressByName(inputToken)<findAddressByName(outToken)?routerswithprice[0].router[0].reserve_x:routerswithprice[0].router[0].reserve_y)

  }else if(type == 'output' && !seller) {
    setBuyer('')
  }
 }, [seller, type, routers])
//  useEffect(async() => {
//   try {
//     if(type == 'output' && seller) {
//       let amountIn = await getAmountIn([findAddressByName(inputToken) , findAddressByName(outToken)], toWei(seller))
//        setPrice(seller/amountIn)
//        setBuyer(toFixed(fromUnit(amountIn),4))
  
//     }else if(type == 'output' && !seller) {
//       setBuyer('')
//     }
//   } catch {
//     setBuyer('')
//   }
  
//  }, [seller, type, inputToken, outToken])

//  useEffect(async ()=>{
//   let pairAddress = findAddressByName(inputToken+'-'+outToken)||findAddressByName(outToken+'-'+inputToken)
//   if(pairAddress) {
//     let {reserve0, reserve1} = await getReserves(pairAddress)
//     let reserve_x=findAddressByName(inputToken) < findAddressByName(outToken) ?reserve0:reserve1
//     let reserve_y=findAddressByName(inputToken) < findAddressByName(outToken) ?reserve1:reserve0
//     setReserveX(reserve_x)
//     setReserveY(reserve_y)
//   } else {
//     setReserveX(0)
//     setReserveY(0)
//   }

//  }, [inputToken, outToken, refresh])

 useEffect(() => {
  // 不能swap 的情况有：
  // 1, 交易对不存在
  // 2, 未连接钱包  
  // 3, 余额不足
  // 4, seller > reservey  流动性不足
  // 5，未输入金额
  if(!routers.length) { // 交易对不存在
    setCanSwap(false)
    setErrMsg('Liquidity does not exist')
  } 
   else if (!props.account) { // 未连接钱包
    setCanSwap(false)
    setErrMsg('Connect Wallet')
  }
  else if(buyer*1 > fromUnit(inputBalance)*1) { // 余额不足
     setCanSwap(false)
     setErrMsg(`Insufficient Input token balance`)
  } else if(routers_with_price.length && !routers_with_price[0].amountIn) { // 流动性不足
    setCanSwap(false)
    setErrMsg(`Insufficient liquidity for this trade.`)
 }
  else if(!buyer) { // 未输入金额
    setCanSwap(false)
    setErrMsg(`Enter an amount`)
  } else {
    setCanSwap(true)
    setErrMsg('')
  }

 }, [props.account, inputBalance, buyer, routers_with_price, routers])

 // 获取balance
 useEffect( async () => {
  if(props.account) {
    setLoadingInputBalance(true)
    let bal = await getBalance(props.account, findAddressByName(inputToken))
    setinputBalance(bal)
    setLoadingInputBalance(false)
  } else {
    setinputBalance(0)
    setNeedApprove(false)
  }
 }, [inputToken, props.account, refresh])

 useEffect(async() => {
  if(props.account) {
    let allow = await allowance(findAddressByName(inputToken), findAddressByName('DexAggregator'))
    setNeedApprove(Number(fromUnit(allow))<Number(buyer))
  }

 }, [props.account, inputToken, buyer, approveRefresh])

 useEffect( async () => {
  if(props.account) {
    setLoadingOutputBalance(true)
    let bal = await getBalance(props.account, findAddressByName(outToken))
    setLoadingOutputBalance(false)
    setOutBalance(bal)
  } else {
    setOutBalance(0)
  }
 }, [outToken, props.account, refresh])

 useEffect(getReservesFun, [refresh, aggregated])
 useInterval(getReservesFun, [30000])

 useEffect(()=> {
  setSlip(localStorage.getItem('slip'))
  setAggregated(localStorage.getItem('aggregated')||false)
 }, [])

 useEffect(async () => {
  if(!props.account) {
    setClaimTimes(0)
    setClaimDate(0)
    return
  }
  let userStore = await queryUserInfo(props.account)
  console.log(userStore)
  if(userStore) {
    setClaimTimes(userStore.requestCount)
    setClaimDate(userStore.lastRequestTime)
  } else {
    setClaimTimes(0)
    setClaimDate(0)
  }
 }, [props.account, refresh])

 useEffect(async () => {
  let router_list = findRouter(reserveList, findAddressByName(inputToken), findAddressByName(outToken))
  console.log(router_list)
  setRouters(router_list)
  if(router_list.length == 0) {
    setPrice(0)
    setBuyer('')
    setSeller('')
  }

 }, [inputToken, outToken, refresh, reserveList])
  return (
    <div className="swap-content flex flex-middle gap-46">
      {/* <img className='swap-left-log' src={LeftLogo} alt="" /> */}
      {
        isShowChart && <MyChart tokenChange={
          (tokenName) => {
            setInputToken(tokenName.split('/')[0])
            setOutToken(tokenName.split('/')[1])
          }
        }/>
      }
      
      <div className="swap-right bgf pb">
        <img className='min-pinecone' src={Pinecone} alt="" />
        {/* <img className='sweeping-squirrel' src={sweeping} alt="" /> */}
        <div className='flex flex-between flex-center'>
          
          <span className='swap-right-swap flex flex-center'>
          <span className='name pointer islink' onClick={()=>setShowChart(!isShowChart)}>
            <img src={Column} alt="" />
          </span>
          <span className='flex flex-center'>
          <span className='m-l-15 fz-14 c2b underline pointer flex flex-center register-usdc' onClick={toClaim}>{t('Claim test USDC')}</span>
          {
            claimLoading ?<Loading className='m-l-5' zoom={0.4}/>:<span className='fz-12 normal m-l-3 '>({10-claimTimes} {t('times remaining')})</span> 
          }
          </span>
            </span>
          <div className='swap-setting-btns'>
            <Tooltip title={t("Setting")}> <img onClick={() => setShowSetting(true)} src={settingIcon} alt="" className='pointer circle-icon'/></Tooltip>
            <Tooltip title={t("Refresh Balance")}><img className='m-l-15 pointer' src={refreshIcon} alt="" onClick={()=>setRefresh(refresh+1)}/> </Tooltip>
              {/* <img className='m-l-20' src={setting2Icon} alt="" />*/}
              
          </div>
        </div>

        {/* 支付币种 */}
        <div className='swap-right-from bgEEF m-t-11'>
          <div className='flex flex-between flex-center'>
            <div className='flex flex-center gap-8'>
              {
                DOUBLE_BTN.map((el, i) => {
                  return (
                    <div className='help-btn pointer' onClick={()=>{
                      if(!routers.length) {
                        return
                      }
                      setBuyer(toFixed(fromUnit(inputBalance)*el.value/100, decimal))
                      // setSeller(toFixed(getAmountOut(fromUnit(inputBalance)*el.value/100, reservex, reservey), decimal))
                      setType('input')
                    }
                  } key={i}>{t(el.label)}</div>
                  )
                })
              }
            </div>
            <div className='flex flex-center'>
              <img className='m-r-9' src={wallet} alt="" />
              <span className='c2b fz-14'>{
                loadingInputBalance ? <Skeleton.Button active size={'small'} />:
                toFixed(fromUnit(inputBalance)||0, 4)
              }</span>
            </div>
          </div>
          <div className='flex flex-between flex-center m-t-14'>
            <input
              className='c2b fz-24 fwb lh-28 flex-1 flex w100 com_input'
              type="text"
              placeholder='0'
              value={buyer}
              disabled={!routers.length}
              onChange={(e) => {
                if (testInput(e.target.value)) {
                  return
                }
                setBuyer(e.target.value);
                // setSeller(getAmountOut(e.target.value, reservex, reservey))
                setType('input')
                }}/>
            <div className='flex flex-center  p-l-5 p-r-5' onClick={()=>toSelect('input')}>
              {/* <span className='c2b fz-14 m-r-16 lh-18'>~$1,445</span> */}
              <div className='switch-coin flex flex-center flex-middle'>
                <img src={getTokenByName(inputToken).icon} alt="token icon" className='token-icon'/>
                <span className='c2b fz-18 m-l-7 m-r-12'>{inputToken}</span>
                <img src={bottomIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
        {/* 支付币种 */}

        <div className='flex flex-between flex-center m-t-16 m-b-16'>
          <div className='flex flex-center m-l-20'>
            {
              routers.length && buyer ?  <span className='fz-14 c2b'>1 {inputToken} = {toFixed(price, decimal)} {outToken}</span>:''
            }
            
            {/* <img className='switch-icon m-l-8' src={Switch} alt="" /> */}
          </div>
          <div className='circular-switch' onClick={exChange}>
            <img src={circularIcon} alt="" />
          </div>
        </div>

        {/* 得到币种 */}
        <div className='swap-right-from bgEEF '>
          <div className='flex flex-between flex-center'>
            <div className='flex flex-center'>
              {/* <span className='fz-12 c00c m-r-6'>{`You save $0.12 (<0.01%)`}</span>
              <img src={exclamatoryMark} alt="" /> */}
            </div>
            <div className='flex flex-center'>
              <img className='m-r-9' src={wallet} alt="" />
              <span className='c2b fz-14'>
                {loadingOutputBalance ? <Skeleton.Button active size={'small'} />:
                toFixed(fromUnit(outBalance)||0, 4)}</span>
            </div>
          </div>
          <div className='flex flex-between flex-center m-t-14'>
            <input
              className='c2b fz-24 fwb lh-28 flex-1 flex w100 com_input'
              type="text"
              placeholder='0'
              value={seller}
              disabled={!routers.length}
              onChange={(e) => {
                if (testInput(e.target.value)) {
                  return
                }
                setSeller(e.target.value);
                // setBuyer(getAmountIn(e.target.value, reservex, reservey));
                setType('output')
              }}/>
            <div className='flex flex-center' onClick={()=>toSelect('output')}>
              {/* <span className='c2b fz-14 m-r-16'>~$1,445</span> */}
               <div className='switch-coin flex flex-center flex-middle' >
                <img src={getTokenByName(outToken).icon} alt="token-icon" className='token-icon'/>
                <span className='c2b fz-18 m-l-7 m-r-12'>{outToken}</span>
                <img src={bottomIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
        {/* 得到币种 */}

         {/* <div className='flex flex-last m-t-17  m-b-17  p-l-20 p-r-20'> */}
          {/* <div className='flex flex-center'>
            <img src={yigouxuan} alt="" />
            <span className='fz-16 c00c fwb m-l-6 m-r-8'>Fair price</span>
            <img src={xialaGreen} alt="" />
          </div> */}
          {/* <div>
            <span className='fz-12 c2b m-r-8'>Slippage Tolerance</span>
            <span className='c00c fz-12'>{slip}%</span>
          </div>
        </div> */}
        {
          buyer ? 
          <div className='speed-info m-t-15'>
          {/* <div className='flex flex-between m-b-16 lh-18'>
            <span className='c2b fz-14'>Rate</span>
            <div className='flex flex-center'>
              {/* <img className='switch-icon m-r-8' src={Switch} alt="" /> */}
              {/* <span className='c232 fz-14 fwb'>1 {inputToken} = {toFixed(seller/buyer, decimal)} {outToken}</span> */}
            {/* </div> */}
          {/* </div> */}
          <div className='flex flex-between m-b-16 lh-18'>
            <div className='flex flex-center'>
              <span>{t("Minimum received")}</span>
              <Tooltip title={t("Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.")}>
                <img className='m-l-8' src={question} alt="" />
              </Tooltip>
            </div>
            <span className='c232 fz-14 fwb'>{toFixed(seller*(1-slip/100), decimal)} {outToken}</span>
          </div>
          <div className='flex flex-between m-b-1 lh-18'>
            <div className='flex flex-center'>
              <span>{t("Price Impact")}</span>
              <Tooltip title={t("The difference between the market price and estimated price due to trade size.")}>
                <img className='m-l-8' src={question} alt="" />
              </Tooltip>
              
            </div>
            <span className='c00c fz-14 fwb'>{
            toUnit(buyer)/(toUnit(buyer)*1+(reserveX)*1)*100 < 0.01 
            ? '<0.01'
            : toFixed(toUnit(buyer)/(toUnit(buyer)*1+(reserveX)*1)*100, 2)}%</span>
          </div>
          <p className='tr lh-18 c232 fz-12 pointer' onClick={() => setShowSetting(true)} >{t("Slippage tolerance")}: <span className='c00c'>{slip}%</span></p>
          <div className='flex flex-between m-b-1 lh-18'>
            <div className='flex flex-center'>
              <span>{t("Liquidity Provider Fee")}</span>
              <Tooltip title={t("For each trade a 0.3% fee is paid")}>
                <img className='m-l-8' src={question} alt="" />
              </Tooltip>
            </div>
            <span className='c232 fz-14 fwb'>{toFixed(buyer*0.003, decimal)} {inputToken}</span>
          </div>
          <p className='tr lh-18 c232 fz-12 m-b-1'>0.3%</p>
          <div className='flex flex-between m-b-1 lh-18'>
            <div className='flex flex-center'>
              <span>{t('Router')}</span>
              <Tooltip title={t("Routing through these tokens resulted in the best price for your trade.")}>
                <img className='m-l-8' src={question} alt="" />
              </Tooltip>
            </div>
            <span className='c232 fz-14 fwb flex flex-center'>
               {routers_with_price[0] && formatRouter(inputToken, outToken, routers_with_price[0]?.router)}
            </span>
          </div>
          <p className='tr lh-18 c232 fz-12 m-b-1'> {routers_with_price[0] && formatRouterIcon(routers_with_price[0]?.router)}</p>
          
        </div>:''
        }
        
        {
          needApprove && (
            <div className='speed-info m-t-15'>
              {t("Approve more than")} <span className='fwb fz-14'>{buyer} {inputToken} </span>
              {t("to allow Ostrich swap to spend your")} {inputToken} {t("for this transaction.")}
            </div>
          )
        }
        {
            reserveList.length == 0 ?(
              <div className='w100 ta c05 m-t-15' >
                <Skeleton.Button active size={'small'} /> {t('Fetching best price')}</div>  
            ):(needApprove ?
            <Button className={'approve-btn pointer  m-t-15 '+((!canSwap && errMsg != 'Connect Wallet') ? 'disabled': '')} 
             onClick={toApprove} loading={loading}>
              {t("Approve")} {inputToken}
          </Button>:
          <Button className={'approve-btn pointer  m-t-15 '+((!canSwap && errMsg != 'Connect Wallet') ? 'disabled': '')} 
             disabled={(!canSwap && errMsg != ('Connect Wallet'))}
             onClick={canSwap ?toSwap:showLogin} loading={loading}>
              {canSwap ?  t('Swap'): t(errMsg)}
          </Button>)
        }
        {
          // <div className='speed-info m-t-15 m-b-30'>
          //   <div className="fz-16 fwb">{t('Currency Reserves')}</div>
          // <div className='flex flex-between m-t-20 m-b-16 lh-18'>
          //   <span className='c2b fz-14'>
          //      <img src={getTokenByName(inputToken).icon} alt="token icon" className='token-icon m-r-5'/>
          //      {inputToken}
          //   </span>
          //   <div className='flex flex-center'>
          //     <span className='c232 fz-14 fwb'>{toFixed(fromUnit(reserveX), decimal)}</span>
          //   </div>
          // </div>
          // <div className='flex flex-between m-b-10 lh-18'>
          //   <span className='c2b fz-14'>
          //      <img src={getTokenByName(outToken).icon} alt="token icon" className='token-icon m-r-5'/>
          //      {outToken}
          //   </span>
          //   <div className='flex flex-center'>
          //     <span className='c232 fz-14 fwb'>{toFixed(fromUnit(reserveY), decimal)}</span>
          //   </div>
          // </div>
          // </div>
        }
        {/* <div className="ta w100">
          <NavLink to="/swap_rewards" className="c232 fz-14 fwb underline">{t('Trading mining rewards')}</NavLink>
        </div> */}
         {
          //  <div className="fz-16 fwb m-t-15">Total {routers.length} routes available</div>


         }
        {/* <div className='swap-right-from-submit c2b pointer' onClick={() => setApproveBtnShow(true)}>Insufficient liquidity for this trade.</div> */}
        {
            <Settings
            show={showSetting}
              closeFn={setShowSetting}
              slipChange={slipChange}
              slip={slip}
              aggregated={aggregated}
              aggregatedChange={aggregatedChange}
              ></Settings>
        }
        {
            <SelectToken closeFn={setShowSelectToken} input={inputToken} output={outToken} selectToken={(name)=>confirmSelectToken(name, selectType)} show={showSelectToken} type={selectType}></SelectToken>
        }
      </div>
    </div>
  )
}

export default reducxConnect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Swap
);