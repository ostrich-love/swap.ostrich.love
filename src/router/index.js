/* eslint-disable import/no-anonymous-default-export */


// import Dex from '../pages/Dex/index'
import Farm from '../pages/Farm/index.jsx'
// import Bridge from '../pages/Bridge/index.jsx'
// import Home from '../pages/HomeNew.jsx'
// import Airdrop from '../pages/airdrop/index.tsx';
// import AirdropQuest from '../pages/airdrop/quest/index.tsx';
// import Invite from '../pages/airdrop/invite/index.jsx';
// import Launch from '../pages/Launch/index.jsx';
// import Detail from '../pages/Launch/detail.jsx';
// import Trade from '../pages/Trade/index'

export default [
    {
        path: '/',
        component: <Farm/>
    },
    {
      path: '/farm',
      component: <Farm />
    }
    
]