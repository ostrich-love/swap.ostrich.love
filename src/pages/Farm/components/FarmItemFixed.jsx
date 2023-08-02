
import '../index.scss';
import { useEffect, useState } from 'react';
import Modal from '../../../components/common/Modal'
import { getLpToken, getPendingReward, queryDepositInfo, queryPoolInfo } from '../../../methods/farm';
import { getLpToken as getLpTokenFixed, getPendingReward as getPendingRewardFixed, queryDepositInfo as queryDepositInfoFixed, queryPoolInfo as queryPoolInfoFixed } from '../../../methods/farmfixed';
import { findAddressByName, OpenNotification, toFixed } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useSubmitTransiction } from '../../../methods/submit';
import useInterval from '@use-it/interval';
import FarmListItem from './FarmListItem';
import FarmSquareItem from './FarmSquareItem';
import Stake from './StakeFixed';
import AddLp from './AddLp';
import ExtendDuration from './ExtendDuration';
import StakeDetail from './StakeDetail';
import { refresh_interval } from '../../../global';
import BigNumber from 'bignumber.js';
import { queryTokenPairReserve } from '../../../methods/swap';
import { useTranslation } from 'react-i18next';
import { queryResource } from '../../../methods/client.ts';

const FarmItem = (props) => {
  let [poolInfo, setPoolInfo] = useState({})
  const [showStake, setShowStake] = useState(false)
  const [showAddLp, setShowAddLp] = useState(false)
  const [showExtend, setShowExtend] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  let [depositInfo, setDepositInfo] = useState({})
  let { t, i18n } = useTranslation()
  let [pendingReward, setPendingReward] = useState(0)
  let [refreshTrigger, setRefreshTrigger] = useState(0)
  let [claimLoading, setClaimLoading] = useState(false)
  const { submitTransiction } = useSubmitTransiction()
  const [apr, setApr] = useState(0)

  const toClaim = async () => {
    setClaimLoading(true)
    let payload = {
      type: "script_function_payload",
      function: `${getAddress().farm.flexible.address}::harvest_script`,
      type_arguments: [props.info.lptype == 'LPToken' ? getLpToken(findAddressByName(props.info.token1), findAddressByName(props.info.token2)) : findAddressByName(props.info.token), findAddressByName(props.info.rewardToken)],
      arguments: [],
    };
    console.log(payload)
    submitTransiction(payload, () => {
      setClaimLoading(false)
    }, () => {
      setClaimLoading(false)
    })
  }




  useInterval(() => {
    setRefreshTrigger(refreshTrigger + 1);
  }, refresh_interval);
  return (
    <>
      {
        (props.type ?
          <FarmSquareItem claimLoading={claimLoading} flexibleType={'fixed'} info={props.info} account={props.account} showStake={() => setShowStake(true)} showAddLp={() => setShowAddLp(true)} showExtend={() => setShowExtend(true)} showDetail={() => setShowDetail(true)} toClaim={toClaim} /> :
          <FarmListItem claimLoading={claimLoading} flexibleType={'fixed'} info={props.info} account={props.account} showStake={() => setShowStake(true)} showAddLp={() => setShowAddLp(true)} showExtend={() => setShowExtend(true)} showDetail={() => setShowDetail(true)} toClaim={toClaim} />
        )
      }

      <Modal isVisible={showStake} title="Fixed Stake" onClose={() => setShowStake(false)}>
        <Stake info={props.info} account={props.account} onSuccess={() => { setRefreshTrigger(refreshTrigger + 1); setShowStake(false) }} />
      </Modal>

      {/* <Modal isVisible={showAddLp} title="Add Lp" onClose={() => setShowAddLp(false)}>
        <AddLp info={props.info} account={props.account}  depositInfo={props.info.depositions} onSuccess={() => {setRefreshTrigger(refreshTrigger+1);setShowAddLp(false)}}/>
      </Modal>


      <Modal isVisible={showExtend} title="Extend Durations" onClose={() => setShowExtend(false)}>
        <ExtendDuration info={props.info} account={props.account} depositInfo={depositInfo} onSuccess={() => {setRefreshTrigger(refreshTrigger+1);setShowExtend(false)}}/>
      </Modal> */}


      <Modal isVisible={showDetail} title={t("Fixed Staked Detail")} onClose={() => setShowDetail(false)}
        info={t("You can stake as many times as you want in a fixed pool, and you can choose different amounts and periods")} border>
        <StakeDetail info={props.info} account={props.account} toStake={() => {
          setShowDetail(false); setShowStake(true)
        }} onSuccess={() => { setRefreshTrigger(refreshTrigger + 1); }} />
      </Modal>
    </>
  )
}

export default FarmItem