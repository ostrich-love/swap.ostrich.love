import { Tabs } from "antd";
import { useEffect, useState } from "react";
import swapTab from '../../assets/image/launchpad/swap-tab.png'
import close from '../../assets/image/swap/close.svg'
import Liquidity from "./components/Liquidity";
import Swap from "./components/Swap";
import {NavLink, useLocation } from 'react-router-dom';
import './index.scss'
import {connect as reducxConnect} from 'react-redux'
import { createBrowserHistory } from 'history';
import { queryAllPoolViews, queryAllUserPoolViews } from "../../contracts/methods/tradingpool";
import { fromUnit, toFixed } from "../../lib/util";
import BigNumber from "bignumber.js";
import { useTranslation } from 'react-i18next';
const history = createBrowserHistory();
function Dex(props) {
  let { pathname } = useLocation()
  const [myPendingRewards, setMyPendingRewards] = useState(0)
  let { t, i18n } = useTranslation()
  console.log(pathname)
  const [tabValue, setTabValue] = useState(pathname.replace('/', '') =='liquidity'?'liquidity':'swap')
  const [show,setShow]=useState(true)
  useEffect(async ()=>{
    let my_pending_rewards = 0
    if(props.account) {
      let my_pools = await queryAllUserPoolViews(props.account)
      my_pools.map(item => {
        my_pending_rewards= new BigNumber(my_pending_rewards).plus(new BigNumber(item.info.pendingReward)).toString()
      })
    }
    setMyPendingRewards(my_pending_rewards)
}, [props.account])
  return (
    <div className="dex">
      {show && props.account && <div className="w100 reward-area flex flex-center flex-middle">
           <span className="cy fz-16">You have <span className="fwb underline italic">{toFixed(fromUnit(myPendingRewards),2)} Orich</span>  trading rewards to claim</span>
           <NavLink to="/swap_rewards" className="check-btn fz-14 c2b m-l-32 m-m-l-10">Check details</NavLink>
           <img src={close} alt="" onClick={()=>setShow(false)} className="imgs" />
      </div>}
      <div className="dex-content">
      <div className="dex-header flex flex-middle m-b-32">
        <Tabs
          defaultActiveKey={tabValue}
          className='dex-tab'
          onTabClick={(value) => {
            setTabValue(value)
            history.push('/'+value)
          }}>
          <Tabs.TabPane
            tab={
              <div className="p-l-39 p-r-39">
                <span className='c2e fz-16 fwb m-l-8'>{t('Swap')}</span>
              </div>}
            key="swap">
              
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <div className="p-l-28 p-r-28">
                <span className='c2e fz-16 fwb m-l-8'>{t('Liquidity')}</span>
              </div>}
            key="liquidity">
               
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={tabValue == 'swap'?'':'hide'}><Swap></Swap></div>
      <div className={tabValue == 'liquidity'?'':'hide'}><Liquidity></Liquidity></div>
      </div>
    </div>
  )
}


export default reducxConnect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  Dex
);