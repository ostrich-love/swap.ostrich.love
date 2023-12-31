import './Liquidity.scss'
import Pinecone from '../../../assets/image/swap/egg.svg'
import positionIcon from '../../../assets/image/launchpad/position-icon.png';
import bottomIcon from '../../../assets/image/launchpad/bottom-icon.svg';
import squirrelLeft from '../../../assets/image/launchpad/squirrel-left.png'
import squirrelRight from '../../../assets/image/launchpad/squirrel-right.png'
import settingIcon from '../../../assets/image/launchpad/shezhi.svg';
import setting2Icon from '../../../assets/image/launchpad/shijian (2).svg';
import Coin1 from '../../../assets/image/launchpad/coin-1.png'
import Coin2 from '../../../assets/image/launchpad/coin-2.png'
import { useCallback, useEffect, useState } from 'react';
import jiahao from '../../../assets/image/launchpad/jiahao.svg';
import question from '../../../assets/image/common/question.svg'
import fanhui from '../../../assets/image/common/fanhui.svg'
import { connect as reducxConnect } from 'react-redux'
import { getLPBalance, queryResource } from '../../../methods/client.ts';
import { getTokenByName } from './list';
import { decimal, findAddressByName, findNameByAddress, fromUnit, numFormat, OpenNotification, showLogin, testInput, toFixed, toUnit, toWei, UNIT_DECIMAL } from '../../../lib/util';
import { explorerUrl, getAddress } from '../../../contract';
import { queryTokenPairMetadata, queryTokenPairReserve } from '../../../methods/swap';
import { Spin, Button, Skeleton } from 'antd';
import SelectToken from './SelectToken';
import { isRegistered } from '../../../methods/client.ts'
import { getBalance } from '../../../contracts/methods';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import Loading from '../../../components/common/Loading';
import { useLocation } from 'react-router-dom';
import { addLiq, allPairs, getLpAmounts, getPair,createPair, getReserves,getSymbol, reduceLiq } from '../../../contracts/methods/liquidity';
import BigNumber from 'bignumber.js';
import { find } from 'highcharts';
import { useTranslation } from 'react-i18next';
import { allowance, approve } from '../../../contracts/methods/swap';
import { get } from '../../../api';
import { getNetwork } from '../../../contracts';
import { localName, slip_name } from '../../../global';

