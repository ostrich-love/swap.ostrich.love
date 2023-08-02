import '../index.scss';
import { Button, Skeleton } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getTokenByName } from '../../Dex/components/list';
import { getLpToken } from '../../../methods/farm';
import { findAddressByName, findNameByAddress, fromUnit, numFormat, OpenNotification, testInput, toFixed, toUnit, toWei, UNIT_DECIMAL } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useSubmitTransiction } from '../../../methods/submit';
import { useTranslation } from 'react-i18next';
import { getBalance } from '../../../contracts/methods'; 
import { allowance, approve, deposit_flexible } from '../../../contracts/methods/farm';
import { deposit } from '../../../contracts/methods/prefarm';
const decimal = 6

const Stake = ({info, account, onSuccess}) => {
  const [bal, setBal] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [activePercent, setActivePercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [balanceRefresh, setBalanceRefresh] = useState(1)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [allow, setAllow] = useState(0)
  let { t, i18n } = useTranslation()
  const { submitTransiction } = useSubmitTransiction()

  const toPercent = (percent) => {
    setActivePercent(percent)
    if(bal>0) {
      setInputValue(toFixed(bal*percent/100,4))
    }
  }

  const toApprove = useCallback(()=>{
    try {
      setLoading(true)
      approve(info.depositToken, 
      findAddressByName(info.name)).then(res => {
        setBalanceRefresh(balanceRefresh+1)
      }).finally(err => {
        setLoading(false)
      })
    }catch {
      setLoading(false)
    }
  }, [info]) 
  const toDeposit = useCallback(async() => {
    setLoading(true)
      deposit(toWei(toFixed(inputValue*1, UNIT_DECIMAL)), info.depositToken).then(res => {
        setLoading(false)
        setInputValue('')
        setBalanceRefresh(balanceRefresh+1)
        onSuccess()
      }).finally(res => {
        setLoading(false)
      })
  }, [info, inputValue])
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
      <div className="w100 fz-14 c2b tr">{t('Balance')}: {balanceLoading?<Skeleton.Button active size={'small'} />:(numFormat(bal||'0'))}</div>
      <div className="bgEEF w100 p-l-16 p-t-22 p-b-22 p-r-16 flex bdr-24 m-t-10 flex-center">
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
        
        
        <input type="text" onChange={
          (e) => {
            if (testInput(e.target.value)) {
              return
            }
            setActivePercent(0)
            setInputValue(e.target.value)
          }
        } value={inputValue} className='com_input flex-1 tr fz-20 fwb' placeholder='0.00' />
      </div>
      {/* bgEEF w100  flex bdr-24 m-t-10 */}
      <div className="p-l-16 p-t-16 p-b-22 p-r-16 progress-wrap bdr-24 m-t-12">
        {/* <Progress /> */}
        {/* <div className="flex w100 percent-area m-t-12"> */}
        <div className="flex w100 percent-area">
          <span className={'percent-item pointer c2b fwb p-t-5 p-b-5 '+ (activePercent == 25 ? 'active':'')} onClick={()=>toPercent(25)}>25%</span>
          <span className={'percent-item pointer c2b fwb p-t-5 p-b-5 '+ (activePercent == 50 ? 'active':'')} onClick={()=>toPercent(50)}>50%</span>
          <span className={'percent-item pointer c2b fwb p-t-5 p-b-5 '+ (activePercent == 75 ? 'active':'')} onClick={()=>toPercent(75)}>75%</span>
          <span className={'percent-item pointer c2b fwb p-t-5 p-b-5 '+ (activePercent == 100 ? 'active':'')} onClick={()=>toPercent(100)}>{t('MAX')}</span>
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
      <Button onClick={toApprove} loading={loading} disabled={inputValue <=0} className="color cf w100 bdr-24 confirm-btn m-t-15 fz-16 fwb">
        <span className="cf">
        {t('Approve')} {findNameByAddress(info.depositToken)}
        </span>
      
    </Button>:<Button onClick={toDeposit} loading={loading} disabled={inputValue <=0} className="color cf w100 bdr-24 confirm-btn m-t-15 fz-16 fwb">
    <span className="cf"> {t('Confirm')}</span>
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