import { addPoint, findAddressByName, formatTime, fromUnit, numFormat, onCopyToText } from '../../lib/util';
import { useTranslation } from 'react-i18next';
import Empty from '../../assets/image/newlaunch/empty.svg'
import community from '../../assets/json/community';
import { Button, Tooltip } from 'antd';
import { getNetwork } from '../../contracts';
import { useEffect, useState } from 'react';
import { queryPrice } from '../../contracts/methods/presale';
const Detail = ({ project }) => {
  let { t } = useTranslation()
  const [price, setPrice] = useState(1)
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
    }
  }

  useEffect(async () => {
    let price_data = await queryPrice(findAddressByName('MockETH'))
    console.log(price_data)
    setPrice(fromUnit(price_data))
  }, [])
  return (
    <div className='p-t-10'>


      {project ? (<>
        <div className="project-header flex flex-center m-t-14">
            {/* <div className="project-brief flex flex-start">
              <img src={Logo} alt="" />
              <div className="project-name-box flex flex-column m-l-22">
                <div className='fz-32 fwb project-name'>Ostrich</div>
                <div className='flex flex-center fz-14'>
                  <span className='c23 '>{t('Token Symbol')}:</span>
                  <img src={token} alt="" className='token-icon m-l-12' />
                  <span className='m-l-5 fwb'>{project.tokenSymbol} OSTR </span>
                </div>
              </div>
            </div> */}
            <div className="project-link flex flex-between flex-center w100">
              <span>
                {
                  community.map((item, index) => {
                    return <Tooltip title={item.name}><a href={item.link} target="_blank" className="m-r-18" key={item.link}>
                    <img src={item.img} alt="" />
                  </a>
                      </Tooltip>
                  })
                }
                <Tooltip title="Add to Metamask">
                <img className='add-metamask' src={require('../../assets/image/wallets/metamask.png')} alt="" onClick={addToMetamask}/>
                </Tooltip>
                
              </span>
              {/* <Button className="color add-btn m-l-40" ><span className='fwb fz-12 cf'>{t('Add to Wallet')}</span></Button> */}
            </div>
          </div>
        <div className="project-info-items flex flex-wrap">
          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('Name')}</span>
            <span className='c231 fz-16 info-type-content'>Ostrich</span>
          </div>
          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t("Token Symbol")}</span>
            <span className='c231 fz-16 info-type-content'>
               Orich
            </span>
          </div>
          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t("Token Address")}</span>
            <span>
            <a className='cy fz-16 info-type-content underline' target="_blank" href={getNetwork().params.blockExplorerUrls+'/address/'+findAddressByName('Orich')}>
               { addPoint(findAddressByName('Orich'), 6)}
            </a>
            <img src={require('../../assets/image/newlaunch/copy.svg').default} onClick={()=>onCopyToText(findAddressByName('Orich'), t)} className='m-l-5 pointer' alt="" />
            </span>
            
          </div>
          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('Total Supply')}</span>
            <span className='c231 fz-16 info-type-content'>{numFormat(210000000000)}</span>
          </div>
          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('Tokens For IDO')}</span>
            <span className='c231 fz-16 info-type-content'>{numFormat(fromUnit(project.tokenSupply||0))}</span>
          </div>

          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('Opens')}</span>
            <span className='c231 fz-16 info-type-content'>{formatTime(project.startTime)}</span>
          </div>


          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('IDO Price')}</span>
            <span className='c231 fz-16 info-type-content'>${fromUnit(project.publicPrice||0)}</span>
          </div>
          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('IDO Rate')}</span>
            <span className='c231 fz-16 info-type-content'>1 ETH = {price/fromUnit(project.publicPrice||0)} Orich</span>
          </div>

          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('Minimum Buy Amount')}</span>
            <span className='c231 fz-16 info-type-content'>${numFormat(fromUnit(project.minBuyAmount))}</span>
          </div>


          <div className="project-info-item flex flex-column m-t-24">
            <span className='c23 fz-14 info-type'>{t('Maximum Buy Amount')}</span>
            <span className='c231 fz-16 info-type-content'>${numFormat(fromUnit(project.maxBuyAmount))}</span>
          </div>
        </div>
        
        <div className="desc fz-18 c231 m-t-24">
          <div className="fz-36 fwb m-b-10">Introduction</div>
        Ostrich is an aggregated DEX platform designed to optimize and enhance the user experience of mainstream L2 interactions like zkSync and Linea, increasing user trading values. <br/>
        A) Ostrich supports mainstream L2 Pools like SyncSwap, and users can earn additional Ostrich rewards when trading on Ostrich.<br/>
B) Ostrich Airdrop allows users to get Freemint NFTs, which can improve the ZKS airdrop ranking on the L2 interaction layer.<br/>
C) Ostrich Farm module will be launched in the future, enabling users to earn Ostrich rewards by providing liquidity to LP pools like ETH-USDC. This can significantly enhance the ZKS airdrop ranking.<br/>
D) Ostrich will support more mainstream L2 solutions like Linea in the future, helping users improve the quality of their TX interactions.
        </div>
      </>) : (
        <div className='noData'>
          <img src={Empty} alt="Empty" />
          <div>No content for now</div>
        </div>
      )}
    </div>
  )
}

export default Detail