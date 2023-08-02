import { useState } from 'react';
import './bannerNew.scss';
import { Carousel } from 'antd';
import BannerBg from '../../assets/image/home/banner-bg.svg';
export default () => {
  const [banners, setBanners] = useState([
    {
      url: BannerBg,
      text: 'Harwell Airdrop is alive !!!',
    },
    {
      url: BannerBg,
      text: 'adasdadad',
    },
  ]);
  return (
    <div className="banner-new">
      <Carousel autoplay>
        {banners.map((item) => {
          return (
            <div key={item.text} className="aaaa">
              <div style={{
                height: '218px',
                width: '100%',
                background: `url(${window.location.origin}${item.url}) center center /cover`,
              }}>
                <div className="banner-new-wrapper">
                  <div className="content">{item.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
