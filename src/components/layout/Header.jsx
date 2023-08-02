/* eslint-disable import/no-anonymous-default-export */
import logo from '../../assets/image/common/ostrich.svg';
import menu from '../../assets/image/common/menu.svg';
import menuw from '../../assets/image/common/menuw.svg';
import { Button, Drawer, Radio, Space, Tooltip } from 'antd';
import global from '../../assets/image/common/global.svg';
import { NavLink, useLocation } from 'react-router-dom'
import community from '../../assets/json/community';
import './Header.scss'
import Connect from './Connect'
import soon from '../../assets/image/nav/soon.svg'
import hot from '../../assets/image/nav/hot.svg'
import { useEffect, useState } from 'react';
import Lang from './Lang';
import Chain from '../Chain';
import { useTranslation } from 'react-i18next';
import AddNetwrok from './AddNetwrok';

const nav = [
  {
    name: 'Home',
    isoutlink: true,
    link: 'https://ostrich.love',
    icon: require('../../assets/image/nav/Home.svg').default
  },
  {
    name: 'LaunchPool',
    link: '/',
    icon: require('../../assets/image/nav/Farm.svg').default
  },
]
//显示透明的菜单栏
const pathnameList = ['/airdrop', '/invite', '/quest']
export default () => {
  let [show, setShow] = useState(false)
  let { t, i18n } = useTranslation()
  let [navlist, setNavlist] = useState(nav)
  let [hasbg, setHasBg] = useState(false)
  let { pathname } = useLocation()
  useEffect(() => {
    console.log(pathname)
    setShow(false)
  }, [pathname])
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setHasBg((document.documentElement.scrollTop || document.body.scrollTop) > 80)
    }, true);
  }, [hasbg])
  //自定义菜单
  const onCustomizeMenu = () => {
    return (
      <div className={`nav-items fz-16 m-l-80 flex`}>
        {
          navlist.map(item => {
            return (
              item.disabled ?
                <div key={item.name} className={`m-r-15 flex flex-center nav-item disabled ${isShow && 'colors'}`} >
                  <img src={item.icon} alt="" className='m-r-5' />
                  {t(item.name)}
                  {
                    item.iscoming && <img src={soon} alt="" className='m-r-5' />
                  }
                  {
                    item.ishot && <img src={hot} alt="" className='m-r-5' />
                  }
                </div>:(
                  item.isoutlink ? 
                  <a disabled={item.disabled} target="_blank" href={item.link} key={item.name} className={`m-r-15 flex flex-center nav-item ${(isShow && pathname!=='/launch') && 'colors'}`} >
                  <img src={item.icon} alt="" className='m-r-5' />
                  {t(item.name)}
                  {
                    item.iscoming && <img src={soon} alt="" className='m-r-5' />
                  }
                  {
                    item.ishot && <img src={hot} alt="" className='m-r-5' />
                  }
                </a>
                :
                <NavLink disabled={item.disabled} to={item.link} key={item.name} className={`m-r-15 flex flex-center nav-item ${(isShow && pathname!=='/launch') && 'colors'}`} >
                  <img src={item.icon} alt="" className='m-r-5' />
                  {t(item.name)}
                  {
                    item.iscoming && <img src={soon} alt="" className='m-r-5' />
                  }
                  {
                    item.ishot && <img src={hot} alt="" className='m-r-5' />
                  }
                </NavLink>
                )
            )
          })
        }
      </div>
    )
  }
  const isShow = (pathnameList.includes(pathname) && !hasbg);
  return (
    <>
      <div className={"p-t-20 p-l-40 p-r-40 p-b-20 flex flex-between flex-center header " + (isShow ? 'transparent' : '')}>
        <div className="nav-part flex flex-center">
          <img src={logo} alt="" className='orich-logo' />
          {!isShow && onCustomizeMenu()}
        </div>
          {isShow && onCustomizeMenu()}
        <div className="connect-part flex flex-center ">
          <AddNetwrok isShow={pathnameList.includes(pathname) && !hasbg} pathname={pathname}/>
          <Chain isShow={pathnameList.includes(pathname) && !hasbg} pathname={pathname} />
          <Lang isShow={pathnameList.includes(pathname) && !hasbg} pathname={pathname}/>

          <Connect />
        </div>

        <div className="show-m">
          {/* <img src={global} alt="" className='global'/> */}
          <img src={isShow ?menuw:menu} alt="" className='menu m-l-24' onClick={() => setShow(!show)} />
          <Drawer
            title=""
            placement='right'
            closable={true}
            onClose={() => setShow(false)}
            visible={show}
            className="connect-drawer"
            key='right'
            width={300}
          >
            <div className='flex flex-column nav-mobile w100'>
              {
                navlist.map(item => {
                  return (item.disabled ?
                    <div key={item.name} className="flex flex-center nav-link">
                      <div className="mobile-icon">
                        <img src={item.icon} alt="" className='m-r-5' />
                      </div>
                      {item.name}
                      {
                        item.iscoming && <img src={soon} alt="" className='m-r-5' />
                      }
                    </div> : (
                      item.isoutlink ?
                      <a  href={item.link} target="_blank" key={item.name}>
                      <div className="mobile-icon">
                        <img src={item.icon} alt="" className='m-r-5' />
                      </div>
                      {item.name}
                    </a>:
                      <NavLink to={item.link} key={item.name}>
                      <div className="mobile-icon">
                        <img src={item.icon} alt="" className='m-r-5' />
                      </div>
                      {item.name}
                    </NavLink>
                    ))
                })
              }
              {/* <NavLink to={'/getquota'}>
                    <div className="mobile-icon">
                      <img src={require('../../assets/image/nav/Staking.svg').default} alt="" className='m-r-5' />
                    </div>
                    Get Quota
                  </NavLink>
              <NavLink to="/swap">
                <div className='buy-btn button fz-14 ta hover m-t-40 m-b-20 w100'>
                Buy Orich
              </div>
              </NavLink> */}
              <div className="m-t-20 flex flex-column gap-10">
                
                <Chain />
                <Connect />
                <Lang />
                <AddNetwrok />
              </div>
              <div className="flex community-mobile flex-middle m-t-40">
                {
                  community.map((item, index) => {
                    return <a href={item.link} className="m-r-14" target='_blank' key={index} rel="noreferrer">
                      <img src={item.img} alt="" />
                    </a>
                  })
                }
              </div>

            </div>
          </Drawer>
        </div>
      </div>
      {!pathnameList.includes(pathname) && <div className="header-offset"></div>}
    </>

  )
}