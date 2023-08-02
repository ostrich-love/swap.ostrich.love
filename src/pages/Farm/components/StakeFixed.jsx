import '../index.scss';
import { Button, Skeleton } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getTokenByName } from '../../Dex/components/list';
import { getLpToken } from '../../../methods/farm';
import { findAddressByName, findNameByAddress, formatTime, fromUnit, numFormat, OpenNotification, testInput, toFixed, toUnit, toWei, UNIT_DECIMAL } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { getBalance } from '../../../contracts/methods';
import { useSubmitTransiction } from '../../../methods/submit';
import { timeUnit } from '../../../global';
import { useTranslation } from 'react-i18next';
import Activenumber from '../../../components/common/Activenumber';
import { allowance, approve, deposit_fixed } from '../../../contracts/methods/farm';
import { calApr } from '../../../lib/farm';
const decimal = 6
const durations = [
  {
    label: '1W',
    value: 1
  },
  {
    label: '5W',
    value: 5
  },
  {
    label: '10W',
    value: 10
  },
  {
    label: '25W',
    value: 25
  },
  {
    label: '52W',
    value: 52
  }
]

const Stake = ({ info, account, onSuccess }) => {
  const [bal, setBal] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [weekValue, setWeekValue] = useState('')
  const [activePercent, setActivePercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [balanceRefresh, setBalanceRefresh] = useState(1)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [allow, setAllow] = useState(0)
  let { t, i18n } = useTranslation()
  const [apr, setApr] = useState('--')
  const { submitTransiction } = useSubmitTransiction()
  const toPercent = (percent) => {
    setActivePercent(percent)
    if (bal > 0) {
      setInputValue(toFixed(bal * percent / 100, 4))
    }
  }
  const toApprove = useCallback(()=>{
    try {
      setLoading(true)
      approve(info.depositToken, 
      findAddressByName(info.name)).then(res => {
        setBalanceRefresh(balanceRefresh+1)
        setLoading(false)
      }).finally(err => {
        setLoading(false)
      })
    }catch {
      setLoading(false)
    }
  }, [info]) 
  const toDeposit = useCallback(async () => {
    if (loading) {
      return
    }
    setLoading(true)
    deposit_fixed(toWei(toFixed(inputValue*1, UNIT_DECIMAL)), weekValue, info.name).then(res => {
      setLoading(false)
      onSuccess()
    }).finally(res => {
      setLoading(false)
    })
  }, [info, loading])
  useEffect(async() => {
    setApr(await calApr(info, weekValue, toUnit(inputValue||1)))
  }, [weekValue, inputValue, info])
  useEffect(async() => {
     if(account) {
        setBalanceLoading(true)
        let bal = await getBalance(account, info.depositToken)
        setBal(toFixed(fromUnit(bal), 4))
        setBalanceLoading(false)
        let allowance_amount = await allowance(info.depositToken, findAddressByName(info.name))
        console.log(fromUnit(allowance_amount))
        setAllow(fromUnit(allowance_amount))
      }
  }, [info, account, balanceRefresh])
  return (
    <div className='w100 stake-modal'>
      <div className="w100 fz-14 c2b flex flex-between w100 flex-center">
      <div className='c2b fwb fz-18'>
          {
            findNameByAddress(info.depositToken)?.split('-').map((item, i, arr) => {
              return <img src={getTokenByName(item).icon} key={item}  style={{ zIndex: arr.length - i }} alt="icon" className={`token-icon ${i>=1&&'right-icon'}`} />
            })
          }
          <span className='m-l-9'>
              {findNameByAddress(info.depositToken)}
            </span>
        </div>


        <span>
        Balance: {balanceLoading?<Skeleton.Button active size={'small'} />:numFormat(bal||'0')}
        </span>
      </div>
      <div className="bgEEF w100 p-l-16 p-t-22 p-b-12 p-r-16 flex bdr-24 m-t-10 flex-column">
        <input type="text" onChange={
          (e) => {
            if (testInput(e.target.value)) {
              return
            }
            setActivePercent(0)
            setInputValue(e.target.value)
          }
        } value={inputValue} className='com_input flex-1 fz-20 fwb' placeholder='0.00' />

        <div className="flex w100 flex flex-last">
          <span className={'percent-item pointer c236 p-t-5 m-l-20 ' + (activePercent == 25 ? 'active' : '')} onClick={() => toPercent(25)}>25%</span>
          <span className={'percent-item pointer c236 p-t-5 m-l-20 ' + (activePercent == 50 ? 'active' : '')} onClick={() => toPercent(50)}>50%</span>
          <span className={'percent-item pointer c236 p-t-5 m-l-20 ' + (activePercent == 75 ? 'active' : '')} onClick={() => toPercent(75)}>75%</span>
          <span className={'percent-item pointer c236 p-t-5 m-l-20 ' + (activePercent == 100 ? 'active' : '')} onClick={() => toPercent(100)}>MAX</span>
        </div>
      </div>
      <div className="fz-16 fwb c2b m-t-24">Select Duration (Week)</div>
      <div className="duration-box flex flex-center flex-between gap-5 m-t-13">
        {
          durations.map(item => {
            return <div className={'duration-item bgEEF flex-1 ta bdr-12 c236 pointer ' + (weekValue == item.value ? 'active' : '')} onClick={() => { setWeekValue(item.value) }} key={item.value}>{item.label}</div>
          })
        }
        <div className="bgEEF flex-1 p-l-10 p-r-0 p-t-5 p-b-5 flex bdr-12">
          <input type="number" onChange={
            (e) => {
              if (testInput(e.target.value, 52)) {
                return
              }
              setWeekValue(e.target.value)
            }
          } value={weekValue} max={52} min={1} className='com_input flex-1 fz-18 fwb tl' placeholder='0' />
        </div>
      </div>
      <div className="info-box p-16 m-t-34">
        <div className=" flex flex-between flex-center c2b fz-12">
          <span className="c236">Orich-USDC LP Amount</span>
          <span className="c2b fwb">{inputValue}</span>
        </div>
        <div className=" flex flex-between flex-center c2b fz-12 m-t-10">
          <span className="c236">Fixed Duration</span>
          <span className="c2b fwb">{weekValue}W</span>
        </div>
        <div className=" flex flex-between flex-center c2b fz-12 m-t-10">
          <span className="c236">APR</span>
          <span className="c2b fwb">{apr=='--'?'--':<Activenumber value={apr} decimal={2}/>}%</span>
        </div>
        <div className=" flex flex-between flex-center c2b fz-12 m-t-10">
          <span className="c236">Unlock Date</span>
          <span className="c2b fwb">{weekValue? formatTime(new Date().getTime()/1000+weekValue*timeUnit):'--'}</span>
        </div>
      </div>

      {
          (inputValue*1 > allow*1) && (
            <div className='ostrich-info m-t-15 m-b-10'>
              {t("Approve more than ")}<span className='fwb fz-14'>{inputValue||0} {findNameByAddress(info.depositToken)} </span> 
              {t("to allow Ostrich farm complete this transaction.")}
            </div>
          )
        }
      {
(inputValue*1 > allow*1) ?
      <Button onClick={toApprove} loading={loading} disabled={inputValue <=0} className="color w100 bdr-24 confirm-btn m-t-15 fz-16 fwb cf">
        <span className="cf">
        {t('Approve')} {findNameByAddress(info.depositToken)}
        </span>
      
    </Button>:<Button onClick={toDeposit} loading={loading} disabled={inputValue <= 0 || weekValue <= 0} className="color w100 bdr-24 confirm-btn m-t-30 fz-16 fwb cf">
    <span className="cf">{t(
          inputValue <= 0 ? 'Input An Amount' :
            weekValue <= 0 ? 'Input Week Amount' :
              'Confirm Stake')
        }</span>
      </Button>
      }
      <div className="flex flex-middle">
      <a className="get-text ta m-t-16 pointer" href={findNameByAddress(info.depositToken).includes('-') ?`/liquidity`:'/swap'}>
        {t('Get')} {
         findNameByAddress(info.depositToken)}
      </a>
      </div>

    </div>
  )
}


export default Stake