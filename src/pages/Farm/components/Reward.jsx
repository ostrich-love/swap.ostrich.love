import '../index.scss';
import { Button, Skeleton } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getTokenByName } from '../../Dex/components/list';
import { getLpToken } from '../../../methods/farm';
import { findAddressByName, findNameByAddress, fromUnit, OpenNotification, testInput, toFixed, toUnit, toWei, UNIT_DECIMAL } from '../../../lib/util';
import { explorerUrl, getAddress, getNodeUrl } from '../../../contract';
import { useSubmitTransiction } from '../../../methods/submit';
import { getBalance } from '../../../contracts/methods'; 
import Activenumber from '../../../components/common/Activenumber';
import farmlist from '../../../contract/farmlist';
import { getPendingReward } from '../../../methods/farm';
import useInterval from '@use-it/interval';
import { useTranslation } from 'react-i18next';
import { refresh_interval } from '../../../global';
import { getAvailabePoints, queryDepositAmount } from '../../../methods/unlocker';
import { allowance, approve, deposit_unlocker, harvest_flexible, queryPoints, queryPools, queryUserDeposition, queryUserDepositions, withdraw_unlocker } from '../../../contracts/methods/farm';
const decimal = 6

const Reward = (props) => {
   const [bal, setBal] = useState(0)
   const [unlockInfo, setUnlockerInfo] = useState(0)
   const [inputValue, setInputValue] = useState('')
   const [pendingReward, setPendingReward] = useState(0)
   const [activePercent, setActivePercent] = useState(0)
   const [loading, setLoading] = useState(false)
   const [loadingData, setLoadingData] = useState(false)
   const [balanceLoading, setBalanceLoading] = useState(false)
   const [balanceRefresh, setBalanceRefresh] = useState(1)
   const [refreshTrigger, setRefreshTrigger] = useState(1)
   const [depositAmount, setDepositAmount] = useState(0)
   const [rewardPoints, setRewardPoints] = useState(0)
  let { t, i18n } = useTranslation()
  const [showStake, setShowStake] = useState(false)
  const [allow, setAllow] = useState(0)
  const [unlockerPool, setPools] = useState({})
  const [showUnStake, setShowUnStake] = useState(false)
   const toPercent = (percent) => {
      setActivePercent(percent)
      console.log(depositAmount)
      if(showStake?bal>0:depositAmount>0) {
        setInputValue(toFixed((showStake?bal:fromUnit(depositAmount))*percent/100,4))
      }
    }
   const toClaim = useCallback(async () => {
      if(loading) {
         return
      }
      setLoading(true)
      harvest_flexible(props.info.name).then(res => {
         setLoading(false)
         setInputValue('')
         setBalanceRefresh(balanceRefresh + 1)
         props.onSuccess()
      }).finally(res => {
         setLoading(false)
      })
   }, [props.info])
   const toApprove = useCallback(()=>{
      try {
        setLoading(true)
        approve(findAddressByName(props.info.name), 
        findAddressByName('RewardUnlocker')).then(res => {
          setBalanceRefresh(balanceRefresh+1)
        }).finally(err => {
          setLoading(false)
        })
      }catch {
        setLoading(false)
      }
    }, [props.info]) 
   const toDeposit = async () => {
      setLoading(true)
      deposit_unlocker(toWei(toFixed(inputValue*1, UNIT_DECIMAL))).then(res => {
         setLoading(false)
         setInputValue('')
         setBalanceRefresh(balanceRefresh + 1)
         props.onSuccess()
      }).finally(res => {
         setLoading(false)
      })
   }
   const toUnstake = async () => {
      setLoading(true)
      setLoading(true)
      withdraw_unlocker(toWei(toFixed(inputValue*1, UNIT_DECIMAL))).then(res => {
         setLoading(false)
         setInputValue('')
         setBalanceRefresh(balanceRefresh + 1)
         props.onSuccess()
      }).finally(res => {
         setLoading(false)
      })
   }
   useEffect(async () => {
      if (props.account) {
         setLoadingData(true)
         // 获取总质押奖励数量
         let pending_p = []
         let my_deposit_flexible = await queryUserDeposition('flexible', props.account, props.info.name)
         setPendingReward(my_deposit_flexible.reward)
         

         let unlocker_info = await queryPoints(props.account)
         console.log(unlocker_info)
         setUnlockerInfo(unlocker_info)
         setLoadingData(false)
      } else {
         setPendingReward(0)
      }

   }, [props.info, props.account, refreshTrigger])
   useEffect(async () => {
      try {

         if (props.account) {
            setBalanceLoading(true)
            let bal = await getBalance(props.account, findAddressByName('Orich-USDC'))
            setBal(toFixed(fromUnit(bal), 4))
            setBalanceLoading(false)
            let allowance_amount = await allowance(findAddressByName('Orich-USDC'), findAddressByName('RewardUnlocker'))
            console.log(fromUnit(allowance_amount))
            setAllow(fromUnit(allowance_amount))
            let depositions = await queryUserDepositions(props.account)
            setDepositAmount(depositions?.amounts[0])
            let points = await queryPoints(props.account)
            setRewardPoints(points)
         }
         let pools = await queryPools()
         console.log(pools)
         setPools(pools[0])
      } catch(err) {
         console.log(err)
      }
   }, [props.info, props.account, balanceRefresh])
   useInterval(() => {
      setRefreshTrigger(refreshTrigger + 1);
   }, refresh_interval);
   return (
      <div className='w100 reward-modal p-t-24'>
         <div className="fz-12 fwb c2b ta">{t('Reward Amount')}</div>
         <div className="fz-24 fwb c2b ta m-t-5"><Activenumber value={fromUnit(pendingReward)} decimals={4} /> {findNameByAddress(props.info.rewardToken) }</div>
         <div className="staked w100 p-t-18 p-b-18 p-l-16 p-r-16 m-t-24">
            <div className="flex flex-between flex-center">
               <span className="c236 fz-14">{t('Staked')}</span>
               <span className='fz-14 fwb c2b'>
                  <img src={getTokenByName('Orich').icon} alt="" className='token-icon' />
                  <img src={getTokenByName('USDC').icon} alt="" className='token-icon right-icon' />
                  <span className='m-l-5'>
                  <Activenumber value={fromUnit(depositAmount)} decimals={4} /> Orich-USDC LP
                  </span>
               </span>
            </div>
            <div className="flex flex-between flex-center m-t-20">
               <span className="c236 fz-14">{t('Unlock Speed')}</span>
               <span className='fz-14 fwb c2b'>
                  {fromUnit(unlockerPool.unlockSpeed)*fromUnit(depositAmount)} Orich/{t('block')}
               </span>
            </div>
            <div className="btns flex gap-20 m-t-20">
               <Button className="unstake-btn btn  flex-1" loading={loading} onClick={()=>{setShowStake(false);setShowUnStake(true);setInputValue('')}}>
                  <span className='color-font'>{t('Unstake')}</span>
               </Button>
               <Button className="stake-btn color btn flex-1 fwb c2b" loading={loading} onClick={()=>{setShowUnStake(false);setShowStake(true);setInputValue('')}}> <span className="cf">{t('Stake')}</span></Button>
            </div>
            {
               showStake && (
                  <>
                     <div className="flex flex-between m-t-28">
                        <span className='fz-14 c236'>
                           <img src={getTokenByName('Orich').icon} alt="" className='token-icon' />
                           <img src={getTokenByName('USDC').icon} alt="" className='token-icon right-icon' />
                           <span className='m-l-5'>Orich-USDC LP</span>
                        </span>
                        <span className="fz-14 c236">{t('Balance')}: {balanceLoading ? <Skeleton.Button active size={'small'} /> : (bal || '0')}</span>
                     </div>
                     <div className="bgf w100 p-l-16 p-r-16 p-t-8 p-b-8 bdr-16 m-t-12">
                        <div className="w100 flex flex-center fwb">
                           <input type="text" placeholder='0' className='flex-1 com_input p-8 fz-20' value={inputValue} onChange={
                              (e) => {
                                 if (testInput(e.target.value)) {
                                 return
                                 }
                                 setActivePercent(0)
                                 setInputValue(e.target.value)
                              }
                           }/>
                           <span className='fz-14'>LP</span>
                        </div>
                        <div className="flex flex-last">
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 25 ? 'active':'')} onClick={()=>toPercent(25)}>25%</span>
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 50 ? 'active':'')} onClick={()=>toPercent(50)}>50%</span>
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 75 ? 'active':'')} onClick={()=>toPercent(75)}>75%</span>
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 100 ? 'active':'')} onClick={()=>toPercent(100)}>{t('MAX')}</span>
                        </div>
                     </div>
                     <div className="btns flex gap-20 m-t-20">
                     { (inputValue*1 > allow*1) ?
                        <Button onClick={toApprove} loading={loading} disabled={inputValue <=0} className="stake-btn color btn flex-1 fwb cf">
                           <span className="cf">
                           {t('Approve')} Orich-USDC
                           </span>
                        
                     </Button>:
                        <Button className="stake-btn color btn flex-1 fwb cf" loading={loading} disabled={inputValue <=0 || inputValue > bal*1} onClick={toDeposit}> <span className="cf">{t('Confirm Stake')}</span></Button>}
                     </div></>
               )
            }
            {
               showUnStake && (
                  <>
                     <div className="flex flex-between m-t-28">
                        <span className='fz-14 c236'>
                           <img src={getTokenByName('Orich').icon} alt="" className='token-icon' />
                           <img src={getTokenByName('USDC').icon} alt="" className='token-icon right-icon' />
                           <span className='m-l-5'>Orich-USDC LP</span>
                        </span>
                        <span className="fz-14 c236">{t('Staked')}: {balanceLoading ? <Skeleton.Button active size={'small'} /> : (fromUnit(depositAmount) || '0')}</span>
                     </div>
                     <div className="bgf w100 p-l-16 p-r-16 p-t-8 p-b-8 bdr-16 m-t-12">
                        <div className="w100 flex flex-center fwb">
                        <input type="text" placeholder='0' className='flex-1 com_input p-8 fz-20' value={inputValue} onChange={
                              (e) => {
                                 if (testInput(e.target.value)) {
                                 return
                                 }
                                 setActivePercent(0)
                                 setInputValue(e.target.value)
                              }
                           }/>
                           <span className='fz-14'>LP</span>
                        </div>
                        <div className="flex flex-last">
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 25 ? 'active':'')} onClick={()=>toPercent(25)}>25%</span>
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 50 ? 'active':'')} onClick={()=>toPercent(50)}>50%</span>
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 75 ? 'active':'')} onClick={()=>toPercent(75)}>75%</span>
                           <span className={'pointer fz-12 c236 m-l-16 '+ (activePercent == 100 ? 'active':'')} onClick={()=>toPercent(100)}>{t('MAX')}</span>
                        </div>
                     </div>
                     <div className="btns flex gap-20 m-t-20">
                    
                        <Button className="stake-btn color btn flex-1 fwb cf" loading={loading} disabled={inputValue <=0 || inputValue > fromUnit(depositAmount)*1} onClick={toUnstake}><span className="cf">{t('Confirm Unstake')}</span></Button>
                     </div></>
               )
            }




         </div>
         <div className="info-item flex flex-between w100 m-t-24">
            <span className="fz-13 c236">{t('Unlocked')} Orich</span>
            <span className="c2b fwb">
               {
                  loadingData ? <Skeleton.Button active size={'small'} /> : 
                  Number(rewardPoints) > Number(pendingReward) ? toFixed(fromUnit(pendingReward||0), decimal):toFixed(fromUnit(rewardPoints), decimal)
               } Orich
               <span className={"color-font fz-14 fwb m-l-12 pointer "+ (rewardPoints < 0 ? 'disabled':'')} onClick={toClaim}>{t('Claim')}</span>
            </span>
         </div>
         <div className="info-item flex flex-between w100 m-t-5">
            <span className="fz-13 c236">{t('Locked')} Orich</span>
            <span className="c2b fwb">
            <Activenumber value={Number(rewardPoints) > Number(pendingReward) ?0:toFixed(fromUnit(pendingReward-rewardPoints), decimal)} decimals={4} /> Orich
            </span>
         </div>

      </div>
   )
}


export default Reward