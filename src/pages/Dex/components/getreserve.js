import { Tooltip } from "antd"
import { getAddress } from "../../../contract"
import { findAddressByName } from "../../../lib/util"
import { queryResources } from "../../../methods/client.ts"
import { getTokenPairType, queryTokenPairReserve, queryTokenPairReservePancake } from "../../../methods/swap"
import list, { getTokenByName } from "./list"


const getAmountOut = (AmountIn, ReserveIn, ReserveOut) => {
    if(!AmountIn || AmountIn == 0) {
      return ''
    }
    return AmountIn*(ReserveOut)/(Number((ReserveIn))+Number(AmountIn))
   }
const getAmountIn = (AmountOut, ReserveIn, ReserveOut) => {
    if(Number(AmountOut) > Number((ReserveOut)) || !AmountOut || AmountOut == 0) {
        return ''
    }
    return AmountOut*(ReserveIn)/(Number((ReserveOut))-Number(AmountOut))
}
export const getAllReserves = async () => {
    let reserve_list = []
    let hwswapResourses = getAddress()['hwswap']['swap'] ? await queryResources(getAddress()['hwswap']['swap'].split('::')[0]):[]
    let pancakeResourses = getAddress()['pancake']['swap'] ? await queryResources(getAddress()['pancake']['swap'].split('::')[0]):[]
    list.map((item, index) => {
        list.map((inner, idx) => {
            if(index < idx) {
                let resourcehw = hwswapResourses.find(inside => {
                    console.log(getTokenPairType('hwswap', item.title, inner.title))
                    return inside.type == getTokenPairType('hwswap', item.title, inner.title)
                 })

                //  console.log(hwswapResourses)
                 console.log(resourcehw)
                 if(resourcehw) {
                    reserve_list.push({
                        ...resourcehw.data,
                        dexType: 2,
                        coinX:findAddressByName(item.title) < findAddressByName(inner.title) ? item.title:inner.title,
                        coinY:findAddressByName(item.title) > findAddressByName(inner.title) ? item.title:inner.title
                    })
                 }
                 let resourcepancake = pancakeResourses.find(inside => {
                    return inside.type == getTokenPairType('pancake', item.title, inner.title)
                 })
                 if(resourcepancake) {
                    reserve_list.push({
                        ...resourcepancake.data,
                        dexType: 1,
                        coinX:findAddressByName(item.title) < findAddressByName(inner.title) ? item.title:inner.title,
                        coinY:findAddressByName(item.title) > findAddressByName(inner.title) ? item.title:inner.title
                    })
                 }
            }
        })
    })
    return reserve_list
}

