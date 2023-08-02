import React, { useState } from 'react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Foot from './foot'
import Tuobird from '../../assets/image/airdropnew/Tuobird.svg'
import Highlight from '../../assets/image/airdropnew/Highlight.svg'
import bear from '../../assets/image/airdropnew/Oscar@2x.png'
import highligehtBear from '../../assets/image/airdropnew/highligeht-bear.svg'
import HighlightToubird from '../../assets/image/airdropnew/Highlight-Toubird.svg'
import useMedia from '../../hooks/useMedia';
import MobileAridrop from './mobile-aridrop/index.tsx';
import { useTranslation } from 'react-i18next';

import './style.scss';

interface IProps {
  props: string;
}
const Airdrop: FC<IProps> = () => {
  const [showType, setType] = useState('');
  const navigate = useNavigate();
  const onMouseEnter = (type: string) => setType(type);
  const onMouseLeave = () => setType('');
  const { t } = useTranslation()

  const isSmallScreen = useMedia('(max-width:1200px)', true);

  return (
    <>
      {isSmallScreen ? (<MobileAridrop />) : (
        <div className='airdrop-mian'>
          <div className='map'>
            <img className='one' src={Highlight} alt="" />
            <div className='one-content'>
              <div className='title'>{t('Evolution')}</div>
              <div className='tip' dangerouslySetInnerHTML={{__html:t('The story this time <br/> happened on that vast land')}}></div>
              <div className='step' onClick={() => navigate('/quest')}>{t('Step1')} {t('Miracle mission')}</div>
              <div className='step' onClick={() => navigate('/invite')}>{t('Step2')} {t('Invite Quest')}</div>
              {/* <div className='quest'>Reddit Quest</div> */}
            </div>
            <img
              className='two'
              width={406}
              src={showType !== 'two' ? bear : highligehtBear}
              alt=""
              onMouseEnter={() => onMouseEnter('two')}
              onMouseLeave={() => onMouseLeave()}
            />
            {showType === 'two' && <div className='two-content'>
              <div className='title'>{t('Oscar')}</div>
              <div className='tip'>{t('Ostriches appeared about 53 million years ago in Eurasia during the Pliocene')}</div>
            </div>}
            <img
              className='three'
              src={showType !== 'three' ? Tuobird : HighlightToubird}
              alt=""
              onMouseEnter={() => onMouseEnter('three')}
              onMouseLeave={() => onMouseLeave()}
            />
            {showType === 'three' && <div className='three-content'>
              <div className='title'>{t('Endless desert')}</div>
              <div className='tip'>{t('He encountered many dangers and difficulties during the journey, but Oscar never gave up.')}</div>
            </div>}
          </div>
          <Foot />
        </div>
      )}
    </>
  )
};

export default Airdrop;
