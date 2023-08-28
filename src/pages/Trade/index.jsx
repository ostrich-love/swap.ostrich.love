import './style.scss'
import { useCallback, useEffect, useState } from 'react';
import headSculpture from '../../assets/image/newTrade/headSculpture.svg'
import ORICH from '../../assets/image/newTrade/ORICH.svg'
import {connect as reducxConnect} from 'react-redux'
import Attention from '../../assets/image/newTrade/attention.svg'
import { claim, queryAllPoolViews, queryAllUserPoolViews } from '../../contracts/methods/tradingpool';
import { findNameByAddress, fromUnit, toFixed } from '../../lib/util';
import { useTranslation } from 'react-i18next';
import { getTokenByName } from '../Dex/components/list';
import BigNumber from 'bignumber.js';
import { Button, Radio } from 'antd';
import Loading from '../../components/common/Loading';
import Rank from './Rank';
// import { useNavigate } from 'react-router-dom';
const Index = (props) => {
  const [pools, setPools] = useState([])
  const [mypools, setMyPools] = useState([])
  const [selectId, setSelectId] = useState(1)
  const [totalVolume, setTotalVolume] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(0)
  const [myPendingRewards, setMyPendingRewards] = useState(0)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(1)
  const [rank, setRank] = useState(1)
  const [refresh, setRefresh] = useState(0)
  let { t, i18n } = useTranslation()
  const optionsWithDisabled = [
    {
      label: ('Trading'),
      value: 1,
    },
    {
      label: ('Ranking'),
      value: 2,
    }
  ];
  const rankOptions = [
    {
      label: ('24 hours'),
      value: 1,
    },
    {
      label: ('7 Days'),
      value: 2,
    },
    {
      label: ('30 Days'),
      value: 3,
    }
  ];
  // const Navigate = useNavigate()

  useEffect(async ()=>{
      let allpools = await queryAllPoolViews()
      let total_volume = 0
      let current_volume = 0
      let my_pending_rewards = 0
      if(props.account) {
        let my_pools = await queryAllUserPoolViews(props.account)
        console.log(my_pools)
        setMyPools(my_pools)
        my_pools.map(item => {
          my_pending_rewards= new BigNumber(my_pending_rewards).plus(new BigNumber(item.info.pendingReward)).toString()
        })
      }
      console.log(allpools)
      allpools.map(item => {
        total_volume = new BigNumber(total_volume).plus(new BigNumber(item.info.cumulativePoints)).toString()
        current_volume = new BigNumber(current_volume).plus(new BigNumber(item.info.points)).toString()
      })
      setTotalVolume(total_volume)
      setCurrentVolume(current_volume)
      setMyPendingRewards(my_pending_rewards)
      setPools(allpools)
  }, [props.account, refresh])

  const toHarvest  = useCallback(() => {
    if(myPendingRewards <=0) {
      return
    } 
    setLoading(true)
    claim().finally(res => {
      setRefresh(refresh+1)
      setLoading(false)
    })

  }, [myPendingRewards])

  return (
    <div className='farm-main'>
      <div className='heads'>
        <div className='title'>Swap Rewards</div>
        <div className='tip'>Multiple staking options for you to earn more rewards</div>
        {/* <div className='buttom'>Supply</div> */}
      </div>
      <div className='the-body'>
        <div className='head-card'>
          <div className='card'>
            <div className='title'>Total volume</div>
            <div className='value'>{toFixed(fromUnit(totalVolume),2)}</div>
          </div>
          <div className='card'>
            <div className='title'>Current volume (In pool)</div>
            <div className='value'>{toFixed(fromUnit(currentVolume),2)}</div>
          </div>
           <div className='card bg'>
            <div className='content-bg'>
              <div className='title'>Your withdrawable rewards ORICH</div>
              <div className='value'>
                <img src={ORICH} alt='' width={32} />
                <div className='number'> {toFixed(fromUnit(myPendingRewards),2)}</div>
              </div>
            </div>
            {
              myPendingRewards && <Button className='buttom' loading={loading} onClick={toHarvest}>Harvest</Button>
            }
            
          </div>
          
        </div>
        <div className='tip'> <img  src={Attention} alt=''/> After the withdrawal of your rewards, you will lose the transaction mining weight</div>
        <div className='trading'>
         <div className="flex flex-between rank-tab flex-center gap-10">
          <Radio.Group
            className='my-radio-card-main'
            options={optionsWithDisabled}
            onChange={(v) =>setStatus(v.target.value)}
            value={status}
            optionType="button"
            buttonStyle="solid" />
            {
              status == 2 &&<Radio.Group
              className='my-radio-card-mini'
              options={rankOptions}
              onChange={(v) =>setRank(v.target.value)}
              value={rank}
              optionType="button"
              buttonStyle="solid" />
            }
            

         </div>
         {
          status == 1 &&
          <div className='tips m-t-20'>All trading volume will mine Orich block output pro rate.Thus, the trading volume is similar to a 'mining machine' which will be distoried when you harvest.</div>
         }
        </div>
        {
          status == 1 && (
            <div className='content gap-40'>
          {pools.length ? pools.map((res, index) => {
            return (
              <div
                className={`${res.id === selectId ? 'farm-card ' : 'farm-card'}`}
                key={res.id}
                // onClick={() => setSelectId(res.id)}
              >
                <div className='card-content'>
                  <div className='title'>
                    <div className='logo'>
                      <div className="coin-logo">
                        <img src={getTokenByName(findNameByAddress(res.pool)?.split('-')[0]).icon } alt='' />
                        <img src={getTokenByName(findNameByAddress(res.pool)?.split('-')[1]).icon} alt='' />
                      </div>
                      <div className='information m-l-10'>
                        <div className='orich'>{findNameByAddress(res.pool)?.split('-')[0]}/{findNameByAddress(res.pool)?.split('-')[1]}</div>
                        {/* <div className='multi'>{} <span>{res.MultiNum}</span></div> */}
                      </div>
                    </div>
                    {/* <div className='APR'>
                      <div className='name'>APR</div>
                      <div className='percentage'>{toFixed(res.info.cumulativeRewards*100/res.info.cumulativePoints, 2)}%</div>
                    </div> */}
                  </div>
                  <div className='InformationBlock'>
                      <div className='row'>
                        <div className='left'>{t('Rewards allocated')}</div>
                        <div className='right'>{toFixed(fromUnit(res.info.cumulativeRewards), 2)} Orich</div>
                      </div>
                      <div className='row'>
                        <div className='left'>{t('Total volume')}</div>
                        <div className='right'>{toFixed(fromUnit(res.info.cumulativePoints), 2)}</div>
                      </div>

                      <div className='row'>
                        <div className='left'>{t('Current volume')}</div>
                        <div className='right'>{toFixed(fromUnit(res.info.points), 2)}</div>
                      </div>
                  </div>
                  <div className='line' />
                  <div className='cumulative'>
                    <div className='left'>{t('Cumulative reward')}</div>
                    <div className='right'>{t('My volume')}</div>
                  </div>
                  <div className='lastline'>
                    <div className='left'>{toFixed(fromUnit(new BigNumber(mypools[index]?.info?.claimedReward).plus(new BigNumber(mypools[index]?.info?.pendingReward))), 2)}</div>
                    <div className='right'>{toFixed(fromUnit(new BigNumber(mypools[index]?.info?.points)), 2)}</div>
                  </div>
                </div>
                <div className={`farm-foot`}>
                  <div className='title'>{t('Unclaimed reward')}</div>
                  <div className='value'>{toFixed(fromUnit(new BigNumber(mypools[index]?.info?.pendingReward)), 2)} Orich</div>
                </div>
              </div>
            )
          }):<div className='flex flex-middle w100'><Loading/></div>}
        </div>
          )
        }
        {
          status == 2 && <div className='content gap-40'>
          <Rank rank={rank}/>
        </div>
        }
        
        
       


      </div>
    </div>
  )
}

export default reducxConnect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Index
);