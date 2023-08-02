export default  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "queryAllPoolInfos",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "rewardToken",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "depositStartTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "depositEndTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimStartTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "totalReward",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IBOrichPool.PoolConfig",
              "name": "config",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "depositToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBOrichPool.PoolInfo[]",
          "name": "infos",
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
      "name": "queryAllUserPoolInfos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "depositToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBOrichPool.UserPoolInfo[]",
          "name": "infos",
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
      "name": "queryPoolInfo",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "rewardToken",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "depositStartTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "depositEndTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "claimStartTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "totalReward",
                  "type": "uint256"
                }
              ],
              "internalType": "struct IBOrichPool.PoolConfig",
              "name": "config",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "depositToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBOrichPool.PoolInfo",
          "name": "info",
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
          "name": "pool",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "queryUserPoolInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "depositToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBOrichPool.UserPoolInfo",
          "name": "info",
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
          "name": "depositToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]