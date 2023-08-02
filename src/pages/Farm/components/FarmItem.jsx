
import '../index.scss';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate  } from 'react-router-dom'
import Modal from '../../../components/common/Modal'
import { getLpToken, getPendingReward, queryDepositInfo, queryPoolInfo } from '../../../methods/farm';
import { getLpToken as getLpTokenFixed, getPendingReward as getPendingRewardFixed, queryDepositInfo as queryDepositInfoFixed, queryPoolInfo as queryPoolInfoFixed} from '../../../methods/farmfixed';
import { findAddressByName, OpenNotification, toFixed } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useSubmitTransiction } from '../../../methods/submit';
import useInterval from '@use-it/interval';
import FarmListItem from './FarmListItem';
import FarmSquareItem from './FarmSquareItem';
import Stake from './Stake';
import UnStake from './UnStake';
import Reward from './Reward';
import BigNumber from 'bignumber.js';
import { queryTokenPairReserve } from '../../../methods/swap';
import { queryResource} from '../../../methods/client.ts';
import { useTranslation } from 'react-i18next';
import { refresh_interval } from '../../../global';
import { harvest_flexible } from '../../../contracts/methods/farm';
import { claim } from '../../../contracts/methods/prefarm';

const FarmItem = (props) => {
  const navigate  = useNavigate()
     const [showStake, setShowStake] = useState(false)
     const [showUnStake, setShowUnStake] = useState(false)
     const [showReward, setShowReward] = useState(false)
     let [refreshTrigger, setRefreshTrigger] = useState(0)
  let [claimLoading, setClaimLoading] = useState(false)
  let { t, i18n } = useTranslation()
  const { submitTransiction } = useSubmitTransiction()

     const toClaim = useCallback(async() => {
      setClaimLoading(true)
      claim(props.info.depositToken).then(res => {
        setClaimLoading(false)
      }).catch(err => {
        setClaimLoading(false)
      })
    }, [props.info])
    
    const goReward = ()=>{
      console.log(props.info,1111)
      // navigate({pathname: '/farm/reward', search: `index=${props.info.index}`})
      setShowReward(true)
    }

    useInterval(() => {
      setRefreshTrigger(refreshTrigger + 1);
    }, refresh_interval);
     return (
      <>
      {
      (props.type ? 
        <FarmSquareItem  claimLoading={claimLoading} flexibleType={'flexible'} info={props.info}  account={props.account} showStake={()=>setShowStake(true)} showUnStake={()=>setShowUnStake(true)} showReward={()=>setShowReward(true)} toClaim={toClaim}/>:
        <FarmListItem  claimLoading={claimLoading} flexibleType={'flexible'} info={props.info} account={props.account} showStake={()=>setShowStake(true)} showUnStake={()=>setShowUnStake(true)} showReward={()=>goReward()} toClaim={toClaim}/>
      )
    }

      <Modal isVisible={showStake} title={t("Stake")} onClose={() => setShowStake(false)}>
        <Stake info={props.info} account={props.account} onSuccess={() => {setRefreshTrigger(refreshTrigger+1);setShowStake(false)}} />
      </Modal>

      <Modal isVisible={showUnStake} title={t("UnStake")} onClose={() => setShowUnStake(false)}>
        <UnStake info={props.info} account={props.account} stakeNum={props.info.depositions?.depositAmount||0} onSuccess={() => {setRefreshTrigger(refreshTrigger+1);setShowUnStake(false)}}/>
      </Modal>


      <Modal isVisible={showReward} title={t("Reward")} onClose={() => setShowReward(false)} 
       info={t("The Orich obtained by the single currency pool needs to be unlocked by staking Orich-USDC to obtain rewards.")} border>
        <Reward info={props.info} account={props.account} pendingReward={props.info.pending_reward}  onSuccess={() => {setRefreshTrigger(refreshTrigger+1);}}/>
      </Modal>
      </>
      )
}

export default FarmItem