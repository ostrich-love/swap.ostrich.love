import '../index.scss';
import { Button } from 'antd';
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
    label: '1',
    value: 1
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '10',
    value: 12
  },
  {
    label: '25',
    value: 25
  },
  {
    label: '52',
    value: 52
  }
]

const Stake = ({ info, depositInfo, account, onSuccess }) => {
  const [bal, setBal] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [weekValue, setWeekValue] = useState('')
  const [activePercent, setActivePercent] = useState(0)
  const [loading, setLoading] = useState(false)
  // let { signAndSubmitTransaction } = useWallet()
  const { submitTransiction } = useSubmitTransiction()
  const toPercent = (percent) => {
    setActivePercent(percent)
    if (bal > 0) {
      setInputValue(toFixed(bal * percent / 100, 4))
    }
  }
  const toDeposit = async () => {
    console.log(depositInfo)
    if (loading) {
      return
    }
    setLoading(true)
    let payload = {
      type: "script_function_payload",
      function: `${getAddress().farm.fixed.address}::extend_deposition_script`,
      type_arguments: [info.lptype == 'LPToken' ? getLpToken(findAddressByName(info.token1), findAddressByName(info.token2)) : findAddressByName(info.token), findAddressByName(info.rewardToken)],
      arguments: [depositInfo.depositions[0].deposit_id, 0, weekValue],
    };
    submitTransiction(payload, () => {
      setLoading(false)
      onSuccess()
    }, () => {
      setLoading(false)
    })

  }
  useEffect(async () => {
    if (account) {
      let bal = await getBalance(account, info.lptype == 'LPToken' ? getLpToken(findAddressByName(info.token1), findAddressByName(info.token2)) : findAddressByName(info.token))
      setBal(toFixed(fromUnit(bal), 4))
    }
  }, [info, account])
  return (
    <div className='w100 stake-modal'>
      <div className="fz-16 fwb c2b">Extend Duration (Week)</div>
      <div className="duration-box flex flex-center flex-between gap-5 m-t-13">
        {
          durations.map(item => {
            return <div className={'duration-item bgEEF flex-1 ta bdr-12 c236 pointer ' + (weekValue == item.value ? 'active' : '')} onClick={() => { setWeekValue(item.value) }} key={item.value}>{item.label}</div>
          })
        }
        <div className="bgEEF flex-1 p-l-10 p-r-0 p-t-5 p-b-5 flex bdr-12">
          <input type="number" onChange={
            (e) => {
              if (testInput(e.target.value, 51)) {
                return
              }
              setWeekValue(e.target.value)
            }
          } value={weekValue} max={51} min={1} className='com_input flex-1 fz-18 fwb tl' placeholder='0' />
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
      <Button onClick={toDeposit} loading={loading} disabled={weekValue <= 0} className="color w100 bdr-24 confirm-btn m-t-30 fz-16 fwb">
        {
          
            weekValue <= 0 ? 'Input Week Amount' :
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