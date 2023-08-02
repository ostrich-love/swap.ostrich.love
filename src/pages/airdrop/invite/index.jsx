import React, { FC, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import back from '../../../assets/image/airdropnew/invite/back.svg';
import Foot from '../foot';
import one from '../../../assets/image/airdropnew/invite/one.svg'
import two from '../../../assets/image/airdropnew/invite/two.svg';
import three from '../../../assets/image/airdropnew/invite/three.svg';
// import MobileInvite from '../mobile-aridrop/invite3/index'
import useMedia from '../../../hooks/useMedia';
import { Tabs, message } from "antd";
import { useTranslation } from 'react-i18next';
import Copy from '../../../assets/image/airdropnew/opy-link.svg'
import beartwo from '../../../assets/image/airdropnew/mobile/beartwo.svg';
import backtwo from '../../../assets/image/airdropnew/backtwo.png';
import Ow from '../../../assets/image/airdropnew/ow.png'
import './style.scss';
import { getNetwork } from '../../../contracts';
import { get, get_without_tips } from '../../../api';
import { connect as reducxConnect } from 'react-redux'
import { addPoint, toFixed } from '../../../lib/util';
import { resolveDomain } from '../../../contracts/methods/airdrop';


const data = Array.from({ length: 100 }, (res, index) => {
  return {
    id: index + 1,
    address: "0xeb67...3fa836",
    users: '2318'
  }
});
const newLIist = [{ name: 'Your Rank', value: 0 }, { name: 'Top', value: 3124 }, { name: 'Invited', value: 6 }, { name: 'Ostrich Eggs', value: 7 }]
const Invite = (props) => {
  const navigate = useNavigate();
  const isSmallScreen = useMedia('(max-width:1200px)', true);
  const { t } = useTranslation()
  const [tabValue, setTabValue] = useState('2')
  const [recordList, setRecordList] = useState([])
  const [isComplete, setComplete] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [refCount, setRefCount] = useState(1)
  const [bnbdomain, setBnbdomain] = useState('')
  const [loading, setLoading] = useState(false)

  const onImg = (index) => {
    if (index === 1) {
      return <img src={one} alt="" />
    } else if (index === 2) {
      return <img src={two} alt="" />
    } else {
      return <img src={three} alt="" />
    }
  }

  useEffect(() => {
    get('/api/evm/airdrop/referrerTop100', {
      chain_id: getNetwork().networkId
    }).then(res => {
      console.log(res)
      setRecordList(res.data)
    })
  }, []);
  useEffect(async() => {
    if(props.account) {
       let {name} = await  resolveDomain(props.account)
       setBnbdomain(name)
        get_without_tips('/api/evm/airdrop/user', {
            address: props.account,
            chain_id: getNetwork().networkId
        }).then(res => {
            console.log(res)
            setComplete(res.data?.discord && res.data?.twitter)
            setUserInfo(res.data)
        }).catch(err => {
          setComplete(false)
          setUserInfo({})
        })
       get('/api/evm/airdrop/referrerCount', {
        chain_id:getNetwork().networkId
       }).then(res => {
        setRefCount(res.data||1)
       })
    } else {
      setBnbdomain('')
    }
}, [props.account])

  const onCopyToText=(text)=>{
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    message.success(t('Copied'))
  };
  return (
    <>
      {isSmallScreen ? (
    <div className='mobile-invite-mian'>
      <div className='mobile-invite-layout'>
        <div className='mobile-mountain'>
          <div className='title'>
            <img src={back} alt="back" onClick={() => navigate('/airdrop')} />
            <div>{t('Invite Quest')}</div>
          </div>
          {
                  isComplete && 
                  <div className='invite-mobile-header'>
            <div className="invite-tab flex flex-center flex-between gap-10">
              <div className="p-l-9 p-r-9 tab-item">
                      <span className='cf fz-14'>
                        Invite Link
                      </span>
                    </div>
            <div className="p-l-12 p-r-8 tab-item active flex-1 flex flex-between">
                      <span className='cf fz-14 text-ellipsis flex-1'>
                      {`https://${window.location.host}/quest?code=${bnbdomain||userInfo.code}`}
                      </span>
                      <span className='icon-copy' onClick={()=>onCopyToText(`https://${window.location.host}/quest?code=${bnbdomain||userInfo.code}`)}>
                        <img src={Copy} width={12} alt="" />
                      </span>
                    </div>
            </div>
          
            <div className='invite-detail'>
                      <div className='items'>
                              <div className='number'>{t('Your Rank')}</div>
                              <div className='name'>{userInfo.rank||'-'}</div>
                            </div>
                            <div className='vertical-line' />
                            <div className='items'>
                              <div className='number'>{t('Top')}</div>
                              <div className='name'>{userInfo.rank?toFixed(userInfo.rank*100/refCount, 0):'-'}</div>
                            </div>
                            <div className='vertical-line' />
                            <div className='items'>
                              <div className='number'>{t('Invited')}</div>
                              <div className='name'>{userInfo.refer_count||0}</div>
                            </div>
                    </div>
            <div className='detail-tips'>Invite 5 friends to get a copper box ({userInfo.refer_count||0}/5)</div>
          </div>
          }
          
          <img src={beartwo} alt="" />
          {
            !isComplete &&<div className='bear'>
            <div className='tip'>{t("Complete the Sailor's Quest to unlock the invite quest")}</div>
            <NavLink to={"/quest"+(localStorage.getItem('referCode')?'?code='+localStorage.getItem('referCode'):'')}>
                    <div className='buttom'>{t("Ostrich's Quest")}</div>
                  </NavLink>
          </div>
          }
          
          <div className='mobile-list'>
            <div className='th'>
              <div>#</div>
              <div>{t('Address')}</div>
              <div>{t("Invite Users")}</div>
            </div>
            <div className='scrolledList'>
              {recordList?.map((res, index) => {
                return (
                  <div className='tr'>
                    {index < 3 ? onImg(index + 1) : <div>{index * 1 + 1}</div>}
                    <div><img src={Ow} alt="" width={18} /> {addPoint(res.address)}</div>
                    <div className='user'>{res.refer_count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <Foot />
      </div>
    </div>) : (
        <div className='invite-mian'>
          <div className='invite-layout'>
            <div className='mountain'>
              <div className='invite-quest'>
                <div className='title'>
                  <img src={back} alt="back" onClick={() => navigate('/airdrop')} />
                  <div>{t('Invite Quest')}</div>
                </div>
                {
                  isComplete && 
                  <div className="invite-header">
                    <div className='tabs-content'>
                      <div className="invite-tab flex flex-center flex-between">
                      <div className="p-l-9 p-r-9 tab-item">
                            <span className='cf fz-16'>
                              Invite Link
                            </span>
                          </div>
                          <div className="p-l-18 p-r-8 tab-width tab-item active">
                            <span className='cf fz-16' id='text'>
                              {`https://${window.location.host}/quest?code=${bnbdomain||userInfo.code}`}
                            </span>
                            <span className='icon-copy' onClick={()=>onCopyToText(`https://${window.location.host}/quest?code=${bnbdomain||userInfo.code}`)}>
                              <img src={Copy} width={12} alt="" />
                            </span>
                          </div>
                      </div>
  
                    <div className='invite-detail'>
                      <div className='items'>
                              <div className='number'>{t('Your Rank')}</div>
                              <div className='name'>{userInfo.rank||'-'}</div>
                            </div>
                            <div className='vertical-line' />
                            <div className='items'>
                              <div className='number'>{t('Top')}</div>
                              <div className='name'>{userInfo.rank?toFixed(userInfo.rank*100/refCount, 0):'-'}</div>
                            </div>
                            <div className='vertical-line' />
                            <div className='items'>
                              <div className='number'>{t('Invited')}</div>
                              <div className='name'>{userInfo.refer_count||0}</div>
                            </div>
                    </div>
                    <div className='detail-tips'>Invite 5 friends to get a copper box ({userInfo.refer_count||0}/5)</div>
                    </div>
                  </div>
                }
          <img src={backtwo} alt="" className='bear-img'/>
                {
            !isComplete && <div className='bear'>
                  <div className='tip'>{t("Complete the Sailor's Quest to unlock the invite quest")}</div>
                  <NavLink to={"/quest"+(localStorage.getItem('referCode')?'?code='+localStorage.getItem('referCode'):'')}>
                    <div className='buttom'>{t("Ostrich's Quest")}</div>
                  </NavLink>
                  
                </div>}
              </div>
              <div className='list'>
                <div className='th'>
                  <div>#</div>
                  <div>{t('Address')}</div>
                  <div>{t("Invite Users")}</div>
                </div>
                <div className='scrolledList'>
                  {recordList?.map((res, index) => {
                    return (
                      <div className='tr'>
                        {index < 3 ? onImg(index + 1) : <div>{index * 1 + 1}</div>}
                        <div><img src={Ow} alt="" width={18} /> {addPoint(res.address)}</div>
                        <div className='user'>{res.refer_count}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <Foot />
          </div>
        </div>)}
    </>
  )
};

export default reducxConnect(
  (state, props) => {
      return { ...state, ...props }
  }
)(
   Invite
);