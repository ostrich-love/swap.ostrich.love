import './Settings.scss'
import exclamatoryMark2 from '../../../assets/image/launchpad/exclamatory-mark-2.svg';
import close from '../../../assets/image/common/close.svg';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import PineconeSwitch from '../../../components/common/PineconeSwitch';
import { Tooltip } from 'antd';

function Settings(props) {
  const { closeFn } = props;
  const [slippage, setSlippage] = useState(props.slip);
  const [aggregated, setAggregated] = useState(props.aggregated);
  let { t, i18n } = useTranslation()

  let handleInput = (e) => {
    console.log(e.target.value)
    if (!/^[0-9]*[.,]?[0-9]*$/.test(e.target.value) || e.target.value.indexOf('+') >=0 || e.target.value.indexOf('-') >=0 ) {
        return
    }
    setSlippage(e.target.value)
  }

  useEffect(()=>{
    props.slipChange(slippage)
    localStorage.setItem('slip', slippage)
  }, [slippage])

  useEffect(()=>{
    props.aggregatedChange(aggregated)
    localStorage.setItem('aggregated', aggregated)
  }, [aggregated])
  return (
    <div className={"mask flex flex-center flex-middle " + (props.show ? 'show':'hide')}>
      <div className="settings-box bgf ">
        <div className='flex flex-between flex-center'>
          <span className='fz-24 fwb c2b lh-28'>{t('Settings')}</span>
          <img className='pointer' src={close} onClick={ev => {
            closeFn(false)
         }} alt="" />
        </div>
        <p className='fz-16 fwb c2b lh-28 m-t-24 m-b-16'>{t('Advanced Settings')}</p>
        <p className='fz-14 c2b lh-28 m-b-4'>{t('Max Slippage')} <img src={exclamatoryMark2} alt="" /></p>
        <div className='flex flex-between flex-center dex-radio-card chart-operation slippage-setting'>
          <div className='ant-radio-group ant-radio-group-solid '>
            <div onClick={() => setSlippage('1')} className={classNames('ant-radio-button-wrapper chart-btn', {
              'ant-radio-button-wrapper-checked': slippage === '1'
            })}>1%</div>
            <div onClick={() => setSlippage('3')} className={classNames('ant-radio-button-wrapper chart-btn', {
              'ant-radio-button-wrapper-checked': slippage === '3'
            })}>3%</div>
            <div onClick={() => setSlippage('5')} className={classNames('ant-radio-button-wrapper chart-btn', {
              'ant-radio-button-wrapper-checked': slippage === '5'
            })}>5%</div>
            <div onClick={() => setSlippage('10')} className={classNames('ant-radio-button-wrapper chart-btn', {
              'ant-radio-button-wrapper-checked': slippage === '10'
            })}>10%</div>
          </div>
          <div className='fz-12 m-r-12'><input type="text" value={slippage} placeholder='custom' className='custom-input' onChange={handleInput}/> %</div>
        </div>
        {/* <div className='flex flex-between flex-center m-t-32'>
          <div>
            <span className='m-r-8 fz-14 lh-28'>Tx deadline (mins)</span>
            <img src={exclamatoryMark2} alt="" />
          </div>
          <div className='tx-deadline-mins-input'>
            <input placeholder='20' type="text" />
          </div>
        </div> */}
      <div className='flex flex-between flex-center m-t-28'>
          <div>
            <span className='m-r-8 fz-14 lh-28'>{t('Aggregated Routes')}</span>
            <Tooltip title={t('Aggregated routing brings better prices, but it will result in an additional portion of network requests')}>
            <img src={exclamatoryMark2} alt="" />
            </Tooltip>
            
          </div>
          <PineconeSwitch defaultChecked={aggregated} onChange={(bool)=>setAggregated(bool?1:0)}></PineconeSwitch>
        </div>
         {/*  <div className='flex flex-between flex-center m-t-32'>
          <div>
            <span className='m-r-8 fz-14 lh-28'>Expert Mode</span>
            <img src={exclamatoryMark2} alt="" />
          </div>
          <PineconeSwitch></PineconeSwitch>
        </div>
        <div className='flex flex-between flex-center m-t-32'>
          <div>
            <span className='m-r-8 fz-14 lh-28'>Disable Multihops</span>
            <img src={exclamatoryMark2} alt="" />
          </div>
          <PineconeSwitch></PineconeSwitch>
        </div>
        <div className='flex flex-between flex-center m-t-32'>
          <div>
            <span className='m-r-8 fz-14 lh-28'>Flippy sounds</span>
            <img src={exclamatoryMark2} alt="" />
          </div>
          <PineconeSwitch></PineconeSwitch>
        </div> */}
      </div>
    </div>
  )
}

export default Settings;