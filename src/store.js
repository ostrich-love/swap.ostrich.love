import { createAction, createReducer, configureStore } from '@reduxjs/toolkit'
export const connect = createAction('connect')
export const disconnect = createAction('disconnect')
export const setconnect = createAction('setconnect')
export const setToLogin = createAction('setToLogin')
export const setToConnectWallet = createAction('setToConnectWallet')
export const setConnectWalletChain = createAction('setConnectWalletChain')
export const setUserStore = createAction('setUserStore')

const reducer = createReducer(
  {
    connect: false,
    chain: 'zks',
    chainType: 'zks',
    account: '',//0x6669eb490c9c9aad8c41d7b1e719361f1edb3ccef1f6ff1725f74721f9042bd9
    willconnect: false,
    showLogin: false,
    showConnectWallet: false,
    connectWalletChain: 'zks',
    userStore: {}
  },
  builder => builder
    .addCase(connect, (state, action) => {
      return {
        ...state,
        connect: true,
        account: action.payload
      }
    })
    .addCase(disconnect, (state, action) => {
      localStorage.setItem('token', null)
      return {
        ...state,
        connect: false,
        token: null,
        account: ''
      }
    })
    .addCase(setconnect, (state, action) => {
      return {
        ...state,
        willconnect: !!(action.payload)
      }
    })
    .addCase(setToLogin, (state, action) => {
      console.log(action)
      return {
        ...state,
        showLogin: action.payload
      }
    })
    .addCase(setToConnectWallet, (state, action) => {
      return {
        ...state,
        showConnectWallet: action.payload
      }
    })
    .addCase(setConnectWalletChain, (state, action) => {
      return {
        ...state,
        connectWalletChain: action.payload
      }
    })
    .addCase(setUserStore, (state, action) => {
      return {
        ...state,
        userStore: action.payload
      }
    })
)

export default configureStore({
  reducer
})