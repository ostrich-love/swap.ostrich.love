import { useTranslation } from 'react-i18next';
import { formatTime, fromUnit, numFormat, toFixed } from '../../lib/util';
import { claim } from '../../contracts/methods/presale';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const ClaimList = ({buyAmount, claimStartTime, claimTimes, claimRecord}) => {
  let { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [canClaimIndex, setCanClaimIndex] = useState(0)

  const toClaim = () => {
    if(loading) {
      return
    }
    setLoading(true)
    try {
      claim().then(res => {
        setLoading(false)
      }).catch(err => {
        setLoading(false)
      })
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(!(claimStartTime*1) || claimTimes.length == 0) {
      setCanClaimIndex(0)
      return
    }
    let now_time = Date.now()/1000
    if(claimStartTime*1+claimTimes[0]*1 < now_time*1) {
      setCanClaimIndex(1)
    }
    if(claimStartTime*1+claimTimes[1]*1 < now_time*1) {
      setCanClaimIndex(2)
    }
    if(claimStartTime*1+claimTimes[2]*1 < now_time*1) {
      setCanClaimIndex(3)
    }
    if(claimStartTime*1+claimTimes[3]*1 < now_time*1) {
      setCanClaimIndex(4)
    }
  }, [claimStartTime, claimTimes])
  return (
    <table className='claim-table m-t-14'>
      <tr>
        <th>{t('Can be claimed after')}</th>
        <th>{t('Can be claimed amount')}</th>
        <th>{t("Claimed time")}</th>
        <th>{t('Action')}</th>
      </tr>
      <tr>
        <td>{claimStartTime*1?(formatTime(claimStartTime*1+claimTimes[0]*1)):'-'}</td>
        <td>{numFormat(toFixed(fromUnit(buyAmount)/2,2))} Orich</td>
        <td>{formatTime(claimRecord[0]?.timestamp)}</td>
        <td>
          {
            claimRecord.length >= 1 ?'':
            <span className={"claim-btn pointer "+(canClaimIndex==0?'disabled':'')} onClick={canClaimIndex>0?toClaim:()=>{return false}}>Claim {loading && <Spin indicator={<LoadingOutlined/>} size='small'/>}</span>
          }
        </td>
      </tr>
      <tr>
      <td>{claimStartTime*1?(formatTime(claimStartTime*1+claimTimes[1]*1)):'-'}</td>
        <td>{numFormat(toFixed(fromUnit(buyAmount)/6,2))} Orich</td>
        <td>{formatTime(claimRecord[1]?.timestamp)}</td>
            <td >
          {
            claimRecord.length >= 2 ?'':
            <span className={"claim-btn pointer "+(canClaimIndex<=1?'disabled':'')} onClick={canClaimIndex>1?toClaim:()=>{return false}}>Claim {loading && <Spin indicator={<LoadingOutlined/>} size='small'/>}</span>
          }
        </td>
      </tr>

      <tr>
      <td>{claimStartTime*1?(formatTime(claimStartTime*1+claimTimes[2]*1)):'-'}</td>
        <td>{numFormat(toFixed(fromUnit(buyAmount)/6,2))} Orich</td>
        <td>{formatTime(claimRecord[2]?.timestamp)}</td>
            <td >
          {
            claimRecord.length >= 3 ?'':
            <span className={"claim-btn pointer "+(canClaimIndex<=2?'disabled':'')} onClick={canClaimIndex>2?toClaim:()=>{return false}}>Claim {loading && <Spin indicator={<LoadingOutlined/>} size='small'/>}</span>
          }
        </td>
      </tr>

      <tr>
        <td>{claimStartTime*1?(formatTime(claimStartTime*1+claimTimes[3]*1)):'-'}</td>
        <td>{numFormat(toFixed(fromUnit(buyAmount)/6,2))} Orich</td>
        <td>{formatTime(claimRecord[3]?.timestamp)}</td>
            <td >
          {
            claimRecord.length >= 4 ?'':
            <span className={"claim-btn pointer "+(canClaimIndex<=3?'disabled':'')} onClick={canClaimIndex>3?toClaim:()=>{return false}}>Claim {loading && <Spin indicator={<LoadingOutlined/>} size='small'/>}</span>
          }
        </td>
      </tr>

    </table>
  )
}
export default ClaimList