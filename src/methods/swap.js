import { getAddress } from "../contract";
import { findAddressByName } from "../lib/util";
import { queryModuleResource } from "./client.ts";

export const queryTokenPairReserve = async (coinX, coinY) => {
    let [x, y] = sortCoin(coinX, coinY);
    let structName = `TokenPairReserve<${x},${y}>`;
    let result = await queryModuleResource(getAddress()['hwswap']['swap'].split('::')[0], structName, getAddress()['hwswap']['swap']);
    return result && result.data;
}
export const queryTokenPairReservePancake = async (coinX, coinY) => {
    let [x, y] = sortCoin(coinX, coinY);
    let structName = `TokenPairReserve<${x},${y}>`;
    let result = await queryModuleResource(getAddress()['pancake']['swap'].split('::')[0], structName, getAddress()['pancake']['swap']);
    return result && result.data;
}
export const queryTokenPairMetadata = async (coinX, coinY) => {
    let [x, y] = sortCoin(coinX, coinY);
    let structName = `TokenPairMetadata<${x},${y}>`;
    let result = await queryModuleResource(getAddress()['hwswap']['swap'].split('::')[0], structName, getAddress()['hwswap']['swap']);
    return result && result.data;
}
export const  sortCoin = (coinX, coinY) => {
    return coinX < coinY ? [coinX, coinY] : [coinY, coinX];
}
export const getTokenPairType = (router, coinXName, coinYName) => {
    let routerContract = getAddress()[router]['swap']
    let [x, y] = sortCoin(findAddressByName(coinXName), findAddressByName(coinYName));
    return `${routerContract}::TokenPairReserve<${x}, ${y}>`;
}