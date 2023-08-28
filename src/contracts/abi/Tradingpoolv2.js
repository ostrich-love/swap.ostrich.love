export default  [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "trader",
        "type": "address"
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "points",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "SwapEvent",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "queryAllPoolViews",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "targetToken",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountInRate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOutRate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "claimInterval",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ITradingPoolV2.PoolConfig",
                "name": "config",
                "type": "tuple"
              },
              {
                "internalType": "uint256",
                "name": "rewardIndex",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastDistributeTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativePoints",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativeAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativeRewards",
                "type": "uint256"
              }
            ],
            "internalType": "struct ITradingPoolV2.PoolInfo",
            "name": "info",
            "type": "tuple"
          }
        ],
        "internalType": "struct ITradingPoolV2.PoolView[]",
        "name": "views",
        "type": "tuple[]"
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
    "name": "queryAllUserPoolViews",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "pool",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativePoints",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativeAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "rewardIndex",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "pendingReward",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastClaimTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "claimedReward",
                "type": "uint256"
              }
            ],
            "internalType": "struct ITradingPoolV2.UserPoolInfo",
            "name": "info",
            "type": "tuple"
          }
        ],
        "internalType": "struct ITradingPoolV2.UserPoolView[]",
        "name": "views",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      }
    ],
    "name": "queryPoolView",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "targetToken",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "startTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "endTime",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountInRate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amountOutRate",
                    "type": "uint256"
                  },
                  {
                    "internalType": "uint256",
                    "name": "claimInterval",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct ITradingPoolV2.PoolConfig",
                "name": "config",
                "type": "tuple"
              },
              {
                "internalType": "uint256",
                "name": "rewardIndex",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastDistributeTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativePoints",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativeAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativeRewards",
                "type": "uint256"
              }
            ],
            "internalType": "struct ITradingPoolV2.PoolInfo",
            "name": "info",
            "type": "tuple"
          }
        ],
        "internalType": "struct ITradingPoolV2.PoolView",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "queryRewardToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "queryUserPoolView",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "pool",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativePoints",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "cumulativeAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "rewardIndex",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "pendingReward",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lastClaimTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "claimedReward",
                "type": "uint256"
              }
            ],
            "internalType": "struct ITradingPoolV2.UserPoolInfo",
            "name": "info",
            "type": "tuple"
          }
        ],
        "internalType": "struct ITradingPoolV2.UserPoolView",
        "name": "v",
        "type": "tuple"
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
    "name": "queryUserStakePoints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]