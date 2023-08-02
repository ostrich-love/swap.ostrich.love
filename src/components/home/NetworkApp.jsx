import './NetworkApp.scss';
import Arrow from '../../assets/image/home/arrow.svg';
import ApplicationIcon1 from '../../assets/image/home/app-icon-1.png';
import ApplicationIcon2 from '../../assets/image/home/app-icon-2.png';
import ApplicationIcon3 from '../../assets/image/home/app-icon-3.png';
import { useState } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
export default () => {
  const [applications, setApplications] = useState([
    {
      icon: ApplicationIcon1,
      mumber: '+2400%',
      type: 'Users',
      time: 'Increase in last 7 days',
    },
    {
      icon: ApplicationIcon2,
      mumber: '+5600%',
      type: 'TVL',
      time: 'Increase in last 7 days',
    },
    {
      icon: ApplicationIcon3,
      mumber: '180+',
      type: 'NFTs',
      time: 'NFT kind supported',
    },
  ]);
  return (
    <div className="network-app">
      <div className="content-wrapper">
        <div className="text-1">SCROLL DOWN</div>
        <img src={Arrow} alt="" />
        <div className="text-2">A growing Aptos network application</div>
        <div className="text-3">
          Users, Tvl and liquidity, <br />
          more kinds of NFTs on marketplace is increasing day by day
        </div>
        <div className="application">
          {applications.map((item) => {
            return (
              <div>
                <img src={item.icon} alt="" width={151} />
                <div className="mumber">
                  {item.mumber}
                   <ArrowUpOutlined  className='m-l-14' style={{'color':'#00C48C',fontSize:'25px'}} />
                </div>
                <div className="text fwb">{item.type}</div>
                <div className="text">{item.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
