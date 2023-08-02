import { getAddress } from "../contract"
import { findAddressByName } from "../lib/util"
import { queryModuleResource, queryResource , queryTableItem, queryLatestNodeInfo} from "./client.ts"
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
const queryModuleStore = async()=> {
    let resource_cap = await queryResourceCap();
    let resource_cap_address = resource_cap.data.signer_capability.account;
    return await queryModuleResource(resource_cap_address, `ModuleStore`, moduleType);
}
export const queryUserStore = async(user)=> {
    return await queryModuleResource(user, `UserStore`, moduleType);
}

export const queryPoolData = async(moduleStore, coinType) => {
    const hex = Buffer.from(coinType, "utf8").toString("hex");
    return await queryTableItem(
        moduleStore.data.pools.handle,
        "vector<u8>",
        `${moduleType}::PoolData`,
        hex
    );
}
export const  queryDepositAmount = async (user_store, coinType)=> {
    const handle = user_store.data.deposits.handle;
    const hex = Buffer.from(coinType, "utf8").toString("hex");
    return await queryTableItem(handle, "vector<u8>", "u64", hex);
}
export const getAvailabePoints = async (user)=> {
    let block_height = (await queryLatestNodeInfo())?.block_height;
    // console.log("blockHeight", blockHeight);
    let module_store = await queryModuleStore();
    console.log("moduleStore", module_store);
    let user_store = await queryUserStore(user);
    console.log("user_store", user_store);
    let points = 0
    if (user_store) {
        let supported_coins = module_store.data.supported_coins;
        // console.log("supported_coins", supported_coins);
        // console.log("handle", handle);
        points = user_store.data.available_points * 1;
        // console.log("points", points);
        let pool_data = await queryPoolData(module_store, supported_coins[0]);
            console.log("pool_data", pool_data);
        let deposit_amount = await queryDepositAmount(user_store, supported_coins[0]);
            // console.log("depoistAmount", deposit_amount);
        const pending_points =
                (pool_data["unlock_speed"] *
                    (block_height - user_store.data.last_calculate_block) *
                    deposit_amount) /
                1e8;
            // console.log("pending_points", pending_points);
            points += pending_points;
        return {
            points,
            deposit_amount: deposit_amount,
            unlock_speed: (pool_data["unlock_speed"]/1e8)*(deposit_amount/1e8)
        }
    } else {
        return {
            points:0,
            deposit_amount: 0,
            unlock_speed: 0
        }
    }
}
export const getLpToken = (token1, token2) => {
    let [x, y] = sortCoin(token1, token2)
   return getAddress().hwswap.swap+`::LPToken<${x}, ${y}>`
}
