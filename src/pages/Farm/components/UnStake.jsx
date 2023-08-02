import '../index.scss';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getTokenByName } from '../../Dex/components/list';
import { findNameByAddress, fromUnit, toFixed, toWei, UNIT_DECIMAL } from '../../../lib/util';
import { useTranslation } from 'react-i18next';
import { withdraw } from '../../../contracts/methods/prefarm';

const decimal = 6

const UnStake = ({info, account, stakeNum, onSuccess}) => {
  const [bal, setBal] = useState(fromUnit(stakeNum)||0)
  const [inputValue, setInputValue] = useState('')
  const [activePercent, setActivePercent] = useState(0)
  let { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)


  const toPercent = (percent) => {
    setActivePercent(percent)
    if(bal>0) {
      setInputValue(toFixed(bal*percent/100,4))
    }
  }

  const toUnstake = useCallback(async() => {
    setLoading(true)
    withdraw(toWei(toFixed(inputValue*1, UNIT_DECIMAL)), info.depositToken).then(res => {
      setInputValue('')
        setActivePercent(0)
        onSuccess()
      onSuccess()
    }).finally(res => {
      setLoading(false)
    })
  }, [info, inputValue])
  useEffect(() => {
    setBal(fromUnit(stakeNum))
  }, [stakeNum])
  return (
    <div className='w100 stake-modal'>
      <div className="w100 fz-14 c2b tr">{t('Total Staked')}: {toFixed(fromUnit(stakeNum)||'0', decimal)}</div>
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
      <Button onClick={toUnstake} loading={loading} disabled={inputValue <=0} className="color w100 bdr-24 confirm-btn m-t-15 fz-16 fwb">
        <span className="cf">
        {t('Confirm')}
        </span>
      </Button>

    </div>
  )
}


export default UnStake