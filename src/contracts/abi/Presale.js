export default [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "currencyAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "usdAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "BuyEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ClaimEvent",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "buy",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "queryGlobalView",
      "outputs": [
        {
          "internalType": "address",
          "name": "oracle",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "feeWallet",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokenSales",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "claimStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "privatePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "publicPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minBuyAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxBuyAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "currencies",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "claimTimes",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        }
      ],
      "name": "queryPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "queryUsdAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "queryUserInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tokenAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalPayment",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "currency",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "currencyAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "usdAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IPresale.BuyRecord[]",
              "name": "buyRecords",
              "type": "tuple[]"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "tokenAmount",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IPresale.ClaimRecord[]",
              "name": "claimRecords",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct IPresale.UserInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]