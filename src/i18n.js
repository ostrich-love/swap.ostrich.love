import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import enUsTrans from "./locales/en.json";
import zhCnTrans from "./locales/zh.json";
import koKyTrans from "./locales/ko.json";
import brBrazTrans from "./locales/br.json";
import tuTurkTrans from "./locales/tu.json";
import {
  initReactI18next
} from 'react-i18next';

i18n.use(LanguageDetector) //嗅探当前浏览器语言
.use(initReactI18next) //init i18next
.init({
  //引入资源文件
  resources: {
    en: {
      translation: enUsTrans,
    },
    zh: {
      translation: zhCnTrans,
    },
    ko: {
      translation: koKyTrans,
    },
    br: {
      translation: brBrazTrans,
    },
    tu: {
      translation: tuTurkTrans,
    }
  },
  //选择默认语言，选择内容为上述配置中的key，即en/zh
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n;