import BigNumber from "bignumber.js"
import { getLpAmounts, getReserves } from "../contracts/methods/liquidity"
import { findAddressByName, findNameByAddress } from "./util"

export const getOrichLockedAmount = async (info) => {
    let apr_temp = 0
    if(info.totalDeposits == 0) {
        return 0
    }
    if(!findNameByAddress(info.depositToken).includes('Orich')) {
        return 0
    }
    if(findNameByAddress(info.depositToken).includes('-')) {
        let { reserve0: reserve_x, reserve1: reserve_y }  = await getReserves(info.depositToken)
        let lptotal = await getLpAmounts(info.depositToken)
        let orich_reserve = 0
        let another_token_name = findNameByAddress(info.depositToken).replace('Orich', '').replace('-', '')
        if(findAddressByName(another_token_name) < findAddressByName('Orich')) {
            orich_reserve = reserve_y
        } else {
            orich_reserve = reserve_x
        }
        return info.totalDeposits*orich_reserve/lptotal
    } else {
        return info.totalDeposits
    }
}
export const getApr = async (info, prices) => {
    let apr_temp = 0
    if(info.totalDeposits == 0) {
        return '+∞'
    }
    if(findNameByAddress(info.depositToken).includes('-')) { // lp池子
    let { reserve0: reserve_x, reserve1: reserve_y }  = await getReserves(info.depositToken)
    let priceOstrich = reserve_y/reserve_x
    let lptotal = await getLpAmounts(info.depositToken)
    let deposit_value = (info.totalDeposits/lptotal)*reserve_y*2
    apr_temp = new BigNumber(info.weeklyReward).multipliedBy(new BigNumber(priceOstrich)).multipliedBy(new BigNumber(5200)).dividedBy(deposit_value).toString()
    return apr_temp
    } else {
        apr_temp = new BigNumber(info.weeklyReward).multipliedBy(new BigNumber(5200)).dividedBy(info.totalDeposits).toString()
    return apr_temp
    }
}
export const getAprFixed = async (info, prices) => {
    console.log(prices)
    let apr_temp = 0
    if(info.totalDeposits == 0) {
        return '+∞'
    }
    let priceRewardToken = prices.find(item => item.name == findNameByAddress(info.rewardToken))?.price
        let lpprice = prices.find(item => item.name == findNameByAddress(info.depositToken))?.price
        apr_temp = new BigNumber(info.weeklyReward).multipliedBy(new BigNumber(priceRewardToken)).multipliedBy(new BigNumber(5200)).multipliedBy(new BigNumber(11.2)).dividedBy(info.totalWeight).dividedBy(lpprice).toString()
        return apr_temp
}
export const calApr = async (info, weeks, amount=1) => {
    let apr_temp = 0
    if(info.total_deposits == 0) {
        return '+∞'
    }
    if(findNameByAddress(info.depositToken).includes('-')) { // lp池子
        let { reserve0: reserve_x, reserve1: reserve_y }  = await getReserves(info.depositToken)
        let priceOstrich = reserve_y/reserve_x
        let lptotal = await getLpAmounts(info.depositToken)
        let lpprice = reserve_y*2/lptotal
        apr_temp = new BigNumber(info.weeklyReward).multipliedBy(new BigNumber(priceOstrich)).multipliedBy(new BigNumber(5200)).multipliedBy((new BigNumber(0.2).multipliedBy(weeks).plus(new BigNumber(0.8)))).dividedBy(new BigNumber(info.totalWeight).plus((new BigNumber(0.2).multipliedBy(weeks).plus(new BigNumber(0.8))).multipliedBy(new BigNumber(amount)))).dividedBy(lpprice).toString()
 
        return apr_temp
      } else {
        apr_temp = new BigNumber(info.weeklyReward).multipliedBy(new BigNumber(5200)).multipliedBy((new BigNumber(0.2).multipliedBy(weeks).plus(new BigNumber(0.8)))).dividedBy(new BigNumber(info.totalWeight).plus((new BigNumber(0.2).multipliedBy(weeks).plus(new BigNumber(0.8))).multipliedBy(new BigNumber(amount)))).toString()
        
         
        return apr_temp
      }
}