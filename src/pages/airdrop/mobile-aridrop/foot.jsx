import React from "react";
import socialize1 from '../../../assets/image/airdropnew/socialize1.svg'
import socialize2 from '../../../assets/image/airdropnew/socialize2.svg'
import socialize3 from '../../../assets/image/airdropnew/socialize3.svg'
import Clipped from '../../../assets/image/airdropnew/Clipped.svg'
import '../style.scss';

const list = [Clipped,socialize3,socialize1, socialize2];

const Foot = () => {
  return (
    <div className='mobile-foots'>
      <div className="titel">Ostrichlove © 2023, All rights reserved</div> 
      <div className="icon">
        {list.map(res => {
          return <img src={res} alt="" />
        })}
      </div>
    </div>
  )
}

export default Foot