import classNames from 'classnames';
import { useState } from 'react';
import exclamatoryMark2 from '../../../assets/image/launchpad/exclamatory-mark-2.svg';
import close from '../../../assets/image/common/close.svg';
import coin1 from '../../../assets/image/launchpad/coin-1.png'
import xingNo from '../../../assets/image/launchpad/xing-no.svg'
import magnifier from '../../../assets/image/launchpad/magnifier.svg'
import './SelectToken.scss';
import Item from 'antd/lib/list/Item';
import { useEffect } from 'react';
import { Button, Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {toRegister} from '../../../methods/client.ts'
import { getBalance } from '../../../contracts/methods';
import {connect as reducxConnect} from 'react-redux'
import { findAddressByName, fromUnit, OpenNotification } from '../../../lib/util';
import list, { getTokenByName, getSwapTokenList } from './list'
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { explorerUrl } from '../../../contract';
import { reqTokensConstant } from '../../../api/dex';
import { getNetwork } from '../../../contracts';

import { useTranslation } from 'react-i18next';
function SelectToken(props) {
  const { closeFn } = props;
  let {signAndSubmitTransaction} = useWallet()
  const [checkValue, setCheckValue] = useState('USDC');
  const [tokenList, setTokenList] = useState([])
  const [filter, setFilter] = useState('')
  let { t, i18n } = useTranslation()
  const [tokenConst, setTokenConst] = useState([])
  const toSelectToken = (name) => {
    setCheckValue(name)
    props.selectToken(name)
    closeFn()
  }
  useEffect(() => {
    let showlist = [...getSwapTokenList().filter(item => !item.hide)]
     if(props.account) {
      showlist.map(item => {
        item.loading = true
        return item
       })
       setTokenList(showlist)
       let p = []
       showlist.map(item => {
        p.push(getBalance(props.account, findAddressByName(item.title)))
       })
       Promise.all(p).then(res => {
        console.log(res)
        showlist.map((item, index) => {
          item.balance = res[index] == null ? null:fromUnit(res[index])
          item.loading = false
          console.log(item)
          return item
        })
        setTokenList([...showlist].sort((a, b)=>{return b.balance - a.balance}))
       })
     } else {
      showlist.map(item => {
        item.balance = 0
        item.loading = false
        return item
      })
      setTokenList(showlist)
     }
  }, [props.account])

  useEffect(async ()=>{
    let tokens_const = (await reqTokensConstant({
      chain_id: getNetwork().networkId
    })).data.data
    console.log(tokens_const)
    setTokenConst(tokens_const||[])
  }, [])
  return (
      <Modal open={props.show} footer={null} closable={false} className='select-token-box bgf'>
      <div>
        <div className='p-l-20 p-r-20 p-t-20'>
          <div className='flex flex-between flex-center '>
            <div className='flex'>
              <span className='fz-24 fwb c2b lh-28 m-r-8'>{t('Select a token')}</span>
              {/* <img src={exclamatoryMark2} alt="" /> */}
            </div>
            <img className='pointer' src={close} onClick={ev => {
              closeFn(false)
          }} alt="" />
          </div>
          <p className='fz-14 lh-24 m-t-6 m-b-16 c2b'>{t('You can search and select any token on OstrichSwap')}</p>
          <div className='search-token flex flex-between flex-center'>
            <input type="text" className='flex-1' placeholder={t('Token name, token symbol or address')} onChange={e => setFilter(e.target.value)} />
            <img src={magnifier} alt="" />
          </div>
          <div className='flex flex-wrap gap-8 m-t-16'>
            {
              tokenConst.map(item => {
                  return findAddressByName(item.name) && getSwapTokenList().some(inner => findAddressByName(inner.title) == item.address) && <div 
                   className={classNames('history-token-btn flex flex-center pointer', {
                    'disabled': props.type == 'input' && item.name == props.output || props.type == 'output' && item.name == props.input
                   })}
                   key={item.name} 
                  onClick={() => {
                    if(props.type == 'input' && item.name == props.output || props.type == 'output' && item.name == props.input) {
                      return
                    }
                    toSelectToken(item.name)
                  }}>
                  <img className='m-r-8 token-icon-const' src={getTokenByName(item.name).icon} alt="" />
                  <span className='fz-14 fwb lh-20'>{item.name}</span>
                </div>
              })
            }
            
          </div>
          {/* <div className='m-t-24'>
            <span className='fz-16 c2b fwb lh-26 m-r-11'>All</span>
            <span className='fz-16 lh-26'>Imported</span>
          </div> */}
        </div>
        <div className='m-t-24 p-b-20'>
          {
            tokenList.map((el, i) => (
              <div key={i} className={classNames('select-token-item flex flex-between flex-center', {
                'check': checkValue === el.title,
                'hide': filter && !el.title.toLowerCase().includes(filter.toLowerCase()) && findAddressByName(el.title).toLowerCase() != filter.toLowerCase(),
                'disabled': props.type == 'input' && el.title == props.output || props.type == 'output' && el.title == props.input
              })}
              onClick={() => {
                if(props.type == 'input' && el.title == props.output || props.type == 'output' && el.title == props.input) {
                  return
                }
                toSelectToken(el.title)
              }}>
                <div className='flex flex-center'>
                  <img className='m-r-8 token-icon' src={el.icon} alt="" />
                  <div className='flex flex-column'>
                    <span className='c2b fz-16 fwb lh-20'>{el.title}</span>
                    <span className='c2b fz-16 lh-20'>{el.desc}</span>
                  </div>
                </div>
                <div>
                  {
                    el.loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#ccc'}} spin />}/>:<span className='c2b fz-16 lh-20 fwb'>{el.balance||'0'}</span>
                  }
                  {
                    
                  }
                  
                  {/* <img className='m-l-24' src={xingNo} alt="" /> */}
                </div>
              </div>
            ))
          }
        </div>
        {/* <div className='manage-tokens m-t-23'>Manage Tokens</div> */}
      </div>
      </Modal>
  )
}

export default reducxConnect(
  (state, props) => {
    return {...state, ...props}
  }
)(
  SelectToken
);