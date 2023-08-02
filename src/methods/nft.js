
import { getAddress, getNFTUrl, getNodeUrl } from '../contract';
import { findAddressByName } from "../lib/util"
import { queryResource, queryTableItem, queryModuleResource} from "./client.ts"

import { AptosClient, TokenClient } from 'aptos';
import { metaExpireTime } from '../global';
const client = new AptosClient(getNodeUrl());
const tokenClient = new TokenClient(client);
const deployer = getAddress().marketplace.address.split('::')[0] // 合约地址

const querySignerCap = async()=>{
    return await queryModuleResource(deployer, `SignerCap`, getAddress().marketplace.address);
}
export const queryInboxData = async () => { // 获取模块信息
    let signerCap = await querySignerCap();
    
    let capAddress = signerCap.data.cap.account;
    let resourceType = `${getAddress().marketplace.InboxData}`;
    return await queryResource(capAddress, resourceType);
}
export const queryUserPendingClaims = async (user) => { // 获取用户模块信息
    let inboxData = await queryInboxData();
        console.log("inboxData", inboxData);
        let handle = inboxData.data.user_pending_claims.handle;
        // console.log(handle);
        return await queryTableItem(handle, "address", `vector<${getAddress().marketplace.InboxData.replace('::InboxData', '')}::InboxId>`, `${user}`);
}
export const getOwnerById = async (id, property_version) => {
    let postData = {
      operationName: 'OwnersData',
      variables: {
        property_version: `${property_version}`,
        token_id: `${id}`,
      },
      query:
        'query OwnersData($token_id: String, $property_version: numeric) {\n  current_token_ownerships(\n    where: {token_data_id_hash: {_eq: $token_id}, property_version: {_eq: $property_version}}\n  ) {\n    owner_address\n    __typename\n  }\n}',
    };
    let headers = { 'Content-Type': 'application/json' };
    const response = await fetch(getNFTUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });
    if (response.status == 200) {
      let result = await response.json();
      return result;
    }
  };
  
export const getMetaDataById = async (id) => {
    if (
      localStorage.getItem(id) &&
      JSON.parse(localStorage.getItem(id) || '{}').expire * 1 >
        new Date().getTime() * 1
    ) {
      // 缓存处理
      return JSON.parse(localStorage.getItem(id) || '{}').data;
    }
    let postData = {
      operationName: 'TokenData',
      variables: {
        token_id: `${id}`,
      },
      query:
        'query TokenData($token_id: String) {\n  current_token_datas(where: {token_data_id_hash: {_eq: $token_id}}) {\n    token_data_id_hash\n    name\n    collection_name\n    creator_address\n    default_properties\n    largest_property_version\n    maximum\n    metadata_uri\n    payee_address\n    royalty_points_denominator\n    royalty_points_numerator\n    supply\n    __typename\n  }\n}',
    };
    let headers = { 'Content-Type': 'application/json' };
    const response = await fetch(getNFTUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });
    if (response.status == 200) {
      let result = await response.json();
      localStorage.setItem(
        id,
        JSON.stringify({
          expire: new Date().getTime() * 1 + metaExpireTime * 1,
          data: result,
        })
      );
      return result;
    }
  };
  
  export const getMetaDataByNative = async (
    creator,
    collection_name,
    token_name
  ) => {
    let res= await tokenClient.getCollectionData(creator, collection_name)
    console.log(res)
    return await tokenClient.getTokenData(creator, collection_name, token_name);
  };
  export const getCollectionDataNative = async (
    creator,
    collection_name
  ) => {
    return await tokenClient.getCollectionData(creator, collection_name)
  };