/* eslint-disable import/no-anonymous-default-export */

import twitter from '../image/airdropnew/socialize1.svg'
import medium from '../image/airdropnew/socialize3.svg'
import github from '../image/airdropnew/Clipped.svg'
export default [
    {
        img: require('../image/share/g.svg').default,
        imgw: github,
        imgColor:require('../image/share/gtwo.svg').default,
        link: 'https://github.com/ostrich-love/ostrich-evm-contracts',
        name: 'github'
    },
    {
        imgw: twitter,
        img: require('../image/share/twitter.svg').default,
        imgColor:require('../image/share/twittertwo.svg').default,
        link: 'https://twitter.com/ostrich_world',
        name: 'twitter'
    },
    {
        imgw:require('../image/share/discordw.svg').default,
        img: require('../image/share/discord.svg').default,
        imgColor:require('../image/share/discordtwo.svg').default,
        link: 'https://discord.gg/ktpx7bEVNf',
        name: 'discord'
    },
    {
        img: require('../image/share/medium.svg').default,
        imgColor:require('../image/share/mediumtwo.svg').default,
        imgw: medium,
        link: 'https://medium.com/@ostrichlove',
        name: 'medium'
    }
]