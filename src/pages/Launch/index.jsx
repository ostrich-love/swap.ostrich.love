import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/image/newlaunch/logo.png'
import cardBg1 from '../../assets/image/newlaunch/banner/cardBg1.png'
import cardBg2 from '../../assets/image/newlaunch/banner/cardBg2.png'
import cardBg3 from '../../assets/image/newlaunch/banner/cardBg3.png'
import cardBg4 from '../../assets/image/newlaunch/banner/cardBg4.png'
import cardBg5 from '../../assets/image/newlaunch/banner/cardBg5.png'
import cardBg6 from '../../assets/image/newlaunch/banner/cardBg6.png'

import { useNavigate } from 'react-router-dom';
import { Input, Checkbox, Select } from 'antd';
import Progress from './idoprogress'
import './index.scss'

const options = [
  {
    value: 'Amount raised1',
    label: 'Amount raised1',
  },
  {
    value: 'Amount raised2',
    label: 'Amount raised2',
  },
  {
    value: 'Amount raised3',
    label: 'Amount raised3',
  },
  {
    value: 'Amount raised4',
    label: 'Amount raised4',
  },
]
const Index = () => {
  const Navigate = useNavigate();
  let { t } = useTranslation()
  const [tabList, setTabList] = useState([
    { selected: true, name: 'Ongoing' },
    { selected: false, name: 'Upcoming' },
    { selected: false, name: 'Completed' },
    { selected: false, name: 'All' }
  ]);

  const onSelectItem = (name) => {
    const newTabList = tabList.map(res => {
      if (res.name === name) {
        res.selected = true;
      } else {
        res.selected = false;
      }
      return res;
    })
    setTabList(newTabList);
  }
  const onSearch = (value) => console.log(value);

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div className='Launch-main'>
      <div className='pools'>
        <div className='title'>{t('Pools')}</div>
        <div className='tip'>{t('We bring new technologies to our community')}</div>
        <div className='buttom'>{t('Supply')}</div>
      </div>
      <div className='head'>
        <div className='tab'>
          {tabList.map(res => {
            return (
              <div className={`item ${res.selected ? 'select' : ''}`} onClick={() => onSelectItem(res.name)}>
                {t(res.name)}
              </div>
            )
          })}
        </div>
        <div className='right'>
          <Input className='search' placeholder={t('Project name/token symbol')} onSearch={onSearch} />
          <Checkbox className='checkbox' onChange={onChange}>{t('Only show me')}</Checkbox>
          <div className='sortby'>
            <div className='name'>{t('Sort by')}</div>
            <Select
              defaultValue={t('Amount raised')}
              className='select'
              onChange={handleChange}
              options={options}
            />
          </div>
        </div>
      </div>
      <div className='content'>
        <div className='card' onClick={() => Navigate('/detail')}>
          <div className='title'>
            <img src={cardBg1} alt="" />
          </div>
          <img className='logo' src={logo} alt="" />
          <div className='card-content'>
            <div className='card-title'>BEANZ Official</div>
            <div className='card-tip'>A 3D Metaverse of Everything</div>
            <div className='min-card'>
              <div className='row'>
                <div className='left'>Presale Amount</div>
                <div className='right'>1,000,000 PPP</div>
              </div>
              <div className='row'>
                <div className='left'>Start Time</div>
                <div className='right'>2022-09-01 12:00:00 UTC</div>
              </div>
              <div className='row'>
                <div className='left'>NO. of Rounds</div>
                <div className='right'>1/10</div>
              </div>
              <div className='row'>
                <div className='left'>{t('IDO Progress')}</div>
                <div className='right'>999,888/1,000,000 (99.99%)</div>
              </div>
              <Progress showImg={false} schedule={90} />
            </div>
          </div>
        </div>
        <div className='card' onClick={() => Navigate('/detail')}>
          <div className='title'>
            <img src={cardBg2} alt="" />
          </div>
          <img className='logo' src={logo} alt="" />
          <div className='card-content'>
            {/* <div className='topping'></div> */}
            <div className='card-title'>BEANZ Official</div>
            <div className='card-tip'>A 3D Metaverse of Everything</div>
            <div className='min-card'>
              <div className='row'>
                <div className='left'>Presale Amount</div>
                <div className='right'>1,000,000 PPP</div>
              </div>
              <div className='row'>
                <div className='left'>Start Time</div>
                <div className='right'>2022-09-01 12:00:00 UTC</div>
              </div>
              <div className='row'>
                <div className='left'>NO. of Rounds</div>
                <div className='right'>1/10</div>
              </div>
              <div className='row'>
                <div className='left'>{t('IDO Progress')}</div>
                <div className='right'>999,888/1,000,000 (99.99%)</div>
              </div>
              <Progress showImg={false} schedule={90} />
            </div>
          </div>
        </div>
        <div className='card' onClick={() => Navigate('/detail')}>
          <div className='title'>
            <img src={cardBg3} alt="" />
          </div>
          <img className='logo' src={logo} alt="" />
          <div className='card-content'>
            {/* <div className='topping'></div> */}
            <div className='card-title'>BEANZ Official</div>
            <div className='card-tip'>A 3D Metaverse of Everything</div>
            <div className='min-card'>
              <div className='row'>
                <div className='left'>Presale Amount</div>
                <div className='right'>1,000,000 PPP</div>
              </div>
              <div className='row'>
                <div className='left'>Start Time</div>
                <div className='right'>2022-09-01 12:00:00 UTC</div>
              </div>
              <div className='row'>
                <div className='left'>NO. of Rounds</div>
                <div className='right'>1/10</div>
              </div>
              <div className='row'>
                <div className='left'>{t('IDO Progress')}</div>
                <div className='right'>999,888/1,000,000 (99.99%)</div>
              </div>
              <Progress showImg={false} schedule={90} />
            </div>
          </div>
        </div>
        <div className='card' onClick={() => Navigate('/detail')}>
          <div className='title'>
            <img src={cardBg4} alt="" />
          </div>
          <img className='logo' src={logo} alt="" />
          <div className='card-content'>
            {/* <div className='topping'></div> */}
            <div className='card-title'>BEANZ Official</div>
            <div className='card-tip'>A 3D Metaverse of Everything</div>
            <div className='min-card'>
              <div className='row'>
                <div className='left'>Presale Amount</div>
                <div className='right'>1,000,000 PPP</div>
              </div>
              <div className='row'>
                <div className='left'>Start Time</div>
                <div className='right'>2022-09-01 12:00:00 UTC</div>
              </div>
              <div className='row'>
                <div className='left'>NO. of Rounds</div>
                <div className='right'>1/10</div>
              </div>
              <div className='row'>
                <div className='left'>{t('IDO Progress')}</div>
                <div className='right'>999,888/1,000,000 (99.99%)</div>
              </div>
              <Progress showImg={false} schedule={90} />
            </div>
          </div>
        </div>
        <div className='card' onClick={() => Navigate('/detail')}>
          <div className='title'>
            <img src={cardBg5} alt="" />
          </div>
          <img className='logo' src={logo} alt="" />
          <div className='card-content'>
            {/* <div className='topping'></div> */}
            <div className='card-title'>BEANZ Official</div>
            <div className='card-tip'>A 3D Metaverse of Everything</div>
            <div className='min-card'>
              <div className='row'>
                <div className='left'>Presale Amount</div>
                <div className='right'>1,000,000 PPP</div>
              </div>
              <div className='row'>
                <div className='left'>Start Time</div>
                <div className='right'>2022-09-01 12:00:00 UTC</div>
              </div>
              <div className='row'>
                <div className='left'>NO. of Rounds</div>
                <div className='right'>1/10</div>
              </div>
              <div className='row'>
                <div className='left'>{t('IDO Progress')}</div>
                <div className='right'>999,888/1,000,000 (99.99%)</div>
              </div>
              <Progress showImg={false} schedule={90} />
            </div>
          </div>
        </div>
        <div className='card' onClick={() => Navigate('/detail')}>
          <div className='title'>
            <img src={cardBg6} alt="" />
          </div>
          <img className='logo' src={logo} alt="" />
          <div className='card-content'>
            {/* <div className='topping'></div> */}
            <div className='card-title'>BEANZ Official</div>
            <div className='card-tip'>A 3D Metaverse of Everything</div>
            <div className='min-card'>
              <div className='row'>
                <div className='left'>Presale Amount</div>
                <div className='right'>1,000,000 PPP</div>
              </div>
              <div className='row'>
                <div className='left'>Start Time</div>
                <div className='right'>2022-09-01 12:00:00 UTC</div>
              </div>
              <div className='row'>
                <div className='left'>NO. of Rounds</div>
                <div className='right'>1/10</div>
              </div>
              <div className='row'>
                <div className='left'>{t('IDO Progress')}</div>
                <div className='right'>999,888/1,000,000 (99.99%)</div>
              </div>
              <Progress showImg={false} schedule={90} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index;