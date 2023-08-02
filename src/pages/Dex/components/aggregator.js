import { getSwapTokenList, getTokenByName } from "./list"
import {get} from '../../../api/index'
import { getNetwork } from "../../../contracts"
import { ZERO_ADDRESS, consoleLog, findAddressByName, findNameByAddress } from "../../../lib/util"
import { getReserves, getSyncPool } from "../../../contracts/methods/poolwrapper"
import { Tooltip } from "antd"
import BigNumber from "bignumber.js"
import { toFixed } from "accounting"

const getAmountOut = (AmountIn, ReserveIn, ReserveOut) => {
    if(!AmountIn || AmountIn == 0) {
      return ''
    }
    return toFixed((AmountIn*(ReserveOut)/(Number((ReserveIn))+Number(AmountIn))),0)
   }
const getAmountIn = (AmountOut, ReserveIn, ReserveOut) => {
    if(Number(AmountOut) > Number((ReserveOut)) || !AmountOut || AmountOut == 0) {
        return ''
    }
    return toFixed(AmountOut*(ReserveIn)/(Number((ReserveOut))-Number(AmountOut)), 0)
}

export const getAllReserves_default = async () => {
    let list = getSwapTokenList()
    let reserve_list = []
    let {data: ostrich_pools} = await get('/api/evm/swap/pairs', {
        chain_id: getNetwork().networkId
    })
    console.log(ostrich_pools)
    ostrich_pools.map(item=>{
        item.t = 1
        return item
    })
    let all_list = [...ostrich_pools]
    let reserve_p = []
    all_list.map(item => {
        reserve_p.push(getReserves({
            address: item.pair,
            t: item.t
        }))
    })

    let reserve_results = await Promise.all(reserve_p)
    all_list.map((item, index) => {
        item.reserve_x = item.token0 < item.token1 ?reserve_results[index][0]:reserve_results[index][1]
        item.reserve_y = item.token0 < item.token1 ?reserve_results[index][1]:reserve_results[index][0]
        return item
    })
    return all_list
}
export const getAllReserves = async (aggregated) => {
    console.log(aggregated)
    let list = getSwapTokenList()
    let {data: ostrich_pools} = await get('/api/evm/swap/pairs', {
        chain_id: getNetwork().networkId
    })
    console.log(ostrich_pools)
    ostrich_pools.map(item=>{
        item.t = 0
        return item
    })
    let syncswap_pools_p = []
    let syncswap_pools = []
    console.log(syncswap_pools_p)
    if(aggregated*1) {
        list.map((item, index) => {
            list.map((inner, idx) => {
                if(index < idx) {
                syncswap_pools.push({
                    pair: ZERO_ADDRESS,
                    token0: findAddressByName(item.title),
                    token1: findAddressByName(inner.title),
                    t:1
                })
                syncswap_pools_p.push(getSyncPool(findAddressByName(item.title), findAddressByName(inner.title)))
            }
            })
        })
        let syncswap_pools_list = await Promise.all(syncswap_pools_p)
        syncswap_pools = syncswap_pools.map((item, index) => {
            item.pair = syncswap_pools_list[index]
            return item
        }).filter(item => item.pair != ZERO_ADDRESS)

    }
    let all_list = [...ostrich_pools, ...syncswap_pools]
    let reserve_p = []
    all_list.map(item => {
        reserve_p.push(getReserves({
            address: item.pair,
            t: item.t
        }))
    })

    let reserve_results = await Promise.all(reserve_p)
    all_list.map((item, index) => {
        item.reserve_x = item.token0 < item.token1 ?reserve_results[index][0]:reserve_results[index][1]
        item.reserve_y = item.token0 < item.token1 ?reserve_results[index][1]:reserve_results[index][0]
        return item
    })
    console.log(all_list)
    return all_list
}