export const findRouter = (reserveList, tokenIn, tokenOut) => {
    console.log(reserveList)
    console.log( tokenIn, tokenOut)
    
    let router_1 = []
    // 先找直接的池子
    let directRouter = reserveList.filter((item) => {
            return (item.coinX == tokenIn && item.coinY == tokenOut) || (item.coinX == tokenOut && item.coinY == tokenIn)
        } 
      )
      directRouter.map(item => {
        router_1.push([item])
      })

     // 再找二级池子
       // 先找出有X的
    let hasX =   reserveList.filter((item) => {
        return (item.coinX == tokenIn && item.coinY != tokenOut) || (item.coinX != tokenOut && item.coinY == tokenIn)
    })
      // 再找出有Y的
    let hasY = reserveList.filter((item) => {
        return (item.coinX != tokenIn && item.coinY == tokenOut) || (item.coinX == tokenOut && item.coinY != tokenIn)
    })
     // 再找出能连接的
     let router_2 = []
     let new_in_out = []
     hasX.map(item =>{
        hasY.map(inner => {
           if(item.coinX == inner.coinX || item.coinY==inner.coinX || item.coinX == inner.coinY || item.coinY == inner.coinY) {
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
            let newTokenIn = item[0].coinX == tokenIn ? item[0].coinY:item[0].coinX
            let newTokenOut = item[1].coinX == tokenOut ? item[1].coinY:item[1].coinX
            return (inner.coinX == newTokenIn && inner.coinY == newTokenOut) || (inner.coinX == newTokenOut && inner.coinY == newTokenIn)
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
        amountOut = getAmountOut(inputNumber, findAddressByName(inputToken) < findAddressByName(outToken) ? router[0].reserve_x:router[0].reserve_y, findAddressByName(inputToken) < findAddressByName(outToken) ? router[0].reserve_y:router[0].reserve_x)
    } else if(router.length == 2) { // 2级别路由
        let routerToken_1 = (router[0].coinX == inputToken ? router[0].coinY:router[0].coinX)
        let amountOut_1 =  getAmountOut(inputNumber, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_x:router[0].reserve_y, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].coinX == outToken ? router[1].coinY:router[1].coinX)
        let amountOut_2 =  getAmountOut(amountOut_1, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[1].reserve_x:router[1].reserve_y, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[1].reserve_y:router[1].reserve_x)
        amountOut = amountOut_2
    } else if(router.length == 3) {// 3级别路由
        let routerToken_1 = (router[0].coinX == inputToken ? router[0].coinY:router[0].coinX)
        let amountOut_1 =  getAmountOut(inputNumber, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_x:router[0].reserve_y, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].coinX == routerToken_1 ? router[1].coinY:router[1].coinX)
        let amountOut_2 =  getAmountOut(amountOut_1, findAddressByName(routerToken_1) < findAddressByName(routerToken_2) ? router[1].reserve_x:router[1].reserve_y, findAddressByName(routerToken_1) < findAddressByName(routerToken_2) ? router[1].reserve_y:router[1].reserve_x)
        let amountOut_3 =  getAmountOut(amountOut_2, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[2].reserve_x:router[2].reserve_y, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[2].reserve_y:router[2].reserve_x)
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
        amountIn = getAmountIn(outputNumber, findAddressByName(inputToken) < findAddressByName(outToken) ? router[0].reserve_x:router[0].reserve_y, findAddressByName(inputToken) < findAddressByName(outToken) ? router[0].reserve_y:router[0].reserve_x)
    } else if(router.length == 2) { // 2级别路由
        let routerToken_1 = (router[0].coinX == inputToken ? router[0].coinY:router[0].coinX)
        let amountIn_1 =  getAmountIn(outputNumber, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_x:router[0].reserve_y, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].coinX == outToken ? router[1].coinY:router[1].coinX)
        let amountIn_2 =  getAmountIn(amountIn_1, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[1].reserve_x:router[1].reserve_y, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[1].reserve_y:router[1].reserve_x)
        amountIn = amountIn_2
    } else if(router.length == 3) {// 3级别路由
        let routerToken_1 = (router[0].coinX == inputToken ? router[0].coinY:router[0].coinX)
        let amountIn_1 =  getAmountIn(outputNumber, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_x:router[0].reserve_y, findAddressByName(inputToken) < findAddressByName(routerToken_1) ? router[0].reserve_y:router[0].reserve_x)
        let routerToken_2 = (router[1].coinX == routerToken_1 ? router[1].coinY:router[1].coinX)
        let amountIn_2 =  getAmountIn(amountIn_1, findAddressByName(routerToken_1) < findAddressByName(routerToken_2) ? router[1].reserve_x:router[1].reserve_y, findAddressByName(routerToken_1) < findAddressByName(routerToken_2) ? router[1].reserve_y:router[1].reserve_x)
        let amountIn_3 =  getAmountIn(amountIn_2, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[2].reserve_x:router[2].reserve_y, findAddressByName(routerToken_2) < findAddressByName(outToken) ? router[2].reserve_y:router[2].reserve_x)
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
        let routerToken_1 = (routers[0].coinX == inputToken ? routers[0].coinY:routers[0].coinX)
        return inputToken+'>'+routerToken_1+'>'+outToken
    }else if(routers.length == 3) {
        let routerToken_1 = (routers[0].coinX == inputToken ? routers[0].coinY:routers[0].coinX)
        let routerToken_2 = (routers[1].coinX == routerToken_1 ? routers[1].coinY:routers[1].coinX)
        return inputToken+'>'+routerToken_1+'>'+routerToken_2+'>'+outToken
    }
}

export const formatRouterIcon = (routers) => {
    if(routers.length == 1) {
        return routers[0].dexType == 2 ? <Tooltip title="Harwell"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>: <Tooltip title="Pancake"><img className="token-icon router-icon" src={getTokenByName('CAKE').icon}></img></Tooltip>
    } else if(routers.length == 2) {
        return <>{routers[0].dexType == 2 ? <Tooltip title="Harwell"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="Pancake"><img className="token-icon router-icon" src={getTokenByName('CAKE').icon}></img></Tooltip>}<span className="m-l-3 m-r-3">{'>'}</span>
        {routers[1].dexType == 2 ? <Tooltip title="Harwell"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="Pancake"><img className="token-icon router-icon" src={getTokenByName('CAKE').icon}></img></Tooltip>}
        </>
    }else if(routers.length == 3) {
        return <>{routers[0].dexType == 2 ? <Tooltip title="Harwell"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="Pancake"><img className="token-icon router-icon" src={getTokenByName('CAKE').icon}></img></Tooltip>}<span className="m-l-3 m-r-3">{'>'}</span>
        {routers[1].dexType == 2 ? <Tooltip title="Harwell"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="Pancake"><img className="token-icon router-icon" src={getTokenByName('CAKE').icon}></img></Tooltip>}
        <span className="m-l-3 m-r-3">{'>'}</span>
        {routers[2].dexType == 2 ? <Tooltip title="Harwell"><img className="token-icon router-icon" src={getTokenByName('Orich').icon}></img></Tooltip>:<Tooltip title="Pancake"><img className="token-icon router-icon" src={getTokenByName('CAKE').icon}></img></Tooltip>}
        </>
    }
}