const baseLength = '1000000000000000000'.length - 1;
const option = [
  {
    label: '25%',
    value: '25',
  },
  {
    label: '50%',
    value: '50',
  },
  {
    label: '75%',
    value: '75',
  },
  {
    label: 'Max',
    value: '100',
  },
]
const AddLiquidity = (props) => {

  const [buyer, setBuyer] = useState('')
  let { signAndSubmitTransaction } = useWallet()
  const [seller, setSeller] = useState('')
  const [selectType, setSelectType] = useState('input')
  const [showSelect, setShowSelect] = useState(false)
  const [inputToken, setInputToken] = useState(props.input || 'Orich')
  const [outToken, setOutToken] = useState(props.output || 'ETH')
  const [slip, setSlip] = useState(localStorage.getItem('slip') || '2')
  const [inputBalance, setinputBalance] = useState(0)
  const [outBalance, setOutBalance] = useState(0)
  const [price, setPrice] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [reservex, setReserveX] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasPair, setHaspair] = useState(false)
  const [pairCreated, setPairCreated] = useState(false)
  const [loadingInputBalance, setLoadingInputBalance] = useState(false)
  const [loadingOutputBalance, setLoadingOutputBalance] = useState(false)
  const [needApproveInput, setNeedApproveInput] = useState(0)
  const [needApproveOutput, setNeedApproveOutput] = useState(0)
  const [inputLoading, setInputLoading] = useState(false)
  const [outputLoading, setOutputLoading] = useState(false)
  let { t, i18n } = useTranslation()
  const confirmSelectToken = (name, type) => {
    type == 'input' ? setInputToken(name) : setOutToken(name)
  }
  const toSelect = (type) => {
    setSelectType(type)
    setShowSelect(true)
  }
  const toApprove = useCallback((type)=>{
    try {
      type=='input' &&  setInputLoading(true)
      type=='output' && setOutputLoading(true)
      approve(findAddressByName(type=='input'?inputToken:outToken), 
      findAddressByName('SwapRouter')).then(res => {
        setRefresh(refresh+1)
      }).finally(err => {
        type=='input' &&  setInputLoading(false)
        type=='output' && setOutputLoading(false)
      })
    }catch {

    }
  }, [inputToken, outToken]) 
  const toAdd = useCallback(async () => {
    setLoading(true)
    console.log(buyer)
    console.log(seller)
    try {
      !pairCreated && await createPair(findAddressByName(inputToken=='ETH'?'WETH':inputToken), findAddressByName(outToken=='ETH'?'WETH':outToken))
      addLiq(
        findAddressByName(inputToken),
        findAddressByName(outToken),
        toWei(toFixed(buyer*(1), getTokenByName(inputToken).decimal||18), getTokenByName(inputToken).decimal||18),
        toWei(toFixed(seller*(1), getTokenByName(outToken).decimal||18), getTokenByName(outToken).decimal||18),
        0, 0,
        outToken == 'ETH' || inputToken == 'ETH'
      ).then(res => {
        OpenNotification('success', 'Transaction Succeed', 'Successful')
        setLoading(false)
        setRefresh(refresh + 1)
        setBuyer('')
        setSeller('')
      }).finally(err => {
        setLoading(false)
        setRefresh(refresh + 1)
      })
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }, [inputToken, outToken, pairCreated, seller, buyer])
  // 获取balance
  useEffect(async () => {
    if (props.account) {
      setLoadingInputBalance(true)
      let bal = await getBalance(props.account, findAddressByName(inputToken))
      console.log(bal)
      setinputBalance(bal)
      setLoadingInputBalance(false)
    } else {
      setinputBalance(0)
    }
  }, [inputToken, props.account, refresh])

  useEffect(async () => {
    if (props.account) {
      setLoadingOutputBalance(true)
      let bal = await getBalance(props.account, findAddressByName(outToken))
      setOutBalance(bal)
      setLoadingOutputBalance(false)
    } else {
      setOutBalance(0)
    }
  }, [outToken, props.account, refresh])

  useEffect(async () => {
    try {

      let pairs = await getPair(findAddressByName(inputToken == 'ETH'?'WETH':inputToken), findAddressByName(outToken== 'ETH'?'WETH':outToken)).call()
      // console.log(pairs1)
      // let pairs = findAddressByName(inputToken+'-'+outToken) || findAddressByName(outToken+'-'+inputToken)
      console.log(pairs)
      let { reserve0: reserve_x, reserve1: reserve_y } = await getReserves(pairs)
      console.log(reserve_x)
      let reserveIn = findAddressByName(inputToken == 'ETH'?'WETH':inputToken) < findAddressByName(outToken== 'ETH'?'WETH':outToken) ? reserve_x : reserve_y
      let reserveOut = findAddressByName(inputToken == 'ETH'?'WETH':inputToken) > findAddressByName(outToken== 'ETH'?'WETH':outToken) ? reserve_x : reserve_y
      setPrice(new BigNumber(fromUnit(reserveOut, getTokenByName(outToken).decimal||18)).dividedBy(new BigNumber(fromUnit(reserveIn, getTokenByName(inputToken).decimal||18))).toString())
      if (findAddressByName(inputToken== 'ETH'?'WETH':inputToken) < findAddressByName(outToken== 'ETH'?'WETH':outToken)) {
        // setPrice(toFixed(reserve_y / reserve_x, 4))
        setReserveX(reserve_x)
      } else {
        // setPrice(toFixed(reserve_x / reserve_y, 4))
        setReserveX(reserve_y)
      }
      setPairCreated(!!pairs)
      setHaspair(reserve_x>0)

    } catch (err) {
      console.log(err)
      setPairCreated(false)
      setHaspair(false)
      
      setPrice(1)
      setReserveX(1)
    }


  }, [inputToken, outToken, refresh])

  useEffect(()=> {
    setSeller('')
      setBuyer('')
  }, [outToken, inputToken])


  useEffect(async () => {
    try {
      if(props.account) {
        let allow = await allowance(findAddressByName(inputToken), findAddressByName('SwapRouter'))
        console.log((allow)*1)
        setNeedApproveInput(fromUnit(allow, getTokenByName(inputToken).decimal||18)*1)
      }
    } catch (err) {

    }
  }, [inputToken, props.account, refresh])
  useEffect(async () => {
    try {
      if(props.account) {
        let allow = await allowance(findAddressByName(outToken), findAddressByName('SwapRouter'))
        console.log(allow)
        setNeedApproveOutput(fromUnit(allow, getTokenByName(outToken).decimal||18)*1)
      }
    } catch (err) {

    }
  }, [outToken, props.account, refresh])

  return (
    <div className='add-liquidity'>
      <div className='flex flex-center'>
        <img className='m-r-20 pointer' src={fanhui} alt="" onClick={props.Cancel} />
        <span className='fz-24 fwb c2b'>{t('Add Liquidity')}</span>
        {/* <img className='m-l-8' src={question} alt="" /> */}
      </div>
      <span className='c2b fz-14 lh-18 m-l-38'>{t('Provide liquidity to earn trading fees')}</span>
      <div className='liquidity-from m-t-24'>
        <div className='flex flex-last'>
          <span className='fz-14 c2b lh-18'>{t('Balance')}: {
            loadingInputBalance ? <Skeleton.Button active size={'small'} /> : (numFormat(fromUnit(inputBalance, getTokenByName(inputToken).decimal||18) || '0'))}</span>
        </div>
        <div className='m-t-14 flex flex-between flex-center'>
          <input
            className={'c2b fz-24 fwb lh-28 flex-1 flex w100 com_input '}
            type="text"
            placeholder='0'
            value={buyer}
            onChange={(e) => {
              if (testInput(e.target.value)) {
                return
              }
              console.log(price)
              setBuyer(e.target.value); hasPair && setSeller(e.target.value * price);
            }} />
          <div className='flex flex-center   p-l-5 p-r-5' onClick={() => toSelect('input')}>
            {/* <span className='c2b fz-14 m-r-16'>~$1,445</span> */}
            <div className='switch-coin flex flex-center flex-middle' >
            {
                  getTokenByName(inputToken).icon ?<img src={getTokenByName(inputToken).icon} alt="token-icon" className='token-icon'/>: <div className='token-icon'>{inputToken.substr(0, 2)}</div>  
                }
              <span className='c2b fz-18 m-l-7 m-r-12'>{inputToken}</span>
              <img src={bottomIcon} alt="" />
            </div>
          </div>
        </div>
        <div className='flex m-t-11 gap-19'>
          {
            option.map(el => {
              return (
                <div className='radio-btn flex-1 c2b fz-12 pointer'
                  key={el.label}
                  onClick={
                    () => {
                      setBuyer(fromUnit(inputBalance, getTokenByName(inputToken).decimal||18) * el.value / 100);
                      hasPair && setSeller(fromUnit(inputBalance, getTokenByName(inputToken).decimal||18) * el.value / 100 * price)
                    }
                  }
                >{el.label}</div>
              )
            })
          }
        </div>
      </div>
      <div className='add-icon flex flex-middle'>
        <img src={jiahao} alt="" />
      </div>
      <div className='liquidity-from'>
        <div className='flex flex-last'>
          <span className='fz-14 c2b lh-18'>{t('Balance')}: {
            loadingOutputBalance ? <Skeleton.Button active size={'small'} /> :
              (numFormat(fromUnit(outBalance, getTokenByName(outToken).decimal||18) || '0'))}</span>
        </div>
        <div className='m-t-14 flex flex-between flex-center'>
          <input
            className={'c2b fz-24 fwb lh-28 flex-1 flex w100 com_input '}
            type="text"
            placeholder='0'
            value={seller}
            onChange={(e) => {
              if (testInput(e.target.value)) {
                return
              }
              setSeller(e.target.value);
              hasPair && setBuyer(e.target.value / price);
            }} />
          <div className='flex flex-center' onClick={() => toSelect('output')}>
            {/* <span className='c2b fz-14 m-r-16'>~$1,445</span> */}
            <div className='switch-coin flex flex-center flex-middle'>
            {
                  getTokenByName(outToken).icon ?<img src={getTokenByName(outToken).icon} alt="token-icon" className='token-icon'/>: <div className='token-icon'>{outToken.substr(0, 2)}</div>  
                }
              <span className='c2b fz-18 m-l-7 m-r-12'>{outToken}</span>
              <img src={bottomIcon} alt="" />
            </div>
          </div>
        </div>

        <div className='flex m-t-11 gap-19'>
          {
            option.map(el => {
              return (
                <div className='radio-btn flex-1 c2b fz-12 pointer' key={el.label}
                  onClick={
                    () => {
                      setSeller(fromUnit(outBalance, getTokenByName(outToken).decimal||18) * el.value / 100);
                      hasPair && setBuyer(fromUnit(outBalance, getTokenByName(outToken).decimal||18) * el.value / 100 / price)
                    }
                  }
                >{el.label}</div>
              )
            })
          }
        </div>
      </div>
      {<p className='flex flex-between m-t-24 m-b-1 p-l-20 p-r-16'>
        <span className='fz-14'>{t('Price')}</span>
        {
          hasPair ? <span>1 {inputToken} = {price} {outToken}</span> :
          <span>1 {inputToken} = {isNaN(seller / buyer)?'--':(seller / buyer)} {outToken}</span>
        }

      </p>}
      {<p className='flex flex-between p-l-20 p-r-16'>
        <span className='fz-14'>{t('Share of Pool')}</span>
        <span>{buyer ? toFixed(buyer * 100 / (fromUnit(reservex) * 1 + buyer * 1), 2) : '--'}%</span>
      </p>}
      {
          ((buyer*1 >needApproveInput*1) || (seller*1>needApproveOutput*1)) && (
            <div className='speed-info m-t-15 m-b-10'>
              {t("Approve more than")} {(buyer*1 >needApproveInput*1) && <span className='fwb fz-14'>{buyer||0} {inputToken} </span>} {(buyer*1 >needApproveInput*1) && (seller*1>needApproveOutput*1) && ' and '} {(seller*1>needApproveOutput*1) && <span className='fwb fz-14'>{seller||0} {outToken} </span>} 
              {t("to allow Ostrich liquidity complete this transaction.")}
            </div>
          )
        }
      { <span className="flex gap-20">
        {
          props.account ? (
            fromUnit(inputBalance, getTokenByName(inputToken).decimal||18)*1 < buyer*1 ?
              <Button disabled className='unlock-wallet fz-18 fwb'>{t('Insufficient Input token balance')}</Button>:
              fromUnit(outBalance, getTokenByName(outToken).decimal||18)*1 < seller*1 ?
              <Button disabled className='unlock-wallet fz-18 fwb'>{t('Insufficient Output token balance')}</Button>:
              ((buyer*1 >needApproveInput*1) || (seller*1>needApproveOutput*1) ? (
              <>
                {(buyer*1 >needApproveInput*1) &&
                  <Button loading={inputLoading} className='unlock-wallet fz-18 fwb' onClick={() => {
                    toApprove('input')
                  }}>{t('Approve')} {inputToken}</Button>}

                {(seller*1>needApproveOutput*1) &&
                  <Button loading={outputLoading} className='unlock-wallet fz-18 fwb' onClick={() => {
                    toApprove('output')
                  }}>{t('Approve')} {outToken}</Button>}
              </>
            ) : (
              <div className='flex flex-column w100'>
              {!pairCreated && <div className='w100 cy ta fz-14 '>{t('Liquidity not exist, you can create first')}</div>}
              <Button loading={loading} disabled={seller*buyer == 0} className={'unlock-wallet fz-18 fwb m-t-5 ' + (seller*buyer == 0 ?'disabled':'')} onClick={() => {
                toAdd()
              }}>{t(pairCreated ?'Add Liquidity':'Create Liquidity')}</Button>
              </div>
            ))
          ) :
            <Button className='unlock-wallet fz-18 fwb pointer' onClick={() => {
              showLogin()
            }}>{t('Connect Wallet')}</Button>
        }
      </span>
      }

      {
        <SelectToken closeFn={setShowSelect} input={inputToken} output={outToken} selectToken={(name) => confirmSelectToken(name, selectType)} show={showSelect} type={selectType}></SelectToken>
      }
    </div>
  )
}

