import React from "react";
import community from "../../assets/json/community";
const Foot = () => {
  return (
    <div className='foot'>
      Ostrichlove @ 2023, All rights reserved
      <div className="icon">
        {community.map(res => {
          return <a target="_blank" href={res.link} rel="noreferrer"><img src={res.imgw} alt="" /></a>
        })}
      </div>
    </div>
  )
}

export default Foot