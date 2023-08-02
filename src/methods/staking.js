import { getAddress } from "../contract"
import { findAddressByName } from "../lib/util"
import { queryModuleResource } from "./client.ts"

const deployer = '' // 合约地址

export const getModuleStore = async () => { // 获取模块信息
    let struct = `ModuleStore<${findAddressByName('Orich')}>`
    let moduleType = ''
    return await queryModuleResource(deployer, struct, moduleType)
}
export const getUserStore = async (user) => { // 获取用户模块信息
    let struct = `UserStore<${findAddressByName('Orich')}>`
    let moduleType = ''
    return await queryModuleResource(user, struct, moduleType)
}