function Liquidity(props) {
  const [showAdd, setShowAdd] = useState(false);
  const [linkShow, setLinkShow] = useState(false);
  const [openValue, setOpenValue] = useState('')
  const [LiquidityList, setLiquidityList] = useState([])
  const [loading, setLoading] = useState(false)
  const [removeloading, setRemoveLoading] = useState(false)
  const [addInput, setAddInput] = useState('')
  let { signAndSubmitTransaction } = useWallet()
  const [addOutput, setAddOutput] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [removePercent, setRmovePercent] = useState(0)
  const [showRemove, setShowRemove] = useState(false)
  const [slip, setSlip] = useState(localStorage.getItem(slip_name) || '90')
  let { t, i18n } = useTranslation()

  let location = useLocation()
  let [coinType, setCoinType] = useState(location.search ? location.search.replace('?', '').split('=')[2]?.toUpperCase() : '')
  const toApprove = (address)=>{
    setRemoveLoading(true)
    approve(address, findAddressByName('SwapRouter')).then(res => {
      setRefresh(refresh+1)
    }).finally(err => {
      setRemoveLoading(false)
    })
  }

  const toRemove = async (inputToken, outToken, value, reserve_x, reserve_y, supply) => {
    console.log(inputToken, outToken, value, reserve_x, reserve_y, supply)
    let assetReceive = new BigNumber((value)).multipliedBy((reserve_x)).dividedBy((supply)).toString()
    let baseReceive = new BigNumber((value)).multipliedBy((reserve_y)).dividedBy((supply)).toString()
    console.log(assetReceive, baseReceive)
    console.log(slip)

    setRemoveLoading(true)
    reduceLiq(
      findAddressByName(inputToken),
      findAddressByName(outToken),
      (toFixed((new BigNumber(value).minus(new BigNumber(1000))).toString(), 0)).toString(),
      (toFixed((new BigNumber(assetReceive).multipliedBy(new BigNumber(1).minus(new BigNumber(slip).dividedBy(100)))).toString(), 0)).toString(),
      (toFixed((new BigNumber(baseReceive).multipliedBy(new BigNumber(1).minus(new BigNumber(slip).dividedBy(100)))).toString(), 0)).toString(),
      outToken == 'ETH' || inputToken == 'ETH'
  ).then(res => {
    OpenNotification('success', 'Transaction Succeed')
    setRemoveLoading(false)
    setRmovePercent(0)
    setTimeout(() => {
      setRefresh(refresh + 1)
    }, 2000)
      // backfn()
  }).catch(err => {
    setRemoveLoading(false)
    console.log(err)
  })
  }
  useEffect(() => {
    if (coinType) {
      setShowAdd(true);
      setAddInput(coinType.split('-')[0]);
      setAddOutput(coinType.split('-')[1])
    }

  }, [coinType])

  useEffect(async () => {
     refresh == 0 && setLoading(true)
    if (props.account) {
      //  let all = await allPairs().call()
      //  console.log(all)
     let {data: lptoken_list} = await get('/api/evm/swap/pairs', {
        chain_id: getNetwork().networkId
    })
      let lp = []
      let p_balance = []
      let p_supply = []
      let p_reserve = []
      let p_approve = []
      let not_in_list_token = []
      let get_symbol_p = []

      lptoken_list.map(item => {
        console.log(item)
        console.log((item))
        if(!findNameByAddress(item.token0)) {
          not_in_list_token.push(item.token0)
          get_symbol_p.push(getSymbol(item.token0))
        }
        if(!findNameByAddress(item.token1)) {
          not_in_list_token.push(item.token1)
          get_symbol_p.push(getSymbol(item.token1))
        }
        p_balance.push(getBalance(props.account, (item.pair)))
        p_supply.push(getLpAmounts((item.pair)))
        p_reserve.push(getReserves((item.pair)))
        p_approve.push(allowance((item.pair), findAddressByName('SwapRouter')))
      })
      let balances = await Promise.all(p_balance)
      let supplies = await Promise.all(p_supply)
      let reserves = await Promise.all(p_reserve)
      let approves = await Promise.all(p_approve)
      let symbols = await Promise.all(get_symbol_p)
      console.log(symbols)
      console.log(supplies)
      console.log(reserves)
      console.log(approves)
      let extraList = localStorage.getItem(localName) ?JSON.parse(localStorage.getItem(localName)):[]
      not_in_list_token.map((inner, idx) => {
        !extraList.some(item => item.address.toLowerCase() == inner.toLowerCase()) && extraList.push({
          title: symbols[idx],
          address: inner,
          desc: symbols[idx]+ ' Token'
        })
      })
      localStorage.setItem(localName, JSON.stringify(extraList)) 
      console.log(supplies)
      console.log(reserves)
      console.log(approves)
      lptoken_list.map((item, index) => {
        (balances[index])>1000 && lp.push({
          name: findNameByAddress(item.token0)+'-'+findNameByAddress(item.token1),
          value:(balances[index]),
          reserve_x: item.token0 < item.token1 ?reserves[index].reserve0:reserves[index].reserve1,
          reserve_y: item.token0 < item.token1 ?reserves[index].reserve1:reserves[index].reserve0,
          supply: supplies[index],
          allow:approves[index],
          token0: item.token0,
          token1: item.token1,
          pair: item.pair
        })
      })
      console.log(lp)
      setLiquidityList(lp)
      setLoading(false)
    } else {
      setLiquidityList([])
      setLoading(false)
    }
  }, [props.account, showAdd, refresh])

  return (
    <div className="liquidity-content bgf ">
      <img className='min-pinecone' src={Pinecone} alt="" />
      {/* <img className='squirrel-left' src={squirrelLeft} alt="" />
      <img className='squirrel-right' src={squirrelRight} alt="" /> */}
      {
        showAdd ? (
          <AddLiquidity {...props} input={addInput} output={addOutput} Cancel={() => setShowAdd(false)}></AddLiquidity>
        ) : (
          <div className='liquidity-connect'>
            <div className='flex flex-center flex-between'>
              <span className='cb2 fz-24 fwb lg-28 fwb'>{t('Liquidity')}</span>
              <div>
                {/* <img className='m-r-20' src={setting2Icon} alt="" />
                <img src={settingIcon} alt="" /> */}
              </div>
            </div>
            <p className='m-t-8 m-b-33 c2b fz-14 lh-18'>{t('Add liquidity to receive LP tokens')}</p>
            {
              props.account ? (
                <div className='linked m-t-5'>
                  <p className='fz-14 lh-18 c2b'>{t('Your Liquidity')}</p>
                  {
                    loading ?
                      <div className="flex flex-center w100 flex-middle p-t-30 p-b-30">
                        <Loading />
                      </div>
                      :
                      LiquidityList.length == 0 ? <div className='ta w100 c05'>{t('No liquidity found')}</div> :
                        LiquidityList.map((el, i) => (
                          <div
                            className='linked-item '
                            key={i}
                            onClick={() => {
                              if (openValue === el.name) {
                                setOpenValue('')
                              } else {
                                setOpenValue(el.name)
                              }
                            }}>
                            <div className='flex flex-between flex-center' >
                              <div className='flex flex-center pr'>
                              {
                                  getTokenByName(el.name.split('-')[0]).icon ? <img className='coin-left' src={getTokenByName(el.name.split('-')[0]).icon} alt="" />: <div className="coin-left fz-10">{el.name.split('-')[0].substr(0,2)}</div>
                                }
                                {
                                  getTokenByName(el.name.split('-')[1]).icon ? <img className='coin-right' src={getTokenByName(el.name.split('-')[1]).icon} alt="" />: <div className="coin-right fz-10">{el.name.split('-')[1].substr(0,2)}</div>
                                }
                                <span className='m-l-55 fwb'>{el.name}</span>
                              </div>
                              <div className='flex flex-center'>
                                <span className='m-r-4'>{toFixed(fromUnit(el.value), decimal)}</span>
                                <img src={bottomIcon} alt="" />
                              </div>
                            </div>
                            {
                              openValue === el.name && (
                                <div className='token-detail bgf m-t-20'>
                                  <div className='flex flex-between'>
                                    <div className='flex flex-center'>
                                    {
                                  getTokenByName(el.name.split('-')[0]).icon ? <img className='m-r-10 icon' src={getTokenByName(el.name.split('-')[0]).icon} alt="" />: <div className='m-r-10 icon fz-10'>{el.name.split('-')[0].substr(0,2)}</div>
                                }
                                      <span>{t('Pooled')} {findNameByAddress(el.token0)}</span>
                                    </div>
                                    <span>{el.supply ? toFixed(fromUnit(el.reserve_x * (el.value / el.supply), getTokenByName(findNameByAddress(el.token0)).decimal||18), decimal) : '--'}</span>
                                  </div>
                                  <div className='flex flex-between m-t-5'>
                                    <div className='flex flex-center'>
                                    {
                                  getTokenByName(el.name.split('-')[1]).icon ? <img className='m-r-10 icon' src={getTokenByName(el.name.split('-')[1]).icon} alt="" />: <div className='m-r-10 icon fz-10'>{el.name.split('-')[1].substr(0,2)}</div>
                                }
                                      <span>{t('Pooled')} {findNameByAddress(el.token1)}</span>
                                    </div>
                                    <span>{el.supply ? toFixed(fromUnit(el.reserve_y * (el.value / el.supply), getTokenByName(findNameByAddress(el.token1)).decimal||18), decimal) : "--"}</span>
                                  </div>
                                  <div className='flex flex-center'>
                                    <hr className='share-line flex-1'></hr>
                                    <div>
                                      <span>{t('Share of Pool')}</span>
                                      <span className='c00c m-l-8'>{el.supply ? toFixed((el.value / el.supply) * 100, 2) : '--'}%</span>
                                    </div>
                                  </div>
                                  <div className='m-t-30 flex gap-10'>
                                    <div className='add-btn flex-1'>
                                      <Button className='add-btn-in flex flex-middle flex-center pointer' onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAdd(true); setAddInput(findNameByAddress(el.token0)); setAddOutput(findNameByAddress(el.token1))
                                      }}>
                                        <span>{t('Add')}</span>
                                      </Button>
                                    </div>
                                    {
                                      !showRemove ?
                                        <Button className='remove-btn flex-1 pointer' loading={removeloading} onClick={(e) => { e.stopPropagation(); setShowRemove(true) }}><span className='cf'>{t('Remove')}</span></Button>
                                        :
                                        <Button className='remove-cancel-btn flex-1 pointer' loading={removeloading} onClick={(e) => { e.stopPropagation(); setShowRemove(false) }}>{t('Cancel')}</Button>
                                    }
                                  </div>
                                  {
                                    showRemove &&
                                    <div className="m-t-20">
                                      <div className='flex m-t-11 gap-19'>
                                        {
                                          option.map(el => {
                                            return (
                                              <div key={el.label} className={'radio-btn flex-1 c2b fz-12 pointer ' + (removePercent == el.value ? 'active' : '')} onClick={(e) => { e.stopPropagation(); setRmovePercent(el.value) }}>{el.label}</div>
                                            )
                                          })
                                        }
                                      </div>
                                      {
                                        fromUnit(el.allow)*1 < fromUnit(el.value)*1 * (removePercent / 100) ?
                                        <Button className='w100 color confirm-remove m-t-10' loading={removeloading} disabled={removePercent <= 0} onClick={(e) => { e.stopPropagation(); toApprove(el.pair)}}>{t('Approve')} {el.name}</Button>:
                                      <Button className='w100 color confirm-remove m-t-10' loading={removeloading} disabled={removePercent <= 0} onClick={(e) => { e.stopPropagation(); toRemove(findNameByAddress(el.token0), findNameByAddress(el.token1), (el.value) * (removePercent / 100), el.reserve_x, el.reserve_y, el.supply)}}>{t('Confirm Remove')}</Button>
                                      }
                                      
                                    </div>
                                  }

                                </div>
                              )
                            }
                          </div>
                        ))
                  }
                </div>
              ) : (
                <div className='you-liquidity flex flex-middle flex-column flex-center '>
                  <span className='c2b fz-14 lh-18'>{t('Your Liquidity')}</span>
                  <div className='no-connect-tips m-t-19'>
                    <div className='no-connect-tips-in flex flex-middle flex-center pointer' onClick={() => showLogin()}>
                      <span>{t('Connect to a wallet to view your liquidity.')}</span>
                    </div>
                  </div>
                </div>
              )
            }
            <Button className='add-liquidity-btn m-t-32 fz-18 fwb pointer' onClick={() => setShowAdd(true)}>+ {t('Add Liquidity')}</Button>
          </div>
        )
      }
    </div>
  )
}


export default reducxConnect(
  (state, props) => {
    return { ...state, ...props }
  }
)(
  Liquidity
);