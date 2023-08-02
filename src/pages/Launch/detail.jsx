/* eslint-disable import/no-anonymous-default-export */
import './detail.scss'
import { Breadcrumb, Button, Tabs } from 'antd';
// import logo from '../../assets/image/projectdetail/logo.png'
// import die from '../../assets/image/projectdetail/die.png'
// import songshu from '../../assets/image/projectdetail/songshu.png'
import token from '../../assets/image/newlaunch/token.png'
// import voice from '../../assets/image/projectdetail/voice.png'
import slogan from '../../assets/image/newlaunch/banner.jpg'
// import mogu from '../../assets/image/projectdetail/mogu.png'
// import songzi from '../../assets/image/projectdetail/songzi.png'
import Logo from '../../assets/image/newlaunch/logo.png'
import Detail from './detailData.jsx'
import ClaimList from './ClaimList.jsx'
import BuyList from './BuyList.jsx'
import Ido from './Ido.jsx'
import community from '../../assets/json/community';
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal.jsx'
import sahua from '../../assets/image/airdropnew/sahua.png'
import { useTranslation } from 'react-i18next';
import { connect as reducxConnect } from 'react-redux'
import { queryGlobalView, queryUserInfo } from '../../contracts/methods/presale';
import { calcHours, findAddressByName } from '../../lib/util';

// import { formatTime } from '../../lib/util';
// import project from '../../components/project';

export default reducxConnect(
  (state, props) => {
    return { ...state, ...props }
  }
)((props) => {
  let { id } = useParams()
  let { t } = useTranslation()
  const [isVisible,setVisible]=useState(false);
  const [globalData,setGlobalData]=useState({});
  const [refresh,setRefresh]=useState(0);
  let [userInfo, setUserInfo] = useState({})
  
  useEffect(async()=>{
    try {
      let global_data = await queryGlobalView()
      console.log(global_data)
      if(global_data.startTime*1 > (Date.now()/1000)) {
        global_data.not_started = true
      }
      if(
        global_data.tokenSales*1 >= global_data.tokenSupply*1
      ) {
        global_data.tokenSales = global_data.tokenSupply
        global_data.isCompleted= true
      }
      
      setGlobalData(global_data)
    } catch {

    }
  }, [refresh])

  useEffect(async()=>{
    if(props.account) {
      try {
        let user_info = await queryUserInfo(props.account)
        console.log(user_info)
        setUserInfo(user_info)
      } catch {
        setUserInfo({})
      }
    } else {
      setUserInfo({})
    }
    
  }, [props.account, refresh])

  return (
    <>
      <div className='project-detail p-t-40'>
        <div className="project-inner">
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item href="/launch">Project</Breadcrumb.Item>
            <Breadcrumb.Item>{project.name}</Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="project-info m-t-40 p-b-100 flex flex-between">
            <div className="project-info-detail">
              <img src={slogan} alt="" className='slogan m-b-40' />
              <Tabs defaultActiveKey="1" className='my-tab '>
                <Tabs.TabPane tab={
                  <div>
                    <span className='c23 fz-16 fwb m-l-8'>{t('Project Detail')}</span>
                  </div>
                } key="1">
                  <Detail project={globalData} />
                </Tabs.TabPane>
                {
                  userInfo.tokenAmount*1 && (<><Tabs.TabPane tab={
                    <div>
                      <span className='c23 fz-16 fwb m-l-8'>{t('Claim')}</span>
                    </div>
                  } key="2">
                    <div className="desc fz-18 c231 m-b-24">
                      {t('claimtext').replace('24h', globalData?.claimTimes?calcHours(globalData?.claimTimes[0]):'-')}
                    </div>
                    {/* userInfo.claimRecords|| */}
                    <ClaimList claimTimes={globalData?.claimTimes||[0,0,0,0]} claimStartTime={globalData?.claimStartTime||0} buyAmount={userInfo.tokenAmount||0} claimRecord={userInfo.claimRecords||[]}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={
                    <div>
                      <span className='c23 fz-16 fwb m-l-8'>{t('Buy Record')}</span>
                    </div>
                  } key="3">
                    <div className="desc fz-18 c231 m-b-24">
                    </div>
                    <BuyList list={userInfo.buyRecords||[]}/>
                  </Tabs.TabPane></>)
                }
              </Tabs>
            </div>
            {/* <div> */}
            <Ido project={globalData} userInfo={userInfo}  onOpenPage={() => {
              setVisible(true)
              setRefresh(refresh+1)
            }}/>
            {/* </div> */}
            
          </div>
        </div>
      </div>
      <Modal
        isVisible={isVisible}
        width={300}
        title={t('Congratulations')}
        className='Launch-modal'
        onClose={() => setVisible(false)}
      >
        <img src={sahua} alt="" width={56} />
        <div className='content'>{t('idosuccesstext').replace('24h', globalData?.claimTimes?calcHours(globalData?.claimTimes[0]):'-')}</div>
        <div className='buttom' onClick={() => setVisible(false)}>{t('Got it')}</div>
      </Modal>
    </>
  )
}
);