
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './index.scss'
import { connect } from 'react-redux'
import { Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Linea from '../../assets/image/wallets/linea.webp'
import Base from '../../assets/image/wallets/BASE.svg'
import ARB from '../../assets/image/token/ARB.jpg'
import updown from '../../assets/image/common/updown.svg'
import updowntwo from '../../assets/image/common/updowntwo.svg'


import qs from 'query-string';

let chainIcon = {
  'zkSync': require('../../assets/image/wallets/zks.jpg'),
  'Linea': Linea,
  'Arbitrum': ARB,
  Base
}
let chainList = [

  {
    name: 'Base',
    chain: 'Base',
    icon: chainIcon['Base']
  },
  {
    name: 'zkSync',
    chain: 'zkSync',
    icon: chainIcon['zkSync'],
    disabled: true
  },
  {
    name: 'Arbitrum',
    chain: 'Arbitrum',
    icon: chainIcon['Arbitrum'],
    disabled: true
  },
  {
    name: 'Linea',
    chain: 'Linea',
    icon: chainIcon['Linea'],
    disabled: true
  }
]
const Chain = ({ isShow,pathname }) => {

  let [chain, setChains] = useState('Base')
  return (

    <div className={`chain-list p-l-8 flex flex-center c2e ${(isShow && pathname!=='/launch') && 'TransparentStyle'}`}>

      <Dropdown placement="bottom" overlay={<Menu className="my-menu">
        {
          chainList.map(item => {
            return <Menu.Item key={item.chain} disabled={item.disabled} >
              <span className='flex flex-center c2e p-6'>
                <img src={item.icon} alt="" className='chain-logo m-r-5' />
                {(item.name)}</span>
            </Menu.Item>
          })
        }
      </Menu>} >
        <div className="drop-dot p-l-8 p-r-15 flex flex-center">
          <img src={chainIcon[chain]} alt="" className='chain-logo' />
          <span className='ce fz-16 m-l-5 m-r-5'>{chain}</span>
          <img src={(isShow && pathname!=='/launch') ? updowntwo : updown} alt='' />
        </div>
      </Dropdown>

    </div>
  )
}
export default connect(
  (state, props) => {
    return { ...state, ...props }
  }
)(
  Chain
);
