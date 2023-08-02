import { getAddress } from "."
import { interval_unit_text } from "../global"

export default [
    {
        lptype: 'LPToken',
        token1: 'Orich',
        token2: 'USDC',
        rewardToken: 'Orich',
        type: 'flexible',
        index: 0
    }
    ,
    {
        lptype: 'LPToken',
        token1: 'Orich',
        token2: 'USDC',
        rewardToken: 'Orich',
        type: 'fixed',
        index: 1
    },
    {
        lptype: 'single',
        token: 'Orich',
        rewardToken: 'Orich',
        type: 'flexible',
        index:2
    },
    {
        lptype: 'single',
        token: 'Orich',
        rewardToken: 'Orich',
        type: 'fixed',
        index:3
    }
]

export const ClaimTips = () => {
    return (
      <div>
        <p>Different levels of users claim at different intervals </p>
        {
          getAddress().farm.flexible.harvestIntervalMap.map((item, index) => {
            return <p>{`${item.name.toUpperCase()}: ${item.interval} ${interval_unit_text}`}</p>
          })
        }
  
      </div>
    )
  }