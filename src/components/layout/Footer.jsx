/* eslint-disable import/no-anonymous-default-export */
import logo from '../../assets/image/common/ostrich.svg';
import open from '../../assets/image/common/open.svg';
import community from '../../assets/json/community';
import './Footer.scss'
import { useState } from 'react';
export default () => {
  const [imgIndex, setIndex] = useState(0)
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