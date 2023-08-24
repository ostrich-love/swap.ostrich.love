import { NavLink } from 'react-router-dom';
import './index.scss';
import { Radio, Select, Skeleton, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import squirrelRight from '../../assets/image/launchpad/squirrel-right.png'
import listtype2 from '../../assets/image/farm/listtype.svg'
import listtype from '../../assets/image/farm/listtype2.svg'
import squaretype from '../../assets/image/farm/squaretype.svg'
import squaretype2 from '../../assets/image/farm/squaretype2.svg'
import { queryDepositInfo as queryDepositInfoFixed, getPendingReward as getPendingRewardFixed, queryPoolInfo as queryPoolInfoFixed} from '../../methods/farmfixed';
import { ZERO_ADDRESS, findAddressByName, findNameByAddress, fromUnit, toFixed } from '../../lib/util';
// import farmlist from '../../contract/farmlist';
import {connect as reducxConnect} from 'react-redux'
import {getAddress, getNetwork } from '../../contracts';
import useInterval from '@use-it/interval';
import Activenumber from '../../components/common/Activenumber';
import { queryTokenPairReserve } from '../../methods/swap';
import { queryResource} from '../../methods/client.ts';
import FarmList from './components/FarmList';
import { refresh_interval } from '../../global';
import myContext from './createContext';
import { useTranslation } from 'react-i18next';
import { queryPool, queryUserDeposition } from '../../contracts/methods/farm';
import BigNumber from 'bignumber.js';
import Loading from '../../components/common/Loading';
import { getApr, getAprFixed } from '../../lib/farm';
import { getReserves } from '../../contracts/methods/liquidity';
import { get } from '../../api';
import { queryAllPoolInfos, queryAllUserPoolInfos } from '../../contracts/methods/prefarm';
const decimal = 6

function Farm(props) {
  const optionsWithDisabled =(t)=> [
    {
      label: t('Active'),
      value: 1,
    },
    {
      label: t('Ended'),
      value: 2,
    },
    // {
    //   label: 'Upcoming',
    //   value: '3'
    // },
    // {
    //   label: 'Vesting',
    //   value: '4'
    // },
  ];
  const optionsSelect = [,
    {
      label: 'Hot',
      value: 1
    },
    // {
    //   label: 'APR',
    //   value: 2,
    // },
    {
      label: 'Total staked',
      value: 3,
    },
    {
      label: 'Earned',
      value: 4,
    },
    {
      label: 'Latest',
      value: 5,
    },
    // {
    //   label: 'Flexible pool in front',
    //   value: 6,
    // },
    // {
    //   label: 'Fixed pool in front',
    //   value: 7,
    // }
  ];
  const [tipsShow, setTipsShow] = useState(false);
  const [type, setType] = useState(0) // listtye 0:list 1:square
  const [weeklyReward, setWeeklyReward] = useState(0)
  const [orichprice, setPrice] = useState(0)
  const [showList, setShowList] = useState([])
  const [tvl, setTvl] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [farmlist, setFarmlist] = useState([])
  const [detailList, setDetailList] = useState([])
  const [filterText, setFilterText] = useState('')
  const [stakeOnly, setStakeOnly] = useState(false)
  const [status, setStatus] = useState(1)
  let { t, i18n } = useTranslation()
  const [sort, setSort] = useState(1)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    let list = [...farmlist]
    console.log(farmlist)
    console.log(filterText)
    console.log(list)
    console.log(status)
    console.log('sort', sort)
    list = list.filter(item => !filterText ||(findNameByAddress(item.depositToken))?.toLowerCase().includes(filterText.toLowerCase()))
    list = list.filter(item => !stakeOnly || item.depositions?.depositAmount > 0)
    list = list.filter(item => (status ==1 && item.endTime*1 > new Date().getTime()/1000) || (status == 2 && item.endTime*1 < new Date().getTime()/1000) || !item.endTime)
    list = list.sort((b, a) => {
      switch (sort) {
        case 1:
          return b.index - a.index;
          break;
        case 2: 
         
          return Number(isNaN(a.apr)?0:a.apr) - Number(isNaN(b.apr)?0:b.apr);
          break;
        case 3: 
          return Number(fromUnit(a.depositAmount))- Number(fromUnit(b.depositAmount));
          break;
        case 4: 
          return a.depositions?.depositAmount?(a.depositions?.depositAmount-b.depositions?.depositAmount):(a.index - b.index);
          break;
        case 5: 
          return a.depositStartTime?(a.depositStartTime-b.depositStartTime):(a.index - b.index);
          break;
        case 6: 
          return a.type?(a.type.length-b.type.length):(a.index - b.index);
          break;
        case 7: 
            return a.type?(b.type.length-a.type.length):(b.index - a.index);
            break;
        default:
          return a.index - b.index;
      }
    })
    setShowList(list)
  }, [filterText, farmlist, stakeOnly,status, sort])
  useEffect(async () => {
    let allpools = await queryAllPoolInfos()
    let my_deposit = []
    allpools.map(item => {
      my_deposit.push({
        claimTime: 0,
        depositAmount: 0,
        depositToken: ZERO_ADDRESS,
        reward: 0
      })
    })
    if(props.account) {
      let my_pools = await queryAllUserPoolInfos(props.account)
      console.log('===============')
      console.log(my_pools)
      my_deposit = [...my_pools]
    }
    let farm_list_will = []
    allpools.map((item, index) => {
      farm_list_will.push({
        ...item,
        ...item.config,
        type: 'flexible',
        depositions: my_deposit[index],
        apr: 0,
        name: findAddressByName(item.depositToken),
        reward: new BigNumber(my_deposit[index].depositAmount).multipliedBy(new BigNumber(item.config.totalReward)).dividedBy(new BigNumber(item.depositAmount)).toString(), 
        index,
        deposit_list: [],
        lptype: findAddressByName(item.depositToken).includes('-') ?' LPToken': 'single'
      })
    })

    setFarmlist(farm_list_will)
    console.log('////////////////////////////')
    console.log(farm_list_will)
  }, [props.account, refreshTrigger])
  useInterval(() => {
      setRefreshTrigger(refreshTrigger + 1);
    }, refresh_interval);

  return (
    <div className="farm p-b-140">
      <div className='farm-header-banner'>
        <div className="farm-banner-content flex flex-column flex-middle">
          {/* <div className='fz-40 c231 lh-50 farm-banner-content-name'>{t('Farm')}</div> */}
          {/* <div className="c231 fz-20 m-t-8 farm-banner-content-data">{t('Multiple staking options for you to earn more rewards')}</div> */}
        </div>
      </div>
      <div className='farm-content'>
        <div className='flex flex-between flex-center m-t-60 farm-search-left'>
          <div className="flex flex-center">
            <Radio.Group
              className='my-radio-card'
              options={optionsWithDisabled(t)}
              onChange={(v) =>setStatus(v.target.value)}
              value={status}
              optionType="button"
              buttonStyle="solid" />
            {/* <div className='list-type flex pointer'>
              <img src={!type ? listtype2 : listtype} alt="" className='m-l-20' onClick={() => { setType(0) }} />
              <img src={type ? squaretype2 : squaretype} alt="" className='m-l-15' onClick={() => { setType(1) }} />
              
            </div> */}
          </div>
          {/* <div className="flex flex-center farm-search-left ">
            <div className='fz-14 lh-18'>
              <span>{t('Total Value Locked')}:</span>
              <span className='fwb'> ${tvl?<Activenumber value={(tvl)} decimals={0}/>:<Skeleton.Button active size={'small'} />}</span>
            </div>

            <div className='fz-14 lh-18 m-l-20 m-r-20 m-t-5 m-b-5'>
              <span>Orich {t('Price')}:</span>
              <span className='fwb'> ${orichprice}</span>
            </div>

            <div className='fz-14 lh-18'>
              <span>{t('Weekly Rewards')}:</span>
              <span className='fwb'> {weeklyReward?<Activenumber value={fromUnit(weeklyReward)} decimals={0}/>:<Skeleton.Button active size={'small'} />} Orich</span>
            </div>
          </div> */}
          

          {/* <div className='fz-14 lh-18'>
            <span>Total Value Locked:</span>
            <span className='fwb'> $<Activenumber value={fromUnit(tvl)} decimals={4}/></span>
          </div> */}
        </div>
        <div className='flex flex-center flex-between m-t-22 search-condition'>

          <div className="search-input flex flex-center m-r-26 ">
            <input type="text" className='flex-1' placeholder={t('Search by token name')} onChange={(e) =>setFilterText(e.target.value)}/>
            <div className='p-r-13'>
              <SearchOutlined style={{ fontSize: 20 }} />
            </div>
          </div>
          <div className='flex flex-center search-right'>
            <div className='search-right-switch'>
              <Switch className='my-switch' checked={stakeOnly} onChange={(value) => setStakeOnly(value)} />
              <span className='fz-14 m-l-5'>{t('Staked Only')}</span>
            </div>
            <span className='flex flex-center sort-select'>
              <span className='c23 fz-14 m-r-8 m-l-30 sortby'>{t('Sort by')}</span>
              <Select defaultValue="1" className='my-select flex flex-middle flex-center' style={{ width: 120 }} value={sort} onChange={v =>setSort(v)} suffixIcon={
                <img src={require('../../assets/image/common/down.svg').default}></img>
              } >
                {
                  optionsSelect.map(item => {
                    return <Select.Option value={item.value} key={item.value}>{t(item.label)}</Select.Option>
                  })
                }
              </Select>
            </span>
            {/* <span className='flex flex-center sort-select'>
              <span className='c23 fz-14 m-r-8 m-l-24 sortby'>APR Basis</span>
              <Select defaultValue="1" className='my-select flex flex-middle flex-center' style={{ width: 120 }} suffixIcon={
                <img src={require('../../assets/image/common/down.svg').default}></img>
              } >
                {
                  optionsSelect.map(item => {
                    return <Select.Option value={item.value}>{item.label}</Select.Option>
                  })
                }
              </Select>
            </span> */}
            {/* <div className='refresh-btn pointer' onClick={()=>setRefreshTrigger(refreshTrigger + 1)}>
              <RedoOutlined />
            </div> */}
          </div>
        </div>
        <div className='flex flex-center flex-between m-t-30'>
          <div className='flex flex-column'>
            {/* <span className='fz-14 fwb lh-18'>{t('Farms will run in multiple phases')}</span> */}
            {/* <span className='fz-14 lh-18'>{t('Once the current phase ends, you can harvest your rewards from the farm in the Ended tab. To continue earning rewards in the new phase, you must restake your position into the active farm')}</span> */}
          </div>
          {/* <img className='squirrel-right' src={squirrelRight} alt="" /> */}
        </div>
        <myContext.Provider value={{forceRefresh: ()=>{
          setRefreshTrigger(refreshTrigger+1)
          }}}>
            {loading ? <div className='flex flex-center flex-middle p-t-50'><Loading/></div>:<FarmList farmlist={showList} type={type} account={props.account}/>}
        </myContext.Provider>
      </div>
    </div>
  )
}

export default reducxConnect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Farm
);