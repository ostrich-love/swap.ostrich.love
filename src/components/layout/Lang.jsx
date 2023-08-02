/* eslint-disable import/no-anonymous-default-export */
import { Dropdown, Menu } from "antd"
import langIcon from '../../assets/image/common/yuyan.svg'
import yuyanwhite from '../../assets/image/common/yuyanwhite.svg'
import arrow from '../../assets/image/common/down.svg'
import { useState } from "react"
import { useTranslation } from 'react-i18next'
import './Lang.scss'
export const langs = [
  {
    key: 'en',
    label: 'English'
  },
  {
    key: 'ko',
    label: '한국어'
  },
  {
    key: 'br',
    label: 'Brasileiro'
  },
  {
    key: 'tu',
    label: 'Türk dili'
  },
  {
    key: 'zh',
    label: '简体中文'
  }
]
export default ({isShow,pathname}) => {
  let { t, i18n } = useTranslation()
  console.log(i18n.language)
  let language = i18n.language.split('-')[0]
  let [lang, setLang] = useState(language)
  return (
    <Dropdown overlay={<Menu className="my-menu" onClick={(item) => {
      setLang(item.key)
      i18n.changeLanguage(item.key)
    }}>
      {
        langs.map(item => {
          return <Menu.Item className="p-8" key={item.key}>{(item.label)}</Menu.Item>
        })
      }
    </Menu>} >
      <div className={`lang-wrap pointer c2e flex flex-center flex-middle p-l-10 p-r-10 m-l-16 ${!(isShow && pathname!=='/launch') && 'lang-wrap-style'}`}>
        <img src={(isShow && pathname!=='/launch')?yuyanwhite:langIcon} alt="" className={`circle-icon ${(isShow && pathname!=='/launch') && 'colors'}`}/>
        {/* <span className="m-l-5 m-r-15">
          {lang == 'zh' ? '简体中文' : 'English'}
        </span> */}

        <img src={arrow} alt="" className='m-l-3' />
      </div>
    </Dropdown>
  )
}