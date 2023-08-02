import './Swap.scss'
import LeftLogo from '../../../assets/image/launchpad/swap_left_log.png'
import Coin1 from '../../../assets/image/launchpad/coin-1.png'
import Coin2 from '../../../assets/image/launchpad/coin-2.png'
import Switch from '../../../assets/image/launchpad/switch.svg'
import Line from '../../../assets/image/launchpad/line.svg'
import lineNew from '../../../assets/image/launchpad/lineNew.svg'
import bottomIcon from '../../../assets/image/launchpad/bottom-icon.svg';
import Column from '../../../assets/image/launchpad/column-icon.svg'
import ColumniconNew from '../../../assets/image/launchpad/column-iconNew.svg'
import question from '../../../assets/image/common/question.svg';

import { Modal, Radio, Select, Skeleton, Spin } from 'antd'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { reqKlineList, reqTrendlineList } from '../../../api/dex'
import { showK, showLine } from './chart'
import list, { getTokenByName } from './list'
import { calcVolume, decimal, findAddressByName, formatTime, toFixed } from '../../../lib/util'
import { queryTokenPairReserve } from '../../../methods/swap'
import Loading from '../../../components/common/Loading'
import { getNetwork } from '../../../contracts'
import { getReserves } from '../../../contracts/methods/liquidity'

