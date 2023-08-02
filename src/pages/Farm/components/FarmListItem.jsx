import '../index.scss';
import { Button, Skeleton, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ReactComponent as DownCircleOutlined } from '../../../assets/image/common/DownCircleOutlined.svg'
import { ReactComponent as UpCircleOutlined } from '../../../assets/image/common/UpCircleOutlined.svg'
import classNames from 'classnames';
import { ReactComponent as ArrowOpen } from '../../../assets/image/common/down.svg'
import { getTokenByName } from '../../Dex/components/list';
import { calcDays, calcHours, findAddressByName, findNameByAddress, formatTime, fromUnit, hexToString, numFormat, showLogin, toFixed } from '../../../lib/util';
import Activenumber from '../../../components/common/Activenumber';
import store from '../../../store';
import { getAddress } from '../../../contract';
import { intervalUnit, interval_unit_text, timeUnit } from '../../../global';
  import { ClaimTips } from '../../../contract/farmlist';
  import share from '../../../assets/image/farm/share.svg'
import { useTranslation } from 'react-i18next';
import Boost from './Boost';
import { getNetwork } from '../../../contracts';

const FarmListItem = (props) => {
  const [open, setOpen] = useState(false);
  const [lastTime, setLastTime] = useState(0)
  let { t, i18n } = useTranslation()
  return (
    <div className='farm-list-item m-b-30 w100'>
      <div className='farm-list-item-header flex flex-between'>
        <div className='token-info flex flex-center'>
          {
              <div className='coin-logo flex flex-center'>
                {
                  findNameByAddress(props.info.depositToken)?.split('-').map((item, i, arr) => {
                    return <img src={getTokenByName(item).icon} key={item}  style={{ zIndex: arr.length - i }} />
                  })
                }
              </div>
          }
          <div className='token-info-name flex flex-center'>
            <div className='m-l-13 fz-24 fwb token-info-name-title'>
              {
                findNameByAddress(props.info.depositToken).includes('-') ? (findNameByAddress(props.info.depositToken) + '（2Pool LP）') : (findNameByAddress(props.info.depositToken))
              }
            </div>
            <div className='flex flex-center'>
              
              <a target="_blank" href={getNetwork().params.blockExplorerUrls[0]+'address/'+findAddressByName('BOrichPool')} className="cy view-contract islink underline pointer m-l-10 fz-14">{t('View Contract')}
                 <img src={share} alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className='flex flex-center token-info-right'>
          {/* <span>View LP Distributio</span> */}
          {/* <YouJianTou className='m-l-3' width={17}></YouJianTou> */}
        </div>
      </div>
      <hr className='m-t-24 m-b-24 hr-line' />
      <div className='flex flex-center pointer center-info-data' onClick={() => { setOpen(o => !o) }}>
        <div className='flex-1 flex flex-between center-info-data-list'>
          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('My position')} <Tooltip title=''><QuestionCircleOutlined /></Tooltip></div>
            <div className='value fw-500 c2b lh-20'>
            {typeof(props.info.depositions?.depositAmount) == 'undefined' ?<Skeleton.Button active size={'small'} />:(<><Activenumber value={fromUnit(props.info.depositions?.depositAmount)} decimals={6}/></>)}
              &nbsp;
              {
                findNameByAddress(props.info.depositToken)
              }</div>
          </div>

          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('Total Staked')} </div>
            <div className='value fw-500 c2b lh-20'>
              {typeof(props.info.depositAmount) == 'undefined' ?<Skeleton.Button active size={'small'} />:fromUnit(props.info.depositAmount)}
              &nbsp;
              {
                findNameByAddress(props.info.depositToken)
              }
            </div>
          </div>

          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('My proportion')} </div>
            <div className='value fw-500 c2b lh-20'>
              {typeof(props.info.depositions?.depositAmount) == 'undefined' ?<Skeleton.Button active size={'small'} />:toFixed(fromUnit(props.info.depositions?.depositAmount)*100/fromUnit(props.info.depositAmount), 2)+ '%'}
              
            </div>
          </div>
          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('Earn')} </div>
            <div className='value fw-500 c2b lh-20'>{findNameByAddress(props.info.rewardToken)}</div>
          </div>

          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('Deposit ends in')} {typeof(props.info.depositEndTime) != 'undefined' &&<Tooltip title={`Deposit ends in ${formatTime(props.info.depositEndTime)}`}><QuestionCircleOutlined /></Tooltip>}</div>
            <div className='value fw-500 c2b lh-20'>
              {
                typeof(props.info.depositEndTime) == 'undefined' ?<Skeleton.Button active size={'small'} />:(<><Activenumber value={calcDays(props.info.depositEndTime)} decimals={0}/> days {calcDays(props.info.depositEndTime) == 0 ? '(Ended)':''}</>)
              }</div>
          </div>
          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('Harvest starts in')} {typeof(props.info.claimStartTime) != 'undefined' &&<Tooltip title={`Harvest starts in ${formatTime(props.info.claimStartTime)}`}><QuestionCircleOutlined /></Tooltip>}</div>
            <div className='value fw-500 c2b lh-20'>
              {
                typeof(props.info.claimStartTime) == 'undefined' ?<Skeleton.Button active size={'small'} />:(<><Activenumber value={calcDays(props.info.claimStartTime)} decimals={0}/> days {calcDays(props.info.claimStartTime) == 0 ? '(Started)':''}</>)
              }</div>
          </div>

          <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>{t('Total Reward')} </div>
            <div className='value fw-500 c2b lh-20'>
            {
                typeof(props.info.totalReward) == 'undefined' ?<Skeleton.Button active size={'small'} />:
                (numFormat(fromUnit(props.info.totalReward) || '0'))
                // <Activenumber value={fromUnit(props.info.weeklyReward) || '0'} decimals={4}/>
            }
            </div>
          </div>
          {/* <div className='center-info-data-list-item'>
            <div className='label fz-14 lh-18 m-b-8'>Governance Weight </div>
            <div className='value fw-500 c2b lh-20 tr'>46.23</div>
          </div> */}
        </div>
        {
          open
            ? (
              <DownCircleOutlined className='m-l-64 m-r-8 open-icon' width={24} height={24} ></DownCircleOutlined>
            ) : (<UpCircleOutlined className='m-l-64 m-r-8 open-icon' width={24} height={24}></UpCircleOutlined>)
        }
      </div>
      {
        open && (
          <div className='m-t-16 flex open-box'>
            <div className='flex-1 flex c2b lh-30 border-r p-t-30 p-b-30 p-l-40 p-r-40 open-box-left'>
              <div className='flex-1'>
                <div className=''>{t('Expected Earned')}</div>
                <div className='fwb fz-18'>
                {
                  typeof(props.info?.reward) == 'undefined' ?<Skeleton.Button active size={'small'} />:<Activenumber value={fromUnit(props.info?.reward)} decimals={6} /> 
                }
                  &nbsp;{findNameByAddress(props.info.rewardToken)}
                  
                  </div>
                {/* <div className='fz-14 fw-500'>≈ $1,000.00</div> */}
              </div>
              {
                props.account?(
                  <>
                  {
                    Date.now()/1000 > props.info?.depositStartTime && Date.now()/1000 < props.info?.claimStartTime && 
                    <Button className='color supply-btn fwb c231 fz-14 fwb m-t-30 ta hover' loading={props.claimLoading} onClick={props.showUnStake}>{t('Unstake')}</Button>
                  }
                  {
                    Date.now()/1000 > props.info?.claimStartTime && 
                    <Button className='color supply-btn fwb c231 fz-14 fwb m-t-30 ta hover' disabled={props.info.depositions?.reward <=0} loading={props.claimLoading} onClick={props.toClaim}>{t('Claim')}</Button>
                  }
                    
                  </>
                ):''
              }
            </div>
            <div className='flex-1 c2b lh-30 p-t-20 p-l-40 p-r-40 p-b-30 open-box-right'>
              <div className='flex flex-center open-box-right-header'>

                <div className='flex-1'>
                  <div className="flex flex-center gap-15">
                    <div>
                      <div>
                      {t('Staked')}
                        &nbsp;  <a className='cf68' target="_blank" href={props.info.lptype == 'LPToken' ?`https://swap.ostrich.love/liquidity`:'https://swap.ostrich.love/swap'}>{t('Get')} {findNameByAddress(props.info.depositToken)} {
                          props.info.lptype == 'LPToken' ? (' LP') : ''
                        }</a>
                      </div>
                      <div>
                      {typeof(props.info.depositions?.depositAmount) == 'undefined' ?<Skeleton.Button active size={'small'} />:(<>{fromUnit(props.info.depositions?.depositAmount)}</>)}
                        &nbsp;
                        {findNameByAddress(props.info.depositToken)}
                        {
                          props.info.lptype == 'LPToken' ? (' LP') : ''
                        }
                      </div>
                    </div>


                  </div>

            


                </div>
                <div className='flex flex-wrap gap-10 flex-last'>
                  {
                    !props.account ? (<Button className='color supply-btn fwb cf fz-14 fwb  ta' onClick={showLogin}>{t('Connect Wallet')} </Button>):props.flexibleType == 'fixed' ? (
                      <Button className='color supply-btn fwb cf fz-14 fwb  ta' onClick={props.showStake}>{t('Fixed Stake')} </Button>
                    ) : (
                      <Button className='color supply-btn fwb cf fz-14 fwb  ta' onClick={props.showStake}>{t('Stake')} </Button>
                    )
                  }
                  {
                    props.info.depositions?.amount > 0 && props.flexibleType == 'flexible' && <Button className='unstake-btn supply-btn fwb ce fz-14 fwb ta hover' onClick={props.showUnStake}> <span className="cy">{t('UnStake')}</span> </Button>
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div className='mobile-arrow-open'>
        {
          <ArrowOpen className={classNames({
            'rotate180': open
          })} width={22} height={12} onClick={() => { setOpen(o => !o) }}></ArrowOpen>
        }
      </div>
    </div>
  )
}

export default FarmListItem