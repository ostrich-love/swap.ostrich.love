import React, { FC, useCallback, useEffect, useState } from 'react';
// import MobileInvite from '../mobile-aridrop/quest/index.tsx';
import { connect as reducxConnect } from 'react-redux'
import { useTranslation } from 'react-i18next';

import './style.scss';
import { OpenNotification, ZERO_ADDRESS, showLogin } from '../../../lib/util';
import { sign } from '../../../contracts/methods';
import { get, get_without_tips, post } from '../../../api';
import { getNetwork } from '../../../contracts';
import { dc_client_id, ostrich_discord_id, ostrich_discord_role_id } from '../../../global';
import { fetchAccessToken, fetchGuildUserData, fetchUserData, fetchUserGuilds } from '../../../api/discord';
import community from '../../../assets/json/community';
import * as hello from 'hellojs'
import { Skeleton, Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';
import MyModal from '../../../components/common/Modal';
import { getDomain } from '../../../contracts/methods/airdrop';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB9VAVhk9DLAYDsa98sV4CZzxhEcxXw8dw",
  authDomain: "ostrich-love.firebaseapp.com",
  projectId: "ostrich-love",
  storageBucket: "ostrich-love.appspot.com",
  messagingSenderId: "983460891556",
  appId: "1:983460891556:web:58bf11f0364d4fb7054f31",
  measurementId: "G-WFX79N19P2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new TwitterAuthProvider();
const auth = getAuth(app);

interface IProps {
    account: String,
    triggerComplete: (complete:Boolean) => void
}

const Task: FC<IProps> = (props) => {

    const { t } = useTranslation();
    const [discordCode, setDiscordCode] = useState(new URLSearchParams(window.location.search).get('code'))
    const [isSign, setIssign] = useState(false)
    const [isDc, setIsDc] = useState(false)
    const [isJoinDc, setIsJoinDc] = useState(false)
    const [isTw, setIsTw] = useState(false)
    const [isFocus, setIsFocus] = useState(false)
    const [isBroad, setIsBroad] = useState(false)
    const [signature, setSignature] = useState('')
    const [discordName, setDiscordName] = useState('')
    const [discordUserId, setDiscordUserId] = useState('')
    const [twitterName, setTwitterName] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [isVerifyLoading, setIsVerifyLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refer, setRefer] = useState(ZERO_ADDRESS)
    const [code, setCode] = useState('')
    const [isWhite, setIsWhite] = useState(false)
    const [showNoRight, setShowNoRight] = useState(false)
    const initData = () => {
        setIsWhite(false)
        setDiscordName('')
        setIsDc(false)
        setTwitterName('')
        setIsTw(false)
        setIsJoinDc(false)
        setIsFocus(false)
        setIsBroad(false)
        setCode('')
    }

    const toSign = useCallback(async () => {
        if (!props.account) {
            showLogin()
        } else {
            let signature_text = await sign('airdrop')
            setSignature(signature_text)
            localStorage.setItem(props.account.toString(), signature_text)
            setIssign(true)
            post('/api/evm/airdrop/bindReferrer', {
                signature: signature_text,
                chain_id: getNetwork().networkId,
                referrer: refer||ZERO_ADDRESS,
                user: props.account
            }).then(res => {
                console.log(res)
            })
        }
    }, [props.account]) 
    const toVerifyJoinDc = async(access_token, name, userid) => {
        setIsVerifyLoading(true)
        try {
            let guilduser = await fetchGuildUserData(access_token, userid)
            console.log(guilduser)
            if(guilduser && guilduser?.roles?.some(item => item == ostrich_discord_role_id)) {
                setIsJoinDc(true)
                post('/api/evm/airdrop/bindDiscord', {
                    signature,
                    chain_id: getNetwork().networkId,
                    discord: name,
                    user: props.account
                }).then(res => {
                    console.log(res)
                })
            }
            setTimeout(()=>{
                setIsVerifyLoading(false)
            }, 6000)
        }  catch {
            setTimeout(()=>{
                setIsVerifyLoading(false)
            }, 6000)
        }
        
    }
    const toDiscord = async () => {
        if(!isWhite) {
            setShowNoRight(true)
            return
        }
        let url = `https://discord.com/api/oauth2/authorize?client_id=${dc_client_id}&redirect_uri=${encodeURIComponent(
            window.location.origin + '/quest'
          )}&response_type=code&scope=identify%20guilds%20guilds.members.read`
        const newOpenWindow = window.open(url, 'Discord Auth', 'width=500,height=800')
        localStorage.setItem('used_dc_accessToken', '')
        localStorage.setItem('used_dc_guilds_accessToken', '')
        localStorage.setItem('used_dc_code', '')
        //@ts-ignore
          let timer = setInterval(async()=>{
             if(newOpenWindow?.closed) {
                try {
                    clearInterval(timer)
                    let discord_code = localStorage.getItem('discordCode')
                    console.log(discord_code)
                    let access_token = await fetchAccessToken(discord_code)
                    let user_info = await fetchUserData(access_token)
                    setAccessToken(access_token)
                    setDiscordName(user_info.username)
                    setDiscordUserId(user_info.id)
                    toVerifyJoinDc(access_token,user_info.username, user_info.id)
                    setIsDc(true)
                } catch {
                    clearInterval(timer)
                }
                
             }
          }, 1000)
    }

    const toTwitter = useCallback(() => {
        //@ts-ignore
        signInWithPopup(auth, provider).then((result) => {
      console.log(result)
      setIsTw(true)
      //@ts-ignore
        setTwitterName(result.user?.reloadUserInfo?.screenName)
        // setTLoading(true)
        post('/api/evm/airdrop/bindTwitter', {
            signature,
            chain_id: getNetwork().networkId,
      //@ts-ignore
            twitter: result.user?.reloadUserInfo?.screenName,
            user: props.account
        }).then(res => {
            console.log(res)
        }).catch(err => {
            OpenNotification('error', 'Bind Failed', err.msg)
        })
    })
        
    }, [signature, props.account]) 
    const toFocus = () => {
        window.open('https://twitter.com/intent/follow?screen_name=ostrich_world')
        setTimeout(_=>setIsFocus(true), 5000)
    }
    const toBroad = () => {
        let url_text = encodeURIComponent('https://beta.ostrich.love/quest?code='+code)
        let text = "Take the first step of the journey with @Ostrich_World and invite more friends to join us in this adventure for the oasis and freedom!"
        window.open('https://twitter.com/intent/tweet?text='+text+'&url='+url_text)
        setTimeout(_=>setIsBroad(true), 5000)
    }

    useEffect(() => {
        initData()
        if(props.account && signature) {
            setLoading(true)
            get_without_tips('/api/evm/airdrop/user', {
                address: props.account,
                chain_id: getNetwork().networkId
            }).then(res => {
                console.log(res)
                setLoading(false)
                if(res.code !=1) {
                    setIsWhite(false)
                    setShowNoRight(true)
                } else {
                    setIsWhite(true)
                    setDiscordName(res.data.discord)
                    setIsDc(!!res.data.discord)
                    setTwitterName(res.data.twitter)
                    setIsTw(!!res.data.twitter)
                    setIsJoinDc(!!res.data.discord)
                    setIsFocus(!!res.data.twitter)
                    setIsBroad(!!res.data.twitter)
                    setCode(res.data.code)
                }
                
            }).catch(err => {
                setLoading(false)
            })
        }
    }, [props.account, signature])

    useEffect(() => {
        if(props.account) {
            setSignature(localStorage.getItem(props.account.toString())||'')
            setIssign(!!(localStorage.getItem(props.account.toString())||''))
        }
    }, [props.account])

    useEffect(() => {
        props.triggerComplete(isBroad)
    }, [isBroad])

    useEffect(()=>{
        //判断code是什么code 
        // 因为discord授权重定位的url也是带code参数的，这与用户分享的邀请链接里面的code有重复
        // 所以要用正则区分一下到底是什么code
        (async()=>{
            if(discordCode) {
            if(discordCode.length <=8 || discordCode.includes('.arb') || discordCode.includes('.bnb')) // 这里是邀请码的规则
            {
                // 根据邀请码获取address
                localStorage.setItem('referCode', discordCode)
                if(discordCode.includes('.arb') || discordCode.includes('.bnb')) {
                   let add = await getDomain(discordCode)
                   setRefer(add||ZERO_ADDRESS)
                } else {
                    get_without_tips('/api/evm/airdrop/user', {
                        code: discordCode,
                        chain_id: getNetwork().networkId
                    }).then(res => {
                        console.log(res)
                        setRefer(res.data.address||ZERO_ADDRESS)
                    }).catch(err => {
                        setRefer(ZERO_ADDRESS)
                    })
                }
                
            } else { // 这里是discord授权码的逻辑
                localStorage.setItem('discordCode', discordCode)
                window.close()
            }
            
        }})()
        
    }, [discordCode])
    return (
        <>
            {/* connect wallet */}
            <div className='item'>
                <div className={`order ${isSign ? 'success' : 'serialNumber'}`}>{!isSign && 1}</div>
                {/* <div className='lineGroup'>
                    {Array.from({ length: 6 }, () => {
                        return <div className='line' style={{ border: `2px solid ${isSign ? '#00C48C' : '#ffffff1a'}` }} />
                    })}
                </div> */}
                <div className={`flex flex-column task-content  ${isSign ?'completed':''}`}>
                    <div className='flex flex-center flex-wrap gap-10'>
                    <div className='values flex flex-column'>
                        {t('Get your wallet ready')}
                        <div className="fz-14 c6 m-t-5">{t('As the journey begins, you may need the help of companions.')}</div>
                    </div>
                    {(!isSign) &&<div className='bottom' onClick={toSign}>{props.account ? t('Sign') : t('Connect Wallet')}</div>}
                    </div>
                </div>
                
            </div>
            {/* connect discord */}
            <div className='item'>
                <div className={`order ${isDc ? 'success' : 'serialNumber'}`}>{!isDc && 2}</div>
                <div className={`flex flex-column task-content  ${isDc ?'completed':''}`}>
                    <div className='flex flex-center flex-wrap gap-10'>
                        <div className='values  flex flex-column'>
                            {t('Connect your Discord')}
                            <div className="fz-14 c6 m-t-5">{t('Here, you can seek for refuge and assistance.')}</div>
                       </div>
                        {
                            loading && <Skeleton.Button active size={'small'}/>
                        }
                        {!isDc && isSign && !loading && <div className='bottom' onClick={toDiscord}>{t('Connect Discord')}</div>}
                        {isDc && isSign && <div className='bottom'>{discordName}</div>}
                </div>
                    
                </div>
            </div>
            {/* connect discord */}
            <div className='item'>
                <div className={`order ${isJoinDc ? 'success' : 'serialNumber'}`}>{!isJoinDc && 3}</div>
                <div className={`flex flex-column task-content  ${isJoinDc ?'completed':''}`}>
                    <div className='flex flex-center flex-wrap gap-10'>
                <div className='values  flex flex-column'>
                    {t('Join our discord, and acquire the role: Ostrich Guardians.')}
                <div className="fz-14 c6 m-t-5">{t('After the prayer, you will be bestowed with guidance.')}</div>
                </div>
                { !isJoinDc && isSign && isDc &&<>
                <a className='bottom' target="_blank" href={community.find(item => item.name == 'discord')?.link}>{t('Join Group')}</a>
                <div className='bottom' onClick={_=>toVerifyJoinDc(accessToken, discordName, discordUserId)}>Verify {isVerifyLoading && <Spin indicator={<LoadingOutlined style={{color: '#fff'}}/>} size='small'/>}
                </div>
                </>}
                </div>
                    
                </div>
            </div>

            {/* connect tw */}
            <div className='item'>
                <div className={`order ${isTw ? 'success' : 'serialNumber'}`}>{!isTw && 4}</div>
                <div className={`flex flex-column task-content  ${isTw ?'completed':''}`}>
                    <div className='flex flex-center flex-wrap gap-10'>
                <div className='values flex flex-column'>{t('Connect your Twitter')}
                <div className="fz-14 c6 m-t-5">{t("Don't forget to prepare your weapons, there will be dangers ahead.")}</div>
                </div>

                {!isTw && isSign && isDc && isJoinDc && <div className='bottom' onClick={toTwitter}>{t('Connect Twitter')}</div>}
                {isTw && isSign && isDc && isJoinDc && <div className='bottom' >{twitterName}</div>}
                </div>
                    
                </div>
            </div>


            {/* Follow Ostrich */}
            <div className='item'>
                <div className={`order ${isFocus ? 'success' : 'serialNumber'}`}>{!isFocus && 5}</div>
                <div className={`flex flex-column task-content  ${isFocus ?'completed':''}`}>
                    <div className='flex flex-center flex-wrap gap-10'>
                <div className='values flex flex-column'>{t('Follow Ostrich')}
                <div className="fz-14 c6 m-t-5">{t("Follow the Ostrich Chief's lead.")}</div>
                </div>
                {!isFocus && isTw && isSign && isDc && isJoinDc && <div className='bottom' onClick={toFocus}>{t('Focus Ostrich')}</div>}
                </div>
                    
                </div>
            </div>

            {/* Broadcast your journey to your mate */}
            <div className='item'>
                <div className={`order ${isBroad ? 'success' : 'serialNumber'}`}>{!isBroad && 6}</div>
                <div className={`flex flex-column task-content last ${isBroad ?'completed':''}`}>
                    <div className='flex flex-center flex-wrap gap-10'>
                <div className='values  flex flex-column'>{t('Broadcast your journey to your mate')}
                <div className="fz-14 c6 m-t-5">{t("As the journey begins, you may need the help of companions.")}</div></div>
                {!isBroad && isFocus && isTw && isSign && isDc && isJoinDc && <div className='bottom' onClick={toBroad}>{t('Tweet')}</div>}
                </div>
                    
                </div>
            </div>
            <MyModal
        isVisible={showNoRight}
        width={300}
        title={t('Sorry')}
        className='Launch-modal airdrop-modal'
        onClose={() => setShowNoRight(false)}
      >
        <div className='content fwb fz-18'>{t('Sorry, you are not eligible for this AirDrop')}</div>
        <div className='buttom' onClick={() => setShowNoRight(false)}>{t('Got it')}</div>
      </MyModal>
        </>
    )
}
export default reducxConnect(
    (state, props) => {
        return { ...state, ...props }
    }
)(
    Task
);