export const findRouter = (reserveList, tokenIn, tokenOut) => {
    let router_1 = []
    // 先找直接的池子
    let directRouter = reserveList.filter((item) => {
        return (item.token0 == tokenIn && item.token1 == tokenOut) || (item.token0 == tokenOut && item.token1 == tokenIn)
    } 
  )
  directRouter.map(item => {
    router_1.push([item])
  })

     // 再找二级池子
       // 先找出有X的
       let hasX =   reserveList.filter((item) => {
        return (item.token0 == tokenIn && item.token1 != tokenOut) || (item.token0 != tokenOut && item.token1 == tokenIn)
    })
      // 再找出有Y的
    let hasY = reserveList.filter((item) => {
        return (item.token0 != tokenIn && item.token1 == tokenOut) || (item.token0 == tokenOut && item.token1 != tokenIn)
    })
     // 再找出能连接的
     let router_2 = []
     let new_in_out = []
     hasX.map(item =>{
        hasY.map(inner => {
           if(item.token0 == inner.token0 || item.token1==inner.token0 || item.token0 == inner.token1 || item.token1 == inner.token1) {
             router_2.push([item, inner])
           } else {
            new_in_out.push([item, inner])
           }
        })
     })
     //再找三级池子
     let router_3 = []
     new_in_out.map(item => {
         let birdgeRouter = reserveList.filter((inner) => {
             let newTokenIn = item[0].token0 == tokenIn ? item[0].token1:item[0].token0
             let newTokenOut = item[1].token0 == tokenOut ? item[1].token1:item[1].token0
             return (inner.token0 == newTokenIn && inner.token1 == newTokenOut) || (inner.token0 == newTokenOut && inner.token1 == newTokenIn)
         })
         birdgeRouter.map(inside => {
             router_3.push([item[0], inside, item[1]])
         })
     })
     return [...router_1, ...router_2, ...router_3]
}

export const calcRouterPriceByInput = (inputToken, outToken, router, inputNumber) => {
    let amountOut = 0
    if(router.length == 1) { // 直接路由
        amountOut = getAmountOut(inputNumber, (inputToken) < (outToken) ? router[0].reserve_x:router[0].reserve_y, (inputToken) < (outToken) ? router[0].reserve_y:router[0].reserve_x)
    } else if(router.length == 2) { // 2级别路由
        let routerToken_1 = (router[0].token0 == inputToken ? router[0].token1:router[0].token0)
        let amountOut_1 =  getAmountOut(inputNumber, (inputToken) < (routerToken_1) ? router[0].reserve_x:router[0].reserve_y, (inputToken) < (routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].token0 == outToken ? router[1].token1:router[1].token0)
        let amountOut_2 =  getAmountOut(amountOut_1, (routerToken_2) < (outToken) ? router[1].reserve_x:router[1].reserve_y, (routerToken_2) < (outToken) ? router[1].reserve_y:router[1].reserve_x)
        amountOut = amountOut_2
    } else if(router.length == 3) {// 3级别路由
        let routerToken_1 = (router[0].token0 == inputToken ? router[0].token1:router[0].token0)
        let amountOut_1 =  getAmountOut(inputNumber, (inputToken) < (routerToken_1) ? router[0].reserve_x:router[0].reserve_y, (inputToken) < (routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].token0 == routerToken_1 ? router[1].token1:router[1].token0)
        let amountOut_2 =  getAmountOut(amountOut_1, (routerToken_1) < (routerToken_2) ? router[1].reserve_x:router[1].reserve_y, (routerToken_1) < (routerToken_2) ? router[1].reserve_y:router[1].reserve_x)
        let amountOut_3 =  getAmountOut(amountOut_2, (routerToken_2) < (outToken) ? router[2].reserve_x:router[2].reserve_y, (routerToken_2) < (outToken) ? router[2].reserve_y:router[2].reserve_x)
        amountOut = amountOut_3
    }
    return {
        amountOut,
        amountIn:inputNumber,
        router: router
    }

}

