import { getAddress } from "../contract"
import { findAddressByName } from "../lib/util"
import { queryModuleResource, queryResource } from "./client.ts"
import BN, { BigNumber } from "bignumber.js"
import { queryTokenPairReserve, sortCoin } from "./swap";
let INDEX_PRECISION = new BN(1e12);
const deployer = '' // 合约地址

const moduleType = ''
const queryResourceCap = async () => {
    console.log(deployer)
    return await queryModuleResource(deployer,  `ResourceCap`,moduleType);
}

const queryResourceCapAddress = async () => {
    let resourceCap = await queryResourceCap();
    return resourceCap.data.signer_capability.account;
}

export const queryPoolInfo = async(depositCoinType, rewardCoinType) =>{
    return await queryModuleResource(
        await queryResourceCapAddress(),
        `PoolInfo<${depositCoinType},${rewardCoinType}>`,
        moduleType
    )
}
export const getPoolPendingRewardIndex = async (depositCoinType, rewardCoinType)=> {
    let pool = (await queryPoolInfo(depositCoinType, rewardCoinType))?.data;
    // console.log("pool", pool);
    let last_distribute_time = pool.last_distribute_time * 1;
    if (last_distribute_time > 0) {
        let now = Math.trunc(Date.now() / 1000);
        // console.log("now", now);
        let reward = new BN(Math.trunc(((now - last_distribute_time) * pool.rewards_per_week) / 3600 / 24 / 7));
        console.log("reward", reward);
        let reward_per_bond = reward.times(INDEX_PRECISION).div(new BN(pool.total_deposits));
        // console.log("reward_per_pond", reward_per_bond);
        return reward_per_bond.plus(new BN(pool.reward_index));
    }
    return new BN(0);
}
export const queryDepositInfo = async(user, depositCoinType, rewardCoinType) => {
    return await queryModuleResource(user, `DepositInfo<${depositCoinType},${rewardCoinType}>`,moduleType);
}
export const getPendingReward = async(user, depositCoinType, rewardCoinType)=> {
    let deposit_info = (await queryDepositInfo(user, depositCoinType, rewardCoinType))?.data;
    let pool_reward_index = await getPoolPendingRewardIndex(depositCoinType, rewardCoinType);
    // console.log("pool_reward_index", pool_reward_index.toNumber());

    let deposit_mount = new BN(deposit_info?.amount);
    let deposit_reward_index = new BN(deposit_info?.reward_index);
    // console.log("deposit_reward_index", deposit_reward_index.toNumber());

    let pending = deposit_mount.times(pool_reward_index.minus(deposit_reward_index)).div(INDEX_PRECISION).toNumber();
    // console.log("pending", pending);
    let pending_reward = deposit_info?.pending_reward * 1 + pending;
    return pending_reward;
}
export const getLpToken = (token1, token2) => {
    let [x, y] = sortCoin(token1, token2)
   return getAddress().hwswap.swap+`::LPToken<${x}, ${y}>`
}

export const getApr = async (info) => {
    let apr_temp = 0
    if(info.total_deposits == 0) {
        return '+∞'
    }
      if(info.lptype == 'LPToken') {
        let {reserve_x, reserve_y}  = await queryTokenPairReserve(findAddressByName('Orich'), findAddressByName('USDC'))
        let priceHarw = reserve_y/reserve_x
        let supply = await queryResource(getAddress()['hwswap']['swap'].split('::')[0], `0x1::coin::CoinInfo<${getLpToken(findAddressByName(info.token1) , findAddressByName(info.token2))}>`)
        let lptotal = supply.data.supply.vec[0].integer.vec[0].value
        let deposit_value = (info.total_deposits/lptotal)*reserve_y*2
        apr_temp = new BigNumber(info.rewards_per_week).multipliedBy(new BigNumber(priceHarw)).multipliedBy(new BigNumber(5200)).dividedBy(deposit_value).toString()
        return apr_temp
      } else {
         apr_temp = new BigNumber(info.rewards_per_week).multipliedBy(new BigNumber(5200)).dividedBy(info.total_deposits).toString()
        return apr_temp
      }
}