import { useEffect, useState } from 'react'
import './Farmpool.scss'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { queryPool } from '../../contracts/methods/farm';
import { getAprFixed, getApr, getOrichLockedAmount } from '../../lib/farm';
import { getAddress, getNetwork } from '../../contracts';
import BigNumber from 'bignumber.js';
import Activenumber from '../../components/common/Activenumber';
import { fromUnit } from '../../lib/util';
import { Skeleton } from 'antd';
import { get } from '../../api';
const showLine = function (tvl) {
    return {
      textStyle: {
        fontFamily:
          "Gilroy-Regular, -apple-system,BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,0.8)",
        axisPointer: {
          type: "cross",
          label: {
            show: false,
          },
          lineStyle: {
            color: '#f68731',
          },
          crossStyle: {
            color: '#f68731',
          },
        },
        extraCssText: "z-index: 2",
      },
      grid: {
        top: 30,
        bottom: 0,
        left: 0,
        right: 30,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: tvl?.map(item => item.date),
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#80706a",
            fontWeight: "normal",
          },
        },
        axisLabel: {
          padding: [0, 0, 0, 30],
        },
        splitLine: {
          show: false,
          onZero: false,
          lineStyle: {
            color: "#80706a",
            width: 1,
          },
        },
      },
      yAxis: [
        {
          show: true,
          type: "value",
          position: "right",
          // name: 'price',
          scale: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#80706a",
            },
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#111111",
              width: 1,
            },
          }
        }
      ],
  
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          data: tvl?.map(item => item.tvl),
          type: "line",
          symbol: "none",
          name: 'TVL',
          itemStyle: {
            normal: {
              // color: '#fff',
              lineStyle: {
                width: 2,
                color: "#f68731",
              },
            },
            emphasis: {
              lineStyle: {
                width: 2,
              },
            },
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#f68731", // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#fff', // 100% 处的颜色
              },
            ]),
            opacity: 0.3,
          },
        }
      ],
    };
  };
export default ({className, tvl, t}) => {
    let [options, setOptions] = useState(showLine(tvl))
    const [weelyReward, setWeeklyReward] = useState(0)
    const [OrichLocked, setOrichLocked] = useState(0)
    const [maxApr, setMaxApr] = useState(0)
    const [loading, setLoading] = useState(false)
     useEffect(() => {
        setOptions(showLine(tvl))
     }, [tvl])

useEffect(async() => {
    setLoading(true)
    try {
      let pools = []
      for(let i in getAddress()) {
        if(i.includes('FixedPool')) {
          pools.push({
            flexible_type: 'fixed',
            name: i
          })
        } else if(i.includes('FlexiblePool')) {
          pools.push({
            flexible_type: 'flexible',
            name: i
          })
        }
      }
      let pools_p = []
      pools.map(item => {
        pools_p.push(queryPool(item.flexible_type, item.name))
      })
      let pools_p_result = await Promise.all(pools_p)
      console.log(pools_p_result)
      let {data:prices} = await get('/api/evm/token/prices', {
        chain_id: getNetwork().networkId
      })
      let apr_p = []
      let orich_lock_p = []
      pools.map((item, index) => {
        orich_lock_p.push(getOrichLockedAmount(pools_p_result[index]))
        apr_p.push(item.flexible_type == 'fixed'?getAprFixed(pools_p_result[index],prices):getApr(pools_p_result[index]),prices)
      })
      let apr_p_result = await Promise.all(apr_p)
      let orich_lock_p_result = await Promise.all(orich_lock_p)
      console.log(apr_p_result)
      console.log(orich_lock_p_result)
      let total_weekly_reward = new BigNumber(0)
      let total_tvl = new BigNumber(0)
      let locked_orich = new BigNumber(0)
      pools_p_result.map(item => {
        total_weekly_reward = total_weekly_reward.plus(new BigNumber(item.weeklyReward))
        total_tvl = total_tvl.plus(new BigNumber(item.totalDeposits))
      })
      orich_lock_p_result.map(item => {
        locked_orich = locked_orich.plus(new BigNumber(item))
      })
      setOrichLocked(locked_orich)
     setWeeklyReward(total_weekly_reward.toString())
     setMaxApr(apr_p_result.filter(item => !isNaN(item) && item != 'Infinity').sort((a, b) => {return b-a})[0])
    setLoading(false)
    } catch (err) {
    setLoading(true)
      console.error(err)
    }
  }, [])
    return (
        <div className={"farmpool "+className}>
              <div className="title">
                {
                    t('The amazing reward Farm pool')
                }
              </div>
              <div className="tip">
              {t('Stake tokens to obtain extremely high returns')}
              </div>
              <ReactECharts className='react-echarts' option={options} style={{ width: '100%', height: '263px' }} />
              <div className="echart-name ta m-t-30">
                 <div className="fwb">{t('TVL daily trend chart')}</div>
                 {/* <div className="">2022/11/04 00:16:31 (UTC+8)</div> */}
              </div>
              <div className='flex flex-between flex-wrap w100 m-t-30 p-20 farm-items'>
                  <div className='list-item'>
                    <div className='percentage flex flex-center flex-middle'>{loading?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(weelyReward)} decimals={0}/>}</div>
                    <div className='user'>{t('Orich Reward Weekly')}</div>
                  </div>
                  <div className='list-item'>
                    <div className='percentage flex flex-center flex-middle'>{loading?<Skeleton.Button active size={'small'} />:<Activenumber value={maxApr} decimals={2}/>}%</div>
                    <div className='user'>{t('APR can reach')}</div>
                  </div>
                  <div className='list-item'>
                    <div className='percentage flex flex-center flex-middle'>20%</div>
                    <div className='user'>{t('NFT accelerated APR')}</div>
                  </div>
                  <div className='list-item'>
                    <div className='percentage flex flex-center flex-middle'>{loading?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(OrichLocked)} decimals={0}/>}</div>
                    <div className='user'>{t('Orich in lock')}</div>
                  </div>
              </div>

        </div>
    )
}