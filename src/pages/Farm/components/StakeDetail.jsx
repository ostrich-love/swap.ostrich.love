import '../index.scss';
import { Button, Skeleton } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { getTokenByName } from '../../Dex/components/list';
import { getLpToken } from '../../../methods/farm';
import { decimal, findAddressByName, findNameByAddress, formatTime, fromUnit, numFormat, OpenNotification, testInput, toFixed, toUnit } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useSubmitTransiction } from '../../../methods/submit';
import { getBalance} from '../../../methods/client.ts';
import { format } from 'path';
import { timeUnit } from '../../../global';
import { useTranslation } from 'react-i18next';
import myContext from '../createContext';
import { getPendingRewardByIndex } from '../../../methods/farmfixed';
import { withdraw_fixed } from '../../../contracts/methods/farm';

const Stake = ({info, account, toStake}) => {
  const [bal, setBal] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [activePercent, setActivePercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [balanceRefresh, setBalanceRefresh] = useState(1)
  let { t, i18n } = useTranslation()
  const { submitTransiction } = useSubmitTransiction()
  const {forceRefresh} = useContext(myContext)
  const toWithdraw = async(depositId) => {
    setLoading(true)
      withdraw_fixed(depositId, info.name).then(res => {
        forceRefresh()
        setLoading(false)
      }).finally(res=>{
        forceRefresh()
        setLoading(false)
      })
  }

  return (
    <div className='w100 stake-modal'>
     <div className='stake-list-area'>
     {
      info.deposit_list?.map((item, index) => {
         console.log(item)
         return (
          <div className='stake-item m-t-20' key={index}>
            <div className="fz-18 fwb">
              { numFormat(fromUnit(item.amount)) } {findNameByAddress(info.depositToken)} {t('Fixed')} </div>
            <div className="flex flex-between flex-center">
                <div className="flex flex-column">
                  <div className="fz-12 c236 m-t-5">{t('Stake duration')}: <span className='c2b fwb'>{item.lockUnits} {t('weeks')}</span> <span className="apr fz-12 m-l-5">{t('APY')}:{toFixed((info.apr/11.2)+((info.apr/11.2)*0.2*(item.lockUnits-1)), 2)}%</span></div>
                  <div className="fz-12 c236 m-t-5">{t('Stake Time')}: <span className='c2b fwb'>{formatTime(item.depositTime)}</span></div>
                  <div className="fz-12 c236 m-t-5">{t('Unlock Time')}: <span className='c2b fwb'>{formatTime(item.depositTime*1+(item.lockUnits*timeUnit)*1)}</span></div>
                  <div className="fz-12 c236 m-t-5">{t('Reward Amount')}: <span className='c2b fwb'>{numFormat(toFixed(fromUnit(item.reward), decimal))} Orich</span></div>
                </div>
                <Button className='color bdr-12 my-button' loading={loading} onClick={()=>toWithdraw(item.depositId)} disabled={(item.depositTime*1+(item.lockUnits*timeUnit)*1) > (new Date().getTime()/1000)}> <span className="cf">{t('Withdraw')}</span></Button>
            </div>
          </div>
         )

      })
     }
     </div>
     
     {
      info.deposit_list?.length==0 && <div className='ta w100 c05 m-t-20'> {t('No Stake Info found')} </div> 
     }
      
      <div className="get-text ta m-t-16 pointer" onClick={toStake}>
        {t('Stake more Fixed')} {findNameByAddress(info.depositToken)} {info.lptype == 'LPToken' && 'LP'}
      </div>

    </div>
  )
}


export default Stake