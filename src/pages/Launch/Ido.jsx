import { Button, Select, Skeleton, Tooltip } from 'antd';
import Progress from './idoprogress'
import { useTranslation } from 'react-i18next';
import { UNIT_DECIMAL, ZERO_ADDRESS, findAddressByName, findNameByAddress, fromUnit, numFormat, showLogin, testInput, toFixed, toWei } from '../../lib/util';
import { useCallback, useEffect, useState } from 'react';
import { connect as reducxConnect } from 'react-redux'
import { buy, queryPrice, queryUserInfo } from '../../contracts/methods/presale';
import { get, get_without_tips } from '../../api';
import { getNetwork } from '../../contracts';
import { allowance, approve } from '../../contracts/methods/swap';
import { getETHNetwork } from '../../wallet/test';
import { MaxInt256 } from '@ethersproject/constants';
import { getTokenByName } from '../Dex/components/list';

const Ido = (props) => {
  let { t } = useTranslation()
  let [buyAmount, setBuyAmount] = useState('')
  let [allow_amount, setAllowance] = useState(0)
  let [refresh, setRefresh] = useState(0)
  let [loading, setLoading] = useState(false)
  let [isWhite, setIsWhite] = useState(false)
  let [currency, setCurrency] = useState('')
  let [price, setPrice] = useState(1)
  let [loadingPrice, setLoadingPrice] = useState(false)
  const toBuy = useCallback(async () => {
    console.log(currency)
    setLoading(true)
    let {data:{signature}} = await get_without_tips('/api/evm/presale/buyParams', {
      address: props.account,
      chain_id: getNetwork().networkId,
      contract: findAddressByName('Presale')
    })
    console.log(signature)
    buy(currency, toWei(toFixed(buyAmount * (1), UNIT_DECIMAL)), signature||'0x').then(res => {
      props.onOpenPage()
      setBuyAmount('')
    }).finally(res => {
      setLoading(false)
    })
  }, [props.account, buyAmount, currency])
  const toApprove = useCallback(() => {
    setLoading(true)
    approve(currency, findAddressByName('Presale')).finally(res => {
      setRefresh(refresh + 1)
      setLoading(false)
    })
  }, [currency])

  useEffect(async () => {
    if (props.account) {
      try {
        let allow = await allowance(currency, findAddressByName('Presale'))
        setAllowance(fromUnit(allow))
        let is_white = await get_without_tips('/api/evm/presale/user', {
          chain_id: getNetwork().networkId,
          address: props.account
        })
        setIsWhite(is_white.code == 1)
      } catch {
        setAllowance(0)
      }
    } else {
      setIsWhite(false)
    }
  }, [props.account, refresh,currency])

  useEffect(()=>{
     console.log(props.project?.currencies)
    setCurrency(props.project?.currencies?props.project?.currencies[0]:'')
  }, [props.project])

  useEffect(async ()=>{
    if(currency) {
      setLoadingPrice(true)
      let price_data = await queryPrice(currency)
      console.log(price_data)
      setPrice(fromUnit(price_data))
      setLoadingPrice(false)
    } else {
      setPrice(1)
    }
  }, [currency])

  return (
    <div className="project-participate p-l-24 p-r-24 p-b-24">
      <div className="status ongoing fz-14">{t(
        props.project.not_started ? 'Upcoming':
        props.project.isCompleted ? 'Completed':
        'Ongoing'
        )}</div>
      <div className="ido-title">
        {t('IDO Progress')}
      </div>
      <div className="fz-14 c236">
        {t('Total Cap')}
      </div>
      <div className="c231 fz-40 fwb m-b-10">{numFormat(fromUnit(props.project.tokenSupply))}</div>
      <Progress schedule={props.project.tokenSales * 100 / props.project.tokenSupply} />
      <div className="flex flex-between c05 fz-12 m-t-8">
        <span>{toFixed(props.project.tokenSales * 100 / props.project.tokenSupply, 2)}%</span>
        <span>{numFormat(toFixed(fromUnit(props.project.tokenSales), 2))}/{numFormat(fromUnit(props.project.tokenSupply))}</span>
      </div>
      <div className="ido-info fz-14 p-l-16 p-r-16 p-t-8 p-b-8 m-t-23">
        {/* <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Sold')}</span>
          <span className="c236">{numFormat(toFixed(fromUnit(props.project.tokenSales), 2))}</span>
        </div>
        <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Remaining')}</span>
          <span className="c236">{numFormat(toFixed(fromUnit(props.project.tokenSupply) - fromUnit(props.project.tokenSales), 2))}</span>
        </div> */}
        <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Swap Price')}</span>
          <span className="c236">{loadingPrice ? <Skeleton.Button active size={'small'} />:toFixed(fromUnit(props.project[isWhite?'privatePrice':'publicPrice'])/price, 2)} {findNameByAddress(currency)}</span>
        </div>
        {/* <div className="hr m-t-8 m-b-8"></div> */}
        <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Your Allocation')}</span>
          <span className="c236">{loadingPrice ? <Skeleton.Button active size={'small'} />:numFormat(toFixed(fromUnit(props.project.maxBuyAmount)/price,2))} {findNameByAddress(currency)}</span>
        </div>
       
        <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Minimum Buy Amount')}</span>
          <span className="c236">{loadingPrice ? <Skeleton.Button active size={'small'} />:numFormat(toFixed((fromUnit(props.project.minBuyAmount))/price, 2))} {findNameByAddress(currency)}</span>
        </div>
        
        <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Already Swaped')}</span>
          <span className="c236">{loadingPrice ? <Skeleton.Button active size={'small'} />:numFormat(toFixed(fromUnit(props.userInfo.totalPayment)/price, 2))} {findNameByAddress(currency)}</span>
        </div>

        <div className="ido-info-item w100 flex flex-between p-t-8 p-b-8">
          <span className="c231 fwb">{t('Remaining Allocation')}</span>
          <span className="c236">{loadingPrice ? <Skeleton.Button active size={'small'} />:numFormat(toFixed((fromUnit(props.project.maxBuyAmount) - fromUnit(props.userInfo.totalPayment))/price, 2))} {findNameByAddress(currency)}</span>
        </div>

      </div>
      {
        !props.project.isCompleted && 
        <div className="amount-area flex p-6 flex-center m-t-20">
        <input type="number" className='flex-1 p-l-6' value={buyAmount} onChange={(e) => {
          if (testInput(e.target.value)) {
            return
          }
          setBuyAmount(e.target.value);
        }} placeholder={t('Input your amount')} />
        {/* <div className="unit c236 ta">USDC</div> */}
        <Select defaultValue="1" className='my-select unit flex flex-middle flex-center' style={{ width: 110 }} value={currency} onChange={v =>setCurrency(v)} suffixIcon={
                <img src={require('../../assets/image/common/down.svg').default}></img>
              } >
                {
                  props.project?.currencies?.map(item => {
                    return <Select.Option value={item} key={item}> <img className='select-icon' src={getTokenByName(findNameByAddress(item)).icon} alt="" /> {findNameByAddress(item)}</Select.Option>
                  })
                }
              </Select>
      </div>
      }
      
      
      {!props.project.isCompleted ? (
        props.account ? (
          buyAmount * 1*price > (fromUnit(props.project.maxBuyAmount) - fromUnit(props.userInfo.totalPayment)) * 1 ?
            <Button className='color w100 fwb part-btn m-t-12' disabled>
              <span className='fz-16 fwb cf'>
                {t('Exceeding maximum buy amount')}
              </span>
            </Button> :
            (buyAmount * 1 *price< fromUnit(props.project.minBuyAmount) * 1) && buyAmount ?
              <Button className='color w100 fwb part-btn m-t-12' disabled>
                <span className='fz-16 fwb cf'>
                  {t('Less than minimum buy amount')}
                </span>
              </Button> :
              allow_amount * 1 < buyAmount * 1 ?
                <div className="flex flex-column">
                  <Button className='color w100 fwb part-btn m-t-12' loading={loading} onClick={toApprove} disabled={!props.account || !buyAmount}>
                    <span className='fz-16 fwb cf'>
                      {t('Approve')} {findNameByAddress(currency)}
                    </span>
                  </Button>
                  <div className='speed-info m-t-15'>
                    {t("Approve more than")} <span className='fwb fz-14'>{buyAmount} {findNameByAddress(currency)} </span>
                    {t("to allow Ostrich Launchpad to spend your")} {findNameByAddress(currency)} {t("for this transaction.")}
                  </div>
                </div>
                :
                <><Button className='color w100 fwb part-btn m-t-12' loading={loading} onClick={toBuy} disabled={!props.account || !buyAmount}>
                  <span className='fz-16 fwb cf'>
                    {t('Participate in IDO')}
                  </span>
                </Button>
                  {
                    buyAmount ? <div className="expect ta m-t-12 fz-13">{t('Expected')} {toFixed(buyAmount*price / fromUnit(props.project[isWhite?'privatePrice':'publicPrice']), 2)} Orich</div> : ''
                  }</>
        ) :
          <Button className='color w100 fwb part-btn m-t-12' onClick={showLogin}>
            <span className='fz-16 fwb cf'>
              {t('Connect Wallet')}
            </span>
          </Button>):(
            <Button disabled className='color w100 fwb part-btn m-t-12 disabled'>
            <span className='fz-16 fwb cf'>
              {t('Sold out')}
            </span>
          </Button>
          )
      }
      {
        props.account && isWhite ? <div className='block w100 cy fz-14 ta block p-t-10  flex flex-center flex-middle'> 
        <img src={require('../../assets/image/launchpad/white.svg').default} alt="" /> 
        {t("You're in Presale Whitelist")}
        <Tooltip title="The price on the whitelist will be cheaper">
        <img className='m-l-5' src={require('../../assets/image/launchpad/question.svg').default} alt="" />
        </Tooltip>
        </div>:''
      }





    </div>
  )

}

export default reducxConnect(
  (state, props) => {
    return { ...state, ...props }
  }
)(
  Ido
);