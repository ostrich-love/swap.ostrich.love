import React, { useEffect, useRef, useState } from 'react';
import { FC } from 'react';
import Foot from './foot'
import { useNavigate } from 'react-router-dom';
import { Progress } from 'antd';
import toubird from '../../../assets/image/airdropnew/mobile/Highlight-Toubird.svg'
import ostrich from '../../../assets/image/airdropnew/mobile/ostrich.svg'
import bear from '../../../assets/image/airdropnew/mobile/bear.svg'
import { useTranslation } from 'react-i18next';
import { advancedSliding } from '@gystt/ysutils'
import '../style.scss';

// 手指触摸点
let startX = -1;
// 手指松开点
let endX = -1;
// 当前li的索引值
let liIndex = 1;

const Airdrop: FC = () => {
  const [Index, setIndex] = useState(1);
  const { t } = useTranslation()
  const divRef = useRef(null);
  const navigate = useNavigate();

  const onLeft = () => {
    liIndex++;
    if (liIndex > 3) {
      liIndex =1;
      setIndex(1)
    }
    console.log("left滑事件", liIndex);
    if (liIndex === 2) {
      setIndex(2)
    }
    if (liIndex === 3) {
      setIndex(3)
    }
  }
  const onRight = () => {
    liIndex--;
    console.log("right滑事件", liIndex);
    if (liIndex === 0) {
      liIndex = 3;
      setIndex(3)
    }
    if (liIndex === 1) {
      setIndex(1)
    }
    if (liIndex === 2) {
      setIndex(2)
    }
  }

  useEffect(() => {
    advancedSliding(divRef, { left: onLeft, right: onRight, slde: 20 })
  }, []);

  const onPercent = () => {
    if (Index === 1) {
      return 33
    }
    if (Index === 2) {
      return 66
    }
    if (Index === 3) {
      return 100
    }
    return 0
  }
  // // 手指触摸到屏幕
  // const handleTouchStart = (e) => {
  //   startX = e.touches[0].clientX
  // }

  // // 手指滑动
  // const handleTouchMove = (e) => {
  //   endX = e.touches[0].clientX
  // }
  // const handleTouchEnd = (e) => {
  //   // 获取滑动范围
  //   if (startX > -1 && endX > -1) {
  //     let distance = Math.abs(startX - endX);
  //     if (distance > 50) {
  //       // 两个手指位置距离相差50px，即视为要滑动
  //       if (Index === 1) {
  //         setIndex(2)
  //       }
  //       if (Index === 2) {
  //         setIndex(3)
  //       }
  //       if (Index === 3) {
  //         setIndex(1)
  //       }
  //       if (startX > endX) {
  //         liIndex--;
  //       } else {
  //         liIndex++;
  //         if (liIndex >= 0) {
  //           liIndex = 0;
  //         }
  //       }
  //     } else {
  //       return;
  //     }
  //   }
  // }


  return (
    <div
      className='mobile-airdrop-mian'
      ref={divRef}
    // onTouchStart={handleTouchStart}
    // onTouchMove={handleTouchMove}
    // onTouchEnd={handleTouchEnd}
    >
      <div className='mian'>
        <div className='layout'>
          {Index === 1 && (
            <>
              <img className='img' src={toubird} alt="" />
              <div className='content'>
                <div className='title'>{t('Evolution')}</div>
                <div className='tip'>{t('The story this time happened on that vast land')}</div>
                <div className='step' onClick={() => navigate('/quest')}>{t('Step1')} {t('miracle mission')}</div>
                <div className='step' onClick={() => navigate('/invite')}>{t('Step2')} {t('Invite Quest')}</div>
              </div>
            </>
          )}
          {Index === 2 && (
            <>
              <img className='img' src={bear} alt="" />
              <div className='content'>
                <div className='title'>{t('Oscar')}</div>
                <div className='tip'>{t('Ostriches appeared about 53 million years ago in Eurasia during the Pliocene')}</div>
              </div>
            </>
          )}
          {Index === 3 && (
            <>
              <img className='img' src={ostrich} alt="" />
              <div className='content'>
                <div className='title'>{t('Endless desert')}</div>
                <div className='tip'>{t('He encountered many dangers and difficulties during the journey, but Oscar never gave up.')}</div>
              </div>
            </>
          )}
        </div>
        <Progress className='progressbar' percent={onPercent()} showInfo={false} />
        <Foot />
      </div>
    </div>
  )
};

export default Airdrop;
