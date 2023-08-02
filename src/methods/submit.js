import { useState, useEffect } from "react"
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import { OpenNotification } from "../lib/util";
import { explorerUrl, getNodeUrl, net_name, net_name_capital } from "../contract";
import { reportSuccess } from "../api/dex";
import store from "../store";


export const useSubmitTransiction = () => {
  let {signAndSubmitTransaction} = useWallet()
  let wallet = useWallet()

    const submitTransiction =  async (
        payload,
        successFn,
        errorFn,
        successTip='Transaction Completed',
        errorTip = 'Transaction Failed'
    ) => {
        // 判断网络对不对
        
        if(wallet?.network && wallet?.network?.name &&  !wallet?.network?.name?.toLowerCase().includes(net_name())) {
            OpenNotification('warning', 'Incorrect network', (`Please connect to the ${net_name_capital()} network first`))
            errorFn && errorFn()
            return
        }
        try {
            const {hash} = await signAndSubmitTransaction(payload);
            setTimeout(async () => {
                const response = await fetch(getNodeUrl()+'/transactions/by_hash/'+hash, {method: 'GET'});
                const result = await response.json()
                if(result.success) {
                  OpenNotification('success', 'Transaction Completed', <a href={`${explorerUrl}${hash}`} target="_blank">View on explorer </a>)
                  reportSuccess({
                    account: store.getState().account,
                    function: payload.function,
                    hash
                  })
                } 
                else {
                OpenNotification('error', 'Transaction Failed', <a href={`${explorerUrl}${hash}`} target="_blank">View on explorer </a>)
                }
                successFn && successFn()
            }, 2000)

        } catch (err) {
            OpenNotification('error', 'Transaction Failed', err.toString())
            errorFn && errorFn()
        }
    }
    return {
        submitTransiction
    }
}

const submitTransictionWithoutNotice = () => { // 无提醒
    
}

