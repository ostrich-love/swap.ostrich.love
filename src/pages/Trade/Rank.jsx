import { useEffect, useState } from 'react'
import './Rank.scss'
import { get } from '../../api'
import { getNetwork } from '../../contracts'
import { addPoint, fromUnit, numFormat, toFixed } from '../../lib/util'
import Loading from '../../components/common/Loading'
export default ({rank}) => {
    let urls = [
        '/api/evm/swap/tradingPool/topPoints/1day',
        '/api/evm/swap/tradingPool/topPoints/1month',
        '/api/evm/swap/tradingPool/topPoints/1week'
    ]
    let [ranklist, setRanklist] = useState([])
    let [loading ,setLoading] = useState(false)
    useEffect(()=> {
        setLoading(true)
        get(urls[rank||0], {
            chain_id: getNetwork().networkId
        }).then(res => {
            setLoading(false)
            setRanklist(res.data.map((item, index) => {
                item.index=index
                return item
            }))
        })
    }, [rank])
    return (
        <div className="rank-content w100 p-32 flex flex-between flex-wrap">
            {
                loading ? <div className='flex flex-middle w100'><Loading /></div> : (
                    <>
                    <div className="half-one">
                <div className="title flex c2b fz-14 w100 flex-between p-b-17">
                    <div className="title-item rank-area">Ranking</div>
                    <div className="title-item flex-1 m-l-40">Wallet address</div>
                    <div className="title-item">Volume</div>
                </div>

                <div className="content w100 p-t-17">
                    {
                        ranklist.map((item) => {
                            return (
                                item.index < ranklist.length/2 ?
                                <div className="content-item flex w100 flex-between">
                                    <div className="rank rank-area">{item.index+1}</div>
                                    <div className="rank flex-1  m-l-40">{addPoint(item.User, 7)}</div>
                                    <div className="rank">{numFormat(toFixed(fromUnit(item.Points), 2))}</div>
                                </div>:''
                            )
                        })
                    }
                </div>
            </div>
            <div className="half-one">
                <div className="title flex c2b fz-14 w100 flex-between right-title  p-b-17">
                    <div className="title-item rank-area">Ranking</div>
                    <div className="title-item flex-1 m-l-40">Wallet address</div>
                    <div className="title-item">Volume</div>
                </div>

                <div className="content w100">
                    {
                        ranklist.map((item) => {
                            return (
                                item.index >= ranklist.length/2 ?
                                <div className="content-item flex w100 flex-between">
                                    <div className="rank rank-area">{item.index+1}</div>
                                    <div className="rank flex-1  m-l-40">{addPoint(item.User, 7)}</div>
                                    <div className="rank">{numFormat(toFixed(fromUnit(item.Points), 2))}</div>
                                </div>:''
                            )
                        })
                    }
                </div>
            </div>
                    </>
                )
            }
            
        </div>
    )
}