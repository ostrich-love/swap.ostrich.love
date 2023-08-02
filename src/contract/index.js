import TESTADDRESS from './test.json'
import MAINADDRESS from './main.json'
import TESTADDRESS_EXTRA from './test_extra.json'
import MAINADDRESS_EXTRA from './main_extra.json'
import { NET_TYPE } from '../global'

const nodeUrl_test = 'https://fullnode.testnet.aptoslabs.com/v1'; //testnet
const  nodeUrl_main= 'https://fullnode.mainnet.aptoslabs.com/v1'; //mainnet

let nft_url_test = "https://knmpjhsurbz8-testnet.hasura.app/v1/graphql"; //testnet
let nft_url_main = "https://wqb9q2zgw7i7-mainnet.hasura.app/v1/graphql" //mainnet


let meta_url_test = "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql"; //testnet
let meta_url_main = "https://indexer.mainnet.aptoslabs.com/v1/graphql" //mainnet

export const getAddress = () => {
     TESTADDRESS.coins = {...TESTADDRESS.coins, ...TESTADDRESS_EXTRA.coins}
     MAINADDRESS.coins = {...MAINADDRESS.coins, ...MAINADDRESS_EXTRA.coins}
     TESTADDRESS.pancake = TESTADDRESS_EXTRA.pancake
     MAINADDRESS.pancake = MAINADDRESS_EXTRA.pancake
     return NET_TYPE == 'test' ? TESTADDRESS : MAINADDRESS
}
export const getAddressExtra = () => {
     return NET_TYPE == 'test' ? TESTADDRESS_EXTRA : MAINADDRESS_EXTRA
}
export const getNodeUrl = () => {
     return NET_TYPE == 'test' ? nodeUrl_test : nodeUrl_main
}

export const getNFTUrl = () => {
    return NET_TYPE == 'test' ? nft_url_test : nft_url_main
}

export const getMetaUrl = () => {
     return NET_TYPE == 'test' ? meta_url_test : meta_url_main
 }
export const net_name = () => {
     return NET_TYPE == 'main'?'mainnet':'testnet'
 }

export const net_name_capital = () => {
     return NET_TYPE == 'main'?'Mainnet':'Testnet'
 }
export const explorerUrl = NET_TYPE == 'test' ? 'https://testnet.tracemove.io/transaction/':'https://tracemove.io/transaction/'