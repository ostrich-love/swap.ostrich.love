import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Foot from '../foot';
import back from '../../../assets/image/airdropnew/invite/back.svg';
import ostrichtwo from '../../../assets/image/airdropnew/mobile/ostrichtwo.svg';
import userone from '../../../assets/image/airdropnew/userone.png';
import usertwo from '../../../assets/image/airdropnew/usertwo.png';
import useMedia from '../../../hooks/useMedia';
// import MobileInvite from '../mobile-aridrop/quest/index.tsx';
import { useTranslation } from 'react-i18next';
import './style.scss';
import { connect as reducxConnect } from 'react-redux'
import Task from './task.tsx';
import { Button } from 'antd';
import { claim, queryClaimCount, queryUserTokenId } from '../../../contracts/methods/airdrop';
import { get } from '../../../api';
import { getNetwork } from '../../../contracts';
import { findAddressByName } from '../../../lib/util';
import Activenumber from '../../../components/common/Activenumber';
import { token } from '@project-serum/common';
import useInterval from '@use-it/interval';

interface IProps {
  account: String
}

const foods_img_list = ["barbadosaloe.png","bird.png","carambola.png","dragonfly.png","lizard.png","mushroom.png","scorpion.png","snake.png",
"bee.png","blueberries.png","cherry.png","fig.png","mantis.png","nut.png","seabuckthorn.png","strawberry.png","beetle.png","cactus.png","cicada.png","grasshopper.png","mintleaf.png","rat.png","snail.png","watermelon.png"]

const Quest: FC<IProps> = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isComplete, setIsComplete] = useState<Boolean>(false)
  const [loading, setLoading] = useState(false)
  const isSmallScreen = useMedia('(max-width:1200px)', true);
  const [count, setCount] = useState(0)
  const [tokenId, setTokenId] = useState(0)
  const [foodIndex, setFoodIndex] = useState(0)
  const [annimation, setAnimation] = useState('')
  const toClaim = () => {
    setLoading(true)
    get('/api/evm/airdrop/claimParams', {
      address: props.account,
      chain_id: getNetwork().networkId,
      contract: findAddressByName('NFTAirdrop')
    }).then(res => {
      console.log(res)
      claim(res.data.signature).then(res => {
        setLoading(false)
        setTokenId(2)
      }).finally(() => {
        setLoading(false)
      })
    })

    // claim()
  }
  useEffect(()=>{
    (async () => {
      let amount = await queryClaimCount()
      setCount(amount)
    })()

  }, [])


  useEffect(()=>{
    (async () => {
      if(props.account) {
        let token_id = await queryUserTokenId(props.account)
        console.log(token_id)
        setTokenId(token_id)
      }
    })()
  }, [props.account])

  useInterval(()=>{
    setAnimation('animation')
    setFoodIndex(foodIndex >= foods_img_list.length-1 ? 0:(foodIndex+1))
    setTimeout(()=>{
      setAnimation('')
    }, 2000)
  }, 6000)

  return (
    <>{isSmallScreen ? (<div className='mobile-quest-mian'>
    <div className='mobile-quest-layout'>
      <div className='mobile-mountain'>
        <div className='title'>
          <img src={back} alt="back" onClick={() => navigate('/airdrop')} />
          <div>{t('Ostrich Evolution')}</div>
        </div>
        <img src={require(`../../../assets/image/airdropnew/foods/${foods_img_list[foodIndex]}`)} alt="" className={'food-img '+ annimation}/>
        <Button disabled={!isComplete} loading={loading} className={'buttom '+((!isComplete || !!(tokenId*1))?'disabled':'')} onClick={toClaim}>{t(tokenId*1?'Claimed':'Claim')}</Button>
        <div className='mobile-timeline'>
          <Task triggerComplete={(complete:Boolean)=>{
            setIsComplete(complete)
          }}/>
          <div className='summary'>{t('All Participants')} 
          {/* @ts-ignore */}
          (<Activenumber value={count+''}/>)
          </div>
          <div className='userList'>
          {
                  (()=>{
                    let imgs:any[] = []
                    for(let i=1;i<=(count>20?20:count);i++) {
                      imgs.push(<img src={require('../../../assets/image/airdropnew/avatar/'+i+'.png')} alt="" width={36} style={{left:`${(i-1)*18}px`}} />)
                    }
                    return imgs
                  })()
                }
          </div>
        </div>
        <Foot />
      </div>
    </div>
  </div>) : (
      <div className='quest-mian'>
        <div className='quest-layout'>
          <div className='mountain'>
            <div className='quest flex flex-center flex-column'>
              <div className='title'>
                <img src={back} alt="back" onClick={() => navigate('/airdrop')} />
                <div>{t('Ostrich Evolution')}</div>
              </div>
              <img src={require(`../../../assets/image/airdropnew/foods/${foods_img_list[foodIndex]}`)} alt="" className={'food-img '+ annimation}/>
              <div className='bear'>
                <Button disabled={!isComplete || !!(tokenId*1)}  loading={loading} className={'buttom '+((!isComplete || !!(tokenId*1))?'disabled':'')} onClick={toClaim}>{t(tokenId*1?'Claimed':'Claim')}</Button>
              </div>
            </div>
            <div className='timeline'>
            <Task triggerComplete={(complete:Boolean)=>{
            setIsComplete(complete)
          }}/>
            {/* @ts-ignore */}
              <div className='summary'>{t('All Participants')} (<Activenumber value={count+''}/>)</div>
              <div className='userList'>
                {
                  (()=>{
                    let imgs:any[] = []
                    for(let i=1;i<=(count>20?20:count);i++) {
                      imgs.push(<img src={require('../../../assets/image/airdropnew/avatar/'+i+'.png')} alt="" width={41} style={{left:`${(i-1)*20}px`}} />)
                    }
                    return imgs
                  })()
                }
              </div>
            </div>
          </div>
          <Foot />
        </div>
      </div>
    )}
      
    </>
  )
};

export default reducxConnect(
  (state, props) => {
      return { ...state, ...props }
  }
)(
  Quest
);

