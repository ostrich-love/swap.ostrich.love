import '../index.scss';
import { Button, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { getTokenByName } from '../../Dex/components/list';
import { getLpToken } from '../../../methods/farm';
import { findAddressByName, fromUnit, OpenNotification, testInput, toFixed, toUnit } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { getBalance } from '../../../methods/client.ts';
import { useSubmitTransiction } from '../../../methods/submit';
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
    value: 12
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

const Stake = ({ info,depositInfo, account, onSuccess }) => {
  const [bal, setBal] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [weekValue, setWeekValue] = useState('')
  const [activePercent, setActivePercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [balanceRefresh, setBalanceRefresh] = useState(1)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const { submitTransiction } = useSubmitTransiction()
  const toPercent = (percent) => {
    setActivePercent(percent)
    if (bal > 0) {
      setInputValue(toFixed(bal * percent / 100, 4))
    }
  }
  const toDeposit = async () => {
    if (loading) {
      return
    }
    setLoading(true)
    let payload = {
      type: "script_function_payload",
      function: `${getAddress().farm.fixed.address}::extend_deposition_script`,
      type_arguments: [info.lptype == 'LPToken' ? getLpToken(findAddressByName(info.token1), findAddressByName(info.token2)) : findAddressByName(info.token), findAddressByName(info.rewardToken)],
      arguments: [depositInfo.depositions[0].deposit_id, toUnit(inputValue), 0],
    };
    submitTransiction(payload, () => {

      setLoading(false)
      onSuccess()
    }, () => {
      setLoading(false)
    })

  }
  
  useEffect(async() => {
    if(account) {
       setBalanceLoading(true)
       let bal = await getBalance(account, info.lptype=='LPToken'? getLpToken(findAddressByName(info.token1),findAddressByName(info.token2)):findAddressByName(info.token))
       setBal(toFixed(fromUnit(bal), 4))
       setBalanceLoading(false)
     }
 }, [info, account, balanceRefresh])
  return (
    <div className='w100 stake-modal'>
      <div className="w100 fz-14 c2b flex flex-between w100 flex-center">
        {
          info.lptype == 'LPToken' ?
            <div className='c2b fwb fz-14'>
              <img src={getTokenByName(info.token1).icon} alt="icon" className='token-icon-out' />
              <img src={getTokenByName(info.token2).icon} alt="icon" className='token-icon-out right-icon' />
              <span className='m-l-9'>
                {info.token1}-{info.token2}
              </span>
            </div> :
            <div className='c2b fwb fz-14'>
              <img src={getTokenByName(info.token).icon} alt="icon" className='token-icon-out' />
              <span className='m-l-9'>
                {info.token}
              </span>
            </div>
        }
        <span>
          Balance: {balanceLoading?<Skeleton.Button active size={'small'} />:(bal||'0')}
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
          <span className="c2b fwb">--%</span>
        </div>
        <div className=" flex flex-between flex-center c2b fz-12 m-t-10">
          <span className="c236">Unlock Date</span>
          <span className="c2b fwb">2023-02-09 21:00</span>
        </div>
      </div>
      <Button onClick={toDeposit} loading={loading} disabled={inputValue <= 0} className="color w100 bdr-24 confirm-btn m-t-30 fz-16 fwb">
        {
          inputValue <= 0 ? 'Input An Amount' :
              'Confirm Stake'
        }
      </Button>
      <div className="get-text ta m-t-16 pointer">
        Get {
          info.lptype == 'LPToken' ?
            (info.token1 + '-' + info.token2) :
            info.token
        } {info.lptype == 'LPToken' && 'LP'}
      </div>

    </div>
  )
}


export default Stake