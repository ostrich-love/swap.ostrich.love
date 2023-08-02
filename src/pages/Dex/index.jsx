import { Tabs } from "antd";
import { useState } from "react";
import swapTab from '../../assets/image/launchpad/swap-tab.png'
import close from '../../assets/image/swap/close.svg'
import Liquidity from "./components/Liquidity";
import Swap from "./components/Swap";
import {NavLink, useLocation } from 'react-router-dom';
import './index.scss'
import { createBrowserHistory } from 'history';
import { useTranslation } from 'react-i18next';
const history = createBrowserHistory();
function Dex() {
  let { pathname } = useLocation()
  let { t, i18n } = useTranslation()
  console.log(pathname)
  const [tabValue, setTabValue] = useState(pathname.replace('/', '')||'swap')
  const [show,setShow]=useState(true)
  
  return (
    <div className="dex">
      {show && <div className="w100 reward-area flex flex-center flex-middle">
           <span className="cy fz-16">You have <span className="fwb underline italic">45.6 Orich</span>  trading rewards to claim</span>
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

export default Dex;