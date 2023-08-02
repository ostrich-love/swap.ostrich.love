import { useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/common/Modal'
import boost from '../../../assets/image/farm/rocket.svg'
import { useTranslation } from 'react-i18next';
import './Boost.scss'
import { depositAccelerateNFT, isApprovedForAll, queryAccelerateConfig, queryMyNFT, queryTokenURI, queryUserAccelerateNFT, setApprovalForAll, withdrawAccelerateNFT } from '../../../contracts/methods/farm';
import { Button } from 'antd';
import { findAddressByName } from '../../../lib/util';
import { set } from 'date-fns';
const NFTD = ({id}) => {
    const [metadata, setMetaData] = useState({})
    console.log(id)
    useEffect(async ()=>{
        if(!id) {
            return
        }
        let uri = await queryTokenURI(id)
        let meta = await (await fetch(uri)).json()
        setMetaData(meta)
    }, [id])
    return <div className={'nft-item-deposit flex flex-center flex-column m-b-5 '}>
            <div className="img-wrap p-4">
                <img src={metadata.image} alt="" />
            </div>
        <span className="fz-14 c2b m-t-5">{metadata.name}</span>
    </div>
}

const NFT = ({id, toSelect, selectId}) => {
    const [metadata, setMetaData] = useState({})
    console.log(id)
    useEffect(async ()=>{
        if(!id) {
            return
        }
        let uri = await queryTokenURI(id)
        let meta = await (await fetch(uri)).json()
        console.log('??????????????????????')
        console.log(meta)
        setMetaData(meta)
    }, [id])
    return <div className={'nft-item pointer flex flex-center flex-column m-b-5 '+(selectId==id?'selected':'')} onClick={()=>toSelect(id)}>
            <div className="img-wrap p-4">
                <img src={metadata.image} alt="" />
            </div>
        <span className="fz-12 c2b m-t-5">{metadata.name}</span>
    </div>
}
export default (props) => {
  let { t, i18n } = useTranslation()
  const [showStake, setShowStake] = useState(false)
  const [showUnStake, setShowUnStake] = useState(false)
  const [nftlist, setNft] = useState([])
  const [selectId, setSelectId] = useState('')
  const [accInfo, setAcc] = useState({})
  const [loading, setLoading] = useState(false)
  const [isApprove, setIsApprove] = useState(false)
  const [configs, setConfigs] = useState({})
  const toApprove =  useCallback(() => {
    setLoading(true)
    setApprovalForAll(findAddressByName('OstrichNFT'), findAddressByName(props.info.name)).then(res => {
        setLoading(false)
        setIsApprove(true)
    }).finally(res=>{
        setLoading(false)
    })
  },[props.info])
  const toDeposit = useCallback(() => {
    if(!selectId) {
        return
    }
    setLoading(true)
    depositAccelerateNFT(props.info.type, selectId, props.info.name).then(res => {
        setLoading(false)
        setShowStake(false)
    })
  } ,[props.info, selectId])
  useEffect(async () => {
    if(props.account) {
        let nfts = await queryMyNFT(props.account)
        console.log(nfts)
        setNft(nfts)
    }
  }, [props.account])

  const toWithdraw =  useCallback(() => {
    setLoading(true)
    withdrawAccelerateNFT(props.info.type, accInfo.tokenId, props.info.name).then(res => {
        setLoading(false)
        setShowUnStake(false)
    })
  } ,[props.info, accInfo])
  useEffect(async () => {
    if(props.account) {
        let nfts = await queryMyNFT(props.account)
        console.log(nfts)
        setNft(nfts)
    }
  }, [props.account])


  useEffect(async () => {
    if(!props.info.type) {
        return
    }
    let configs = await queryAccelerateConfig(props.info.type, props.info.name)
    console.log(configs)
    setConfigs(configs)
  }, [props.info])


  useEffect(async () => {
    if(props.account && props.info) {

        // let acc_config = await queryAccelerateConfig(props.info.type)
        let user_acc = await queryUserAccelerateNFT(props.info.type, props.account, props.info.name)
        setAcc(user_acc)
        console.log(user_acc)

        let approved = await isApprovedForAll(findAddressByName('OstrichNFT'), findAddressByName(props.info.name), props.account)
        setIsApprove(approved)
    }
  }, [props.account, props.info])
    return (
        <>
        <div className='fz-13 cy boost m-l-10 pointer' onClick={_=>accInfo.tokenId*1?setShowUnStake(true):setShowStake(true)}>
            <img src={boost} alt="" />
            {t(accInfo.tokenId*1?'Boosted':'Boost')}
        </div>
        <span className="cy fz-12 m-l-5">{accInfo.tokenId*1 ? `APY+${configs?.accelerateRate}%`:''}</span>
        <Modal width={486} isVisible={showStake} title={t("Select a NFT to Boost")} onClose={() => setShowStake(false)}>
            <div className="flex flex-wrap gap-1 nft-wrap">
            {
                nftlist.map(item => {
                    return <NFT key={item} id={item} toSelect={(id)=>{setSelectId(id)}} selectId={selectId}/>
                })
            }
            {
                nftlist.length == 0 && <div className="ta w100 c05">{t('You have no SpeedNFT')}</div>
            }
            </div>
            {nftlist.length ? <Button loading={loading} onClick={isApprove?toDeposit:toApprove} disabled={!selectId} className="color cf w100 bdr-24 boost-btn confirm-btn m-t-25 fz-16 fwb">
                {t(isApprove?'Confirm':'Approve NFT')}
            </Button>:''}
            
        </Modal>
        <Modal isVisible={showUnStake} title={t("You've already Boosted")} onClose={() => setShowUnStake(false)}>
            <div className="flex flex-wrap flex-center flex-column flex-middle">
              <NFTD  id={accInfo.tokenId}/>
              <div className="fz-13 fwb c2b">APR+{configs?.accelerateRate}%</div>
            </div>
            <Button loading={loading} onClick={toWithdraw} className="color cf w100 bdr-24 boost-btn confirm-btn m-t-25 fz-16 fwb">
                {t('Withdraw')}
            </Button>
            <div className="c05 fz-12 ta m-t-10">
            {t('If withdraw your NFT, your additional APR will be lost')}
            </div>
            
        </Modal>
        </>
    )
}