function Swap(props) {
  const optionsData = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: 'ALL', value: 'all' }
  ]

  const DOUBLE_BTN = [
    { label: 'Max', value: '1' },
    { label: 'Half', value: '1' },
    { label: '75%', value: '1' },
    { label: '25%', value: '1' },
    { label: '12%', value: '1' }
  ]
  const tokenSelect = [
    {
      label: 'Orich/USDC', value: 'Orich/USDC'
    },
    {
      label: 'Orich/WETH', value: 'Orich/WETH'
    },
    {
      label: 'WETH/USDC', value: 'WETH/USDC'
    },
    {
      label: 'USDT/USDC', value: 'USDT/USDC'
    },
    // {
    //   label: 'APT/USDC', value: 'APT/USDC'
    // },
  ]
  const [timeValue, setTimeValue] = useState('1d');
  const [ChartType, setChartType] = useState('line')
  let [timeType, setTimeType] = useState(1)

  const [options, setOptions] = useState({})
  const [loading, setLoading] = useState(false)
  const [tokenPair, setTokenPair] = useState('Orich/USDC')
  const [priceData, setPriceData] = useState([])
  const [price, setPrice] = useState('')

  const onChange = ({ target: { value } }) => {
    setTimeValue(value);
  };

  const tokenChange = (e) => {
    props.tokenChange(e)
    setTimeType(1)
    setTokenPair(e)
  }

  const getPrice = async (name) => {
    console.log(name)
    let { reserve0, reserve1 } = await getReserves(findAddressByName(name))
    let reserve_x = findAddressByName(name.split('-')[0]) < findAddressByName(name.split('-')[1]) ? reserve0 : reserve1
    let reserve_y = findAddressByName(name.split('-')[0]) < findAddressByName(name.split('-')[1]) ? reserve1 : reserve0
    setPrice(toFixed(reserve_y / reserve_x, decimal))
  }
  const getChart = async (timeValue, ChartType, name) => {
    let interval = 300;
    let startTime = 0;
    let timeUnit = 1000
    setLoading(true)
    // []string{"5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"}
    switch (timeValue) {
      case 1:
        startTime = Math.floor(new Date(new Date().getTime() - 48 * 3600 * 1000).getTime() / timeUnit).toString()
        break;
      case 2:
        startTime = Math.floor(new Date(new Date().getTime() - 48 * 7 * 3600 * 1000).getTime() / timeUnit).toString()
        break;
      case 3:
        startTime = Math.floor(new Date(new Date().getTime() - 48 * 30 * 3600 * 1000).getTime() / timeUnit).toString()
        break;
      case 4:
        startTime = 0
        break;
      case 5:
        interval = 5 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      case 6:
        interval = 15 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      case 7:
        interval = 30 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      case 8:
        interval = 60 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      case 9:
        interval = 4 * 60 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      case 10:
        interval = 24 * 60 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      case 11:
        interval = 7 * 24 * 60 * 60
        startTime = Math.floor(new Date(new Date().getTime() - interval * 600 * 1000).getTime() / timeUnit).toString()
        break;
      default:
        interval = 5 * 60
        break;
    }

    let fun = timeValue <= 4 ? reqTrendlineList : reqKlineList
    let { data: list } = (await fun({
      pair: name,
      interval,
      from: startTime,
      chain_id: getNetwork().networkId
    })).data;
    console.log(list)
    list = [...calcVolume(list, timeValue*1==4)]
    // if(timeValue == 1) {
    //   setPriceData([list[0], list[list.length-1]])
    // }

    let xaxis = []
    let yaxis = []
    let ConstList = [];

    ConstList = list || [{
      close: '0',
      open: '0',
      low: '0',
      high: '0',
      time: 0
    }]
    console.log(ConstList)

    if (timeValue * 1 >= 5) {
      console.log('////////////')
      console.log(priceData[1].close)
      ConstList[ConstList.length - 1].close = priceData[1].close
    }
    ConstList.map((item) => {
      xaxis.push((item.time * timeUnit))
      ChartType === 'line' ? yaxis.push(toFixed(Number(item.open), 4)) :
        yaxis.push([toFixed(Number(item.open), 4), toFixed(Number(item.close), 4), toFixed(Number(item.low), 4), toFixed(Number(item.high), 4)])
      item.volume_24 = item.volume_24 || 0
      return item
    })



    let today = formatTime(new Date().getTime() / 1000).split(' ')[0]
    let lastday = formatTime(new Date().getTime() / 1000 - 24 * 60 * 60).split(' ')[0]
    console.log(new Date(today).getTime(), new Date(lastday).getTime())
    let EightPrice = ConstList.find((item) => {
      return item.time * 1 == (new Date().getTime() * 1 < new Date(today).getTime() ? new Date(lastday).getTime() / 1000 : new Date(today).getTime()) * 1 / 1000
    })
    console.log(EightPrice)
    if (!EightPrice?.open) {
      EightPrice = ConstList[0]
    }
    timeValue == 1 && setPriceData([EightPrice, ConstList[ConstList.length - 1]])
    setOptions(ChartType === 'line' ?
      showLine(xaxis, yaxis, echarts, timeValue, ConstList[ConstList.length - 1].open * 1 > EightPrice.open * 1 ? 'green' : ConstList[ConstList.length - 1].open * 1 < EightPrice.open * 1 ? 'blue' : 'grey', ConstList) :
      showK(xaxis, yaxis, timeValue, ConstList))
    // getOption(close, time)
    setLoading(false)
  }
  useEffect(() => {
    getChart(timeType, ChartType, tokenPair.replace('/', '-'))
    getPrice(tokenPair.replace('/', '-'))
    let timer = setInterval(() => {
      getPrice(tokenPair.replace('/', '-'))
    }, 10000)
    return () => {
      clearInterval(timer)
    }
  }, [timeType, ChartType, tokenPair])

  return (
    <div className="swap-left bgf">
      {/* <div className='swap-left-pro'>
          <span>Pro</span>
          <img className='m-l-4' src={question} alt="" />
        </div> */}
      <Select defaultValue="Orich/USDC" onChange={tokenChange} 
      className='my-select token-select flex flex-middle flex-center' 
      style={{ width: 120 }} 
      suffixIcon={
        <img src={bottomIcon}></img>
      } >
        {
          tokenSelect.map(item => {
            return <Select.Option value={item.value}>
              <img className='coin-left' src={getTokenByName(item.label.split('/')[0]).icon} alt="" />
              <img className='coin-right' src={getTokenByName(item.label.split('/')[1]).icon} alt="" />
              <span className='c2b fz-14 fwb '>{item.label}</span>
            </Select.Option>
          })
        }
      </Select>
      {/* <div className='swap-left-header flex flex-center pointer'>
          <img className='coin-left' src={getTokenByName(props.inputToken).icon} alt="" />
          <img className='coin-right' src={getTokenByName(props.outToken).icon} alt="" />
          <span className='c2b fz-14 fwb m-l-50'>{props.inputToken}/{props.outToken}</span>
          <img className='switch-icon m-l-12' src={bottomIcon} alt="" />
        </div> */}
      <div className='swap-left-unit flex flex-between flex-center m-t-24'>
        <div className='flex flex-column c2b'>
          <div className='flex flex-center '>
            <div className='flex flex-center title-num'>
              <span className='flex flex-center'>
                {
                  loading ? <Skeleton.Button active size={'small'} /> :
                    <span className='fz-24 fwb'>{price}</span>
                }
                <span className='fz-16 fwb m-l-8'>USD</span>
                {/* <span className='fz-16 fwb m-l-8'>{tokenPair.split('/')[1]}</span> */}
              </span>
              <span>
                {
                  priceData.length ? (
                    <>
                      <span className={'fwb fz-14 price_change m-l-20 ' +
                        (priceData[1]?.close * 1 > priceData[0]?.open * 1 ? 'cy' : priceData[1]?.close * 1 < priceData[0]?.open * 1 ? 'blue' : 'grey')
                      }>
                        {
                          (priceData[1]?.close * 1 >= priceData[0]?.open * 1 ? '+' : '') +
                          toFixed((priceData[1]?.close - priceData[0]?.open) * 100 / priceData[0]?.open, 2) + '%'
                        }
                      </span>
                      <span className='c05 fz-12 m-l-5'>
                        24h
                      </span>
                    </>

                  ) : ''
                }
              </span>

            </div>
            {/* <span className='c00c fz-16 fwb m-l-8'>+1.22 (+0.36%)</span> */}
          </div>
          {/* <span className='fz-14 c2b'>{loading ? '':formatTime(priceData[1]?.open/1000)}</span> */}
          <span className='fz-14 c2b'>{loading ? '' : formatTime(new Date().getTime() / 1000)}</span>
        </div>
        <div className='flex flex-center k-and-line'>
          {/* <Radio.Group
              className='dex-radio-card'
              options={optionsData}
              onChange={onChange}
              value={timeValue}
              optionType="button"
              buttonStyle="solid"/> */}
          <div className="range-group flex">
            {
              ChartType === 'line' ?
                <>
                  <div className={classNames(["range-item pointer", { "active": timeType === 1 }])} onClick={ev => { setTimeType(1) }}>1D</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 2 }])} onClick={ev => { setTimeType(2) }}>1W</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 3 }])} onClick={ev => { setTimeType(3) }}>1M</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 4 }])} onClick={ev => { setTimeType(4) }}>All</div>
                </>
                :
                <>
                  <div className={classNames(["range-item pointer", { "active": timeType === 5 }])} onClick={ev => { setTimeType(5) }}>5m</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 6 }])} onClick={ev => { setTimeType(6) }}>15m</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 7 }])} onClick={ev => { setTimeType(7) }}>30m</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 8 }])} onClick={ev => { setTimeType(8) }}>1H</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 9 }])} onClick={ev => { setTimeType(9) }}>4H</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 10 }])} onClick={ev => { setTimeType(10) }}>1D</div>
                  <div className={classNames(["range-item pointer", { "active": timeType === 11 }])} onClick={ev => { setTimeType(11) }}>1W</div>
                </>
            }
          </div>
          <div className='ant-radio-group ant-radio-group-solid dex-radio-card chart-operation'>
            <div onClick={() => { setChartType('line'); setTimeType(1) }} className={classNames('ant-radio-button-wrapper chart-btn', {
              'ant-radio-button-wrapper-checked': ChartType === 'line'
            })}>
              <img className='chart-icon' src={ChartType === 'line' ? lineNew : Line} alt="" />
            </div>
            <div onClick={() => { setChartType('k'); setTimeType(5) }} className={classNames('ant-radio-button-wrapper chart-btn', {
              'ant-radio-button-wrapper-checked': ChartType === 'k'
            })}>
              <img className='chart-icon' src={ChartType === 'k' ? ColumniconNew : Column} alt="" />
            </div>
          </div>
        </div>
      </div>
      {
        loading ? <div className="flex flex-center flex-middle" style={{ width: '100%', height: '263px' }}>
          <Loading />
        </div>
          : <ReactECharts className='react-echarts' option={options} style={{ width: '100%', height: '263px' }} />
      }
      {/* <div className='c2b fz-14 lh-16 fwb m-t-36'>O=0.061608  H=0.061608  L=0.061608  C=0.061608</div> */}

    </div>
  )
}

export default Swap;