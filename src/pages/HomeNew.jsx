/* eslint-disable import/no-anonymous-default-export */
import './HomeNew.scss';
import { useState, useEffect } from 'react';
import image from '../assets/image/homenew/image.png'
import mobileImage from '../assets/image/homenew/mobile-image.png'

import useMedia from '../hooks/useMedia';
import { get } from '../api';
import { getAddress, getNetwork } from '../contracts';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Farmpool from './Home/Farmpool';
import Activenumber from '../components/common/Activenumber';
import { getLpAmounts, getReserves } from '../contracts/methods/liquidity';
import { decimal, findAddressByName, fromUnit, numFormat, toFixed, } from '../lib/util';
import { Skeleton } from 'antd';
export default () => {
  let { t, i18n } = useTranslation()
  const isSmallScreen = useMedia('(max-width:1200px)', true);
  const [list] = useState([{ value: "+2400%", tip: "Users" }, { value: "+5600%", tip: "TVL" }, { value: "345,567,456", tip: "Reward Orich" }])
  const [data] = useState([{ value: "$2.56", tip: "Current Price" }, { value: "$47,556,743", tip: "Total TVL" }, { value: "$345,324,523", tip: "Circulation supply" }, { value: "$20,000,000,000", tip: "Max supply" }])
  const [tvl, setTvl] = useState([])
  const [volume24, setVolume24] = useState(0)
  const [volumetotal, setVolumeTotal] = useState(0)
  const [price, setPrice] = useState(0)
  const [totalsupply, setTotalSupply] = useState(0)
  const [loading, setLoading] = useState(false)
  useEffect(async () => {
    setLoading(true)
    try {

    let { data: tvl_data } = await get('/api/evm/farm/tvlKline', {
      chain_id: getNetwork().networkId
    })
    setTvl((tvl_data))

    let { data: volume_24_data } = await get('/api/evm/swap/volume24', {
      chain_id: getNetwork().networkId
    })
    setVolume24(volume_24_data)


    let { data: volume_all_data } = await get('/api/evm/swap/volumeTotal', {
      chain_id: getNetwork().networkId
    })
    setVolumeTotal(volume_all_data)

    let name = 'Orich-USDC'
    let { reserve0, reserve1 } = await getReserves(findAddressByName(name))
    let reserve_x = findAddressByName(name.split('-')[0]) < findAddressByName(name.split('-')[1]) ? reserve0 : reserve1
    let reserve_y = findAddressByName(name.split('-')[0]) < findAddressByName(name.split('-')[1]) ? reserve1 : reserve0
    setPrice(toFixed(reserve_y / reserve_x, decimal))

    let total_supply = await getLpAmounts(findAddressByName('Orich'))
    setTotalSupply(total_supply)
    setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [])


  return (
    <div className="home-new">
      <div className='block-one'>
        <div className='title'>
          {t('Ostrich is an aggregated DEX + Launch +Farm platform launched to optimize and enhance interactions on mainstream L2 networks such as Base/zkSync/Arbitrum and Linea.')}
        </div>
        <div className='tip'>
          {t('It effectively improves and enriches the transactional value. Please keep an eye on us as the oasis is not yet reached; everything is just beginning!')}
        </div>
        <div className='flex flex-center flex-middle flex-wrap gap-10'>
        {/* <NavLink to="/swap">
          <div className='buttom'>{t('Get Started')}</div>
        </NavLink> */}
        <a href="https://ido.ostrich.love" target="_blank">
          <div className='buttom ido-btn cf'>{t('IDO in progress')}</div>
        </a>
        <a href="https://ido.ostrich.love/base" target="_blank">
          <div className='buttom ido-btn cf'>{t('IDO on Base')}</div>
        </a>
        </div>
        

        <div className='line-of-demarcation' />
      </div>
      {!isSmallScreen ? (
        <div className='block-two'>
          <div className='flex-Row setwidth'>
            <img src={image} alt="" />
            <div>
              <div className='title'>{t('A growing L2 network application')}</div>
              <div className='tip'>{t('Trading / Liquidity / Farming / Trading Mining')}</div>
              <div className='felxStart'>
              <div className='list-item'>
                <div className='percentage'>$<Activenumber value={volume24} /></div>
                <div className='user'>{t('24H volume')}</div>
              </div>
              <div className='list-item'>
                <div className='percentage'>$<Activenumber value={volumetotal} /></div>
                <div className='user'>{t('Total volume')}</div>
              </div>
              <div className='list-item'>
                <div className='percentage'>$<Activenumber value={tvl[tvl?.length - 1]?.tvl} /> </div>
                <div className='user'>TVL</div>
              </div>
              </div>
            </div>
          </div>

          <Farmpool className="block-farm" tvl={tvl} t={t} />
          <div className='card'>
            <div className='layout-flex'>
              <div className='left'>
                <div className='title'>{t('Seamless Cross-Chain on Base/zkSync/Arbiturm/Linea')}</div>
                <div className='tip'>{t('Achieve seamless connectivity and interoperability between different blockchain networks with efficient, secure, and cost-effective cross-chain solutions.')}</div>
              </div>
              <div className='right'>
                <div className='title'>{t('Diversified Trading')}</div>
                <div className='tip'>{t('Diversify risk, enhance investment returns, and flexibility by spreading investments across different markets and assets.')}</div>

              </div>
            </div>
            <div className='position-img'>
              <div className='right-two'>
                <div className='title'>{t('Various Staking Pools')}</div>
                <div className='tip'>{t('Facilitate the formation of liquidity and trading pairs, providing the market with increased liquidity and trading opportunities.')}</div>
              </div>
              <div className='left-two'>
                <div className='title'>{t('Earn Rewards through Trading')}</div>
                <div className='tip'>{t('Earn additional rewards during the trading process, obtaining tokens, fee sharing, liquidity rewards, or other forms of incentives based on trading behavior and participation level.')}</div>
              </div>
            </div>
          </div>
        </div>) : (
        <div className='mobile-block-two'>
          <div className='flexColumn'>
            <div className='title'>{t('A growing L2 network application')}</div>
            <div className='tip'>{t('Trading / Liquidity / Farming / Trading Mining')}</div>
            <div className='flexColumn ta'>
              <div className='list-item'>
                <div className='percentage'>$<Activenumber value={volume24} /></div>
                <div className='user'>{t('24H volume')}</div>
              </div>
              <div className='list-item'>
                <div className='percentage'>$<Activenumber value={volumetotal} /></div>
                <div className='user'>{t('Total volume')}</div>
              </div>
              <div className='list-item'>
                <div className='percentage'>$<Activenumber value={tvl[tvl?.length - 1]?.tvl} /> </div>
                <div className='user'>TVL</div>
              </div>
            </div>
            <img src={mobileImage} alt="" />
          </div>
          <Farmpool className="flexColumn" tvl={tvl} t={t}/>
          <div className='card'>
            <div className='one'>
              <div className='title'>{t('Seamless Cross-Chain on Base/zkSync/Arbiturm/Linea')}</div>
              <div className='tip'>{t('Achieve seamless connectivity and interoperability between different blockchain networks with efficient, secure, and cost-effective cross-chain solutions.')}</div>

            </div>
            <div className='tow'>
              <div className='title'>{t('Diversified Trading')}</div>
              <div className='tip'>{t('Diversify risk, enhance investment returns, and flexibility by spreading investments across different markets and assets.')}</div>
            </div>
            <div className='three'>
              <div className='title'>{t('Various Staking Pools')}</div>
              <div className='tip'>{t('Facilitate the formation of liquidity and trading pairs, providing the market with increased liquidity and trading opportunities.')}</div>
            </div>
            <div className='four'>
              <div className='title'>{t('Earn Rewards through Trading')}</div>
              <div className='tip'>{t('Earn additional rewards during the trading process, obtaining tokens, fee sharing, liquidity rewards, or other forms of incentives based on trading behavior and participation level.')}</div>
            </div>
          </div>
        </div>
      )}
      {!isSmallScreen ?
        <div className='block-three'>
          <div className='bg-img'>
            <div className='title'>{t('Ostrich makes our world fullof peace & love')}</div>
            <div className='tip'>{t('Orich token is an important part of the Base/zkSync/Arbiturm/Linea ecosystem. Once you have Orich, your world will become more colorful and your assets will increase day by day')}</div>
            <NavLink to="/swap"><div className='buttom cf'>{t('Get Started')}</div></NavLink>
            <div className='wallet-List'>
              <div className='flex-space'>
                <div className='list-item'>
              <div className='percentage'>${loading?<Skeleton.Button active size={'small'} />:<Activenumber value={price} decimals={decimal}/>}</div>
              <div className='user'>Orich Price</div>
            </div>
            <div className='list-item'>
              <div className='percentage'>{loading?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(totalsupply/1000000)} decimals={0}/>}M</div>
              <div className='user'>Total circulation</div>
            </div>

            <div className='list-item'>
              <div className='percentage'>${loading?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(totalsupply)*price/1000000} decimals={0}/>}M</div>
              <div className='user'>Market Cap</div>
            </div>
            <div className='list-item'>
              <div className='percentage'><Activenumber value={210000} decimals={0}/>M</div>
              <div className='user'>Max Supply</div>
            </div>
              </div>
            </div>
          </div>
        </div> :
        <div className='mobile-block-three'>
          <div className='bg-img'>
            <div className='title'>{t('Ostrich makes our world fullof peace & love')}</div>
            <div className='tip'>{t('Orich token is an important part of the Base/zkSync/Arbiturm/Linea ecosystem. Once you have Orich, your world will become more colorful and your assets will increase day by day')}</div>
           
            <div className='list-item'>
              <div className='percentage'>${loading?<Skeleton.Button active size={'small'} />:<Activenumber value={price} decimals={decimal}/>}</div>
              <div className='user'>Orich Price</div>
            </div>
            <div className='list-item'>
              <div className='percentage'>{loading?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(totalsupply/1000000)} decimals={0}/>}M</div>
              <div className='user'>Total circulation</div>
            </div>

            <div className='list-item'>
              <div className='percentage'>${loading?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(totalsupply)*price/1000000} decimals={0}/>}M</div>
              <div className='user'>Market Cap</div>
            </div>
            <div className='list-item'>
              <div className='percentage'><Activenumber value={210000} decimals={0}/>M</div>
              <div className='user'>Max Supply</div>
            </div>
          </div>
        </div>}
    </div>
  );
};
