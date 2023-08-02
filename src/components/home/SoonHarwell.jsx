import './SoonHarwell.scss';
import SoonHarwellIcon from '../../assets/image/home/soon-harwell.png';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Partners1 from '../../assets/image/home/partners/partners-1.png';
import Partners2 from '../../assets/image/home/partners/partners-2.png';
import Partners3 from '../../assets/image/home/partners/partners-3.png';
import Partners4 from '../../assets/image/home/partners/partners-4.png';
import Partners5 from '../../assets/image/home/partners/partners-5.png';
import Partners6 from '../../assets/image/home/partners/partners-6.png';
import Partners9 from '../../assets/image/home/partners/partners-9.png';
import Partners10 from '../../assets/image/home/partners/partners-10.png';
import Partners11 from '../../assets/image/home/partners/partners-11.png';
import Partners12 from '../../assets/image/home/partners/partners-12.png';
import Partners13 from '../../assets/image/home/partners/partners-13.png';
import Partners14 from '../../assets/image/home/partners/partners-14.png';
export default () => {
  const [partners, setPartners] = useState([
    Partners1,
    Partners2,
    Partners3,
    Partners4,
    Partners5,
    Partners6,
    Partners9,
    Partners10,
    Partners11,
    Partners12,
    Partners13,
    Partners14,
  ]);

  return (
    <div className="soon-orich p-t-72 m-t-90">
      <div className="fz-66 fwb">Distinguished Partners</div>
      <div className="m-t-45 company">
        {partners.map((item) => {
          return (
            <div className='company-item'>
              <img src={item} alt=""/>
            </div>
          );
        })}
      </div>
      <div className="fz-66 fwb m-t-128">Start soon on Orich</div>
      <div
        className="fz-24 fw-400"
        style={{ width: '562px', margin: '24px auto 0 auto' }}
      >
        Connect your wallet and start your orich journey I hope you have a
        good trip
      </div>
      <img src={SoonHarwellIcon} width={740} className="m-t-67 m-b-294" />
    </div>
  );
};