export const calcRouterPriceByOutput = (inputToken, outToken, router, outputNumber) => {
    let amountIn = 0
    if(router.length == 1) { // 直接路由
        amountIn = getAmountIn(outputNumber, (inputToken) < (outToken) ? router[0].reserve_x:router[0].reserve_y, (inputToken) < (outToken) ? router[0].reserve_y:router[0].reserve_x)
    } else if(router.length == 2) { // 2级别路由
        let routerToken_1 = (router[0].token0 == inputToken ? router[0].token1:router[0].token0)
        let amountIn_1 =  getAmountIn(outputNumber, (inputToken) < (routerToken_1) ? router[0].reserve_x:router[0].reserve_y, (inputToken) < (routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].token0 == outToken ? router[1].token1:router[1].token0)
        let amountIn_2 =  getAmountIn(amountIn_1, (routerToken_2) < (outToken) ? router[1].reserve_x:router[1].reserve_y, (routerToken_2) < (outToken) ? router[1].reserve_y:router[1].reserve_x)
        amountIn = amountIn_2
    } else if(router.length == 3) {// 3级别路由
        let routerToken_1 = (router[0].token0 == inputToken ? router[0].token1:router[0].token0)
        let amountIn_1 =  getAmountIn(outputNumber, (inputToken) < (routerToken_1) ? router[0].reserve_x:router[0].reserve_y, (inputToken) < (routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].token0 == routerToken_1 ? router[1].token1:router[1].token0)
        let amountIn_2 =  getAmountIn(amountIn_1, (routerToken_1) < (routerToken_2) ? router[1].reserve_x:router[1].reserve_y, (routerToken_1) < (routerToken_2) ? router[1].reserve_y:router[1].reserve_x)
        let amountIn_3 =  getAmountIn(amountIn_2, (routerToken_2) < (outToken) ? router[2].reserve_x:router[2].reserve_y, (routerToken_2) < (outToken) ? router[2].reserve_y:router[2].reserve_x)
        amountIn = amountIn_3
    }
    return {
        amountIn,
        amountOut:outputNumber,
        router: router
    }

}

export const formatRouter = (inputToken, outToken, routers) => {
    if(routers.length == 1) {
        return inputToken+'>'+outToken
    } else if(routers.length == 2) {
        let routerToken_1 = (routers[0].token0 == findAddressByName(inputToken) ? routers[0].token1:routers[0].token0)
        return inputToken+'>'+findNameByAddress(routerToken_1)+'>'+outToken
    }else if(routers.length == 3) {
        let routerToken_1 = (routers[0].token0 == findAddressByName(inputToken) ? routers[0].token1:routers[0].token0)
        let routerToken_2 = (routers[1].token0 == (routerToken_1) ? routers[1].token1:routers[1].token0)
        return inputToken+'>'+findNameByAddress(routerToken_1)+'>'+findNameByAddress(routerToken_2)+'>'+outToken
    }
}

export const formatRouterIcon = (routers) => {
    if(routers.length == 1) {
        return routers[0].t == 0 ? <Tooltip title="Ostrich"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>: <Tooltip title="SyncSwap"><img className="token-icon router-icon" src={getTokenByName('TEST').icon}></img></Tooltip>
    } else if(routers.length == 2) {
        return <>{routers[0].t == 0 ? <Tooltip title="Ostrich"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="SyncSwap"><img className="token-icon router-icon" src={getTokenByName('TEST').icon}></img></Tooltip>}<span className="m-l-3 m-r-3">{'>'}</span>
        {routers[1].t == 0 ? <Tooltip title="Ostrich"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="SyncSwap"><img className="token-icon router-icon" src={getTokenByName('TEST').icon}></img></Tooltip>}
        </>
    }else if(routers.length == 3) {
        return <>{routers[0].t == 0 ? <Tooltip title="Ostrich"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="SyncSwap"><img className="token-icon router-icon" src={getTokenByName('TEST').icon}></img></Tooltip>}<span className="m-l-3 m-r-3">{'>'}</span>
        {routers[1].t == 0 ? <Tooltip title="Ostrich"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="SyncSwap"><img className="token-icon router-icon" src={getTokenByName('TEST').icon}></img></Tooltip>}
        <span className="m-l-3 m-r-3">{'>'}</span>
        {routers[2].t == 0 ? <Tooltip title="Ostrich"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="SyncSwap"><img className="token-icon router-icon" src={getTokenByName('TEST').icon}></img></Tooltip>}
        </>
    }
}
