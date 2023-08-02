import { getAddress, getNFTUrl, getNodeUrl } from '../contract';
import { expireTime, metaExpireTime } from '../global';
import {
  findAddressByName,
  formatName,
  fromatLpName,
  OpenNotification,
} from '../lib/util';
const collectionName = 'Kepler Passport';
export const queryResources = async (userAddress) => {
  let url = `${getNodeUrl()}/accounts/${userAddress}/resources`;
  if (
    localStorage.getItem(userAddress) &&
    JSON.parse(localStorage.getItem(userAddress) || '{}').expire * 1 >
      new Date().getTime() * 1
  ) {
    // 缓存处理
    return JSON.parse(localStorage.getItem(userAddress) || '{}').data;
  }
  const response = await fetch(url, { method: 'GET' });
  if (response.status == 404) {
    return null;
  }
  let result = await response.json();
  localStorage.setItem(
    userAddress,
    JSON.stringify({
      expire: new Date().getTime() * 1 + expireTime * 1,
      data: result,
    })
  );
  return result;
};
export const queryResource = async (userAddress, resourceType) => {
  let url = `${getNodeUrl()}/accounts/${userAddress}/resource/${resourceType}`;
  if (
    localStorage.getItem(url) &&
    JSON.parse(localStorage.getItem(url) || '{}').expire * 1 >
      new Date().getTime() * 1
  ) {
    // 缓存处理
    return JSON.parse(localStorage.getItem(url) || '{}').data;
  }
  const response = await fetch(url, { method: 'GET' });
  if (response.status == 404) {
    return null;
  }
  let result = await response.json();
  localStorage.setItem(
    url,
    JSON.stringify({
      expire: new Date().getTime() * 1 + expireTime * 1,
      data: result,
    })
  );
  return result;
};

export const queryModules = async (moduleAddress) => {
  let url = `${getNodeUrl()}/accounts/${moduleAddress}/modules`;
  if (
    localStorage.getItem(moduleAddress) &&
    JSON.parse(localStorage.getItem(moduleAddress) || '{}').expire * 1 >
      new Date().getTime() * 1
  ) {
    // 缓存处理
    return JSON.parse(localStorage.getItem(moduleAddress) || '{}').data;
  }
  const response = await fetch(url, { method: 'GET' });
  if (response.status == 404) {
    return [];
  }
  let result = await response.json();
  localStorage.setItem(
    moduleAddress,
    JSON.stringify({
      expire: new Date().getTime() * 1 + expireTime * 1,
      data: result,
    })
  );
  return result;
};

export const queryModuleResource = async (user, structName, moduleType) => {
  let resourceType = `${moduleType}::${structName}`;
  return await queryResource(user, resourceType);
};

export const queryTableItem = async (tableHandler, keyType, valueType, key) => {
  let url = `${getNodeUrl()}/tables/${tableHandler}/item`;
  let data = { key_type: keyType, value_type: valueType, key };
  let headers = { 'Content-Type': 'application/json' };
  //console.log("queryTableItem", url, data);
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (response.status == 200) {
    return await response.json();
  } else {
    return null;
  }
};
export const queryModuleStorage = async (user) => {
  return await queryModuleResource(user, `ModuleStorage`);
};

export const queryResourceAccount = async (user) => {
  let storage = await queryModuleStorage(user);
  let tableHandler = storage && storage.data.resource_accounts.handle;
  let account =
    tableHandler &&
    (await queryTableItem(
      `${tableHandler}`,
      '0x1::string::String',
      'address',
      collectionName
    ));
  console.log('resourceAccount', account);
  return account;
};

export const queryCollectionConfig = async () => {
  let user = findAddressByName('PassportMint').split('::')[0];
  let resourceAccount = await queryResourceAccount(user);
  return (
    resourceAccount &&
    (await queryModuleResource(resourceAccount, `CollectionConfig`))
  );
};
export const queryCollecitonData = async (handle, collection_creator) => {
  return queryTableItem(
    handle,
    `${findAddressByName('PassportStake')}::CollectionId`,
    `${findAddressByName('PassportStake')}::CollectionData`,
    {
      creator: collection_creator,
      name: Buffer.from(collectionName, 'utf-8').toString('hex'),
    }
  );
};

