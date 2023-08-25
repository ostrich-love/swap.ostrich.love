/* eslint-disable import/no-anonymous-default-export */
import logo from '../../assets/image/common/ostrich.svg';
import open from '../../assets/image/common/open.svg';
import metamask from '../../assets/image/wallets/metamask.png';
import community from '../../assets/json/community';
import './Footer.scss'
import { useState } from 'react';
import { Tooltip } from 'antd';
import { findAddressByName } from '../../lib/util';
export default () => {
  const [imgIndex, setIndex] = useState(0)
  const addToMetamask = () => {
    if (window.ethereum) {
      window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
              address: findAddressByName('Orich'), // The address that the token is at.
              symbol: 'Orich', // A ticker symbol or shorthand, up to 5 chars.
              decimals: 18 // The number of decimals in the token
              // image: outputToken.logo, // A string url of the token logo
          },
      }})
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
                address: findAddressByName('Orich-ETH'), // The address that the token is at.
                symbol: 'Orich-ETH', // A ticker symbol or shorthand, up to 5 chars.
                decimals: 18 // The number of decimals in the token
                // image: outputToken.logo, // A string url of the token logo
            },
        }})

      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
                address: findAddressByName('Bitcoin'), // The address that the token is at.
                symbol: 'Bitcoin', // A ticker symbol or shorthand, up to 5 chars.
                decimals: 18 // The number of decimals in the token
                // image: outputToken.logo, // A string url of the token logo
            },
        }})
    }
  }
  return (
    <div className="footer p-t-70">
      <div className="footer-inner">
        <div className="footer-top flex align-items flex-between p-b-56">

          <div className="left-part flex flex-center flex-column">
            <img src={logo} alt="" />
            {/* <div className="fz-14 c2e ta m-t-33 desc">Bronze / Silver/ Gold / Platinum / Diamond, Different levels of users get different rights</div> */}

            <span className='show-m m-t-35'>
              {
                community.map((item, index) => {
                  return <a href={item.link} className="m-r-14" key={index}>
                    <img src={item.img} alt="" />
                  </a>
                })
              }
              <img src={metamask} alt="" className='pointer' onClick={addToMetamask} width={33}/>
            </span>
          </div>
          <div className="other-info p-t-20  p-b-50 flex flex-end flex-column flex-between align-items">
            <span className='show-p'>
              {
                community.map((item, index) => {
                  return <a href={item.link} key={index} target="_blank" className="m-r-14" rel="noreferrer">
                    <img src={index + 1 === imgIndex ? item.imgColor : item.img} alt=""
                      onMouseLeave={() => setIndex(null)}
                      onMouseEnter={() => setIndex(index + 1)}
                    />
                  </a>
                })
              }
              <Tooltip title="add $Orich/$Orich-ETH/$Bitcoin to metamask">
              <img src={metamask} className='pointer' alt="" width={33} onClick={addToMetamask}/>
              </Tooltip>
              
            </span>
            <span className='c2e fz-14 copyright m-t-16'>
              ©  Copybyte Ostrichlove 2020 - 2023. All Rights Reserved.
            </span>

          </div>
          <div className="right-part c2e flex p-t-20">
            <div className="nav-item m-b-40">
              {/* <div className="nav-name fz-16 fwb m-b-56">
                            Support
                            </div> */}
              <a className="nav-item-inner fz-14  c2e" target='_blank' href="https://docs.ostrich.love/" rel="noreferrer">
                Ostrich Docs  <img src={open} alt='' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}