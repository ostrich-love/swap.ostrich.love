import './Connect.scss'
import {connect as reducxConnect} from 'react-redux'
import { useTranslation } from 'react-i18next';
import { OpenNotification, showLogin } from '../../lib/util';
import { createProviderController } from '../../wallet/createProviderController';
import { addNetwork } from '../../wallet/connectWallet';
import { getNetwork } from '../../contracts';


function Add ({isShow, pathname}) {
    let { t, i18n } = useTranslation()
    const toAdd =  async () => {
      // let provider_name = localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')
      // if(provider_name) {
      //   const provider = await createProviderController().connectTo(provider_name)
      //   addNetwork(provider)
      // } else {
      //   OpenNotification('info', 'Please connect wallet first')
      //   showLogin()
      // }
      console.log(window.ethereum)
      if(window.ethereum) {
        const params = getNetwork().params
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params]}).then(res => {
            OpenNotification('success', 'Add network success or You have already added it')
          }).catch(err => {
            console.log(err)
          })
      }
    }
    return (
      <></>
        // <div className='connect add-network'>
        //     <div onClick={toAdd} className={`fz-14 button add-btn ta pointer c2e hover ${(isShow && pathname!=='/launch') && 'TransparentStyle'}`}>
        //          {t('Add Network')}
        //     </div>
        // </div>
    )
}
export default reducxConnect(
    (state, props) => {
      return {...state, ...props}
    }
  )(
    Add
  );