// 判断币种是否注册
export const isRegistered = async (accountAddress, coin) => {
  let resourceType = `0x1::coin::CoinStore<${findAddressByName(coin)}>`;
  let resource = await queryResource(accountAddress, resourceType);
  return resource && resource.type == resourceType;
};


const filterSameNft = (arr: any[]) => {
  let new_Arr: any[] = [];
  let obj = {};
  arr.length &&
    arr.map((item: any) => {
      if (!obj[formatName(item.name)]) {
        new_Arr.push(item);
        obj[formatName(item.name)] = true;
      }
    });
  return new_Arr;
};
// 获取nft 的列表
export const getNFTList = async (user, nftname) => {
  let list = [];
  let page = 0;
  let limit = 993;
  const getNFTData = async (user, page, limit) => {
    let postData = {
      operationName: 'AccountTokensData',
      variables: {
        owner_address: `${user}`,
        limit,
        offset: limit * page,
      },
      query:
        'query AccountTokensData($owner_address: String, $limit: Int, $offset: Int) {\n  current_token_ownerships(\n    where: {owner_address: {_eq: $owner_address}, amount: {_gt: "0"}}\n    limit: $limit\n    offset: $offset\n  ) {\n    token_data_id_hash\n    name\n    collection_name\n    table_type\n    property_version\n    amount\n    __typename\n  }\n}',
    };
    let headers = { 'Content-Type': 'application/json' };
    const response = await fetch(getNFTUrl(), {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });
    if (response.status == 200) {
      let json = await response.json();
      json &&
        json.data &&
        (list = list.concat(json.data.current_token_ownerships));
      console.log(list);
      if (
        json &&
        json.data &&
        json.data.current_token_ownerships.length >= limit
      ) {
        page += 1;
        await getNFTData(user, page, limit);
      }
    }
  };
  await getNFTData(user, page, limit);
  return filterSameNft(
    list.filter(
      (item: any) =>
        (nftname ? item.collection_name == nftname : true) && item.amount > 0
    )
  );
};
export const queryLatestNodeInfo = async function () {
  const url = `${getNodeUrl()}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const resources = await fetch(url, options)
    .then((response) => response.json())
    .catch((err) => {
      return [];
    });

  return resources;
};
const getAccountResources = async function (address) {
  const url = `${getNodeUrl()}/accounts/${address}/resources`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const resources = await fetch(url, options)
    .then((response) => response.json())
    .catch((err) => {
      return [];
    });

  console.log(resources);

  return resources;
};
export const getBalance = async (
  address,
  coinType = '0x1::aptos_coin::AptosCoin'
) => {
  return 0
};
export const getLPBalance = async (address) => {
  const resources = await getAccountResources(address);

  // console.log(resources);
  const ret = [];
  const type = getAddress()['hwswap']['swap'] + '::LPToken';
  resources &&
    resources
      .filter((el) => {
        return el.type?.includes(type) && el.data?.coin?.value > 0;
      })
      .forEach((el) => {
        // console.log(el);
        if (el.type.includes(type)) {
          ret.push({
            type: el.type,
            name: fromatLpName(el.type),
            value: el.data.coin.value,
          });
        }
      });
  return ret || [];
};

export const toRegister = async (name, signAndSubmitTransaction, cb, errfn) => {
  // 注册币到钱包 ：类似于 add to metamask
  // args = args.map(item=> [...Buffer.from(item.replace('0x',''), "hex")])
  let payload = {
    function: '0x1::managed_coin::register',
    type: 'entry_function_payload',
    type_arguments: [findAddressByName(name)],
    arguments: [],
  };
  try {
    const { hash } = await signAndSubmitTransaction(payload);
    cb && cb(hash);
  } catch (e) {
    errfn && errfn();
  }
};
