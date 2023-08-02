

import { message, notification } from "antd";
import BigNumber from "bignumber.js";
import web3 from 'web3';
import { getAddress } from "../contracts";
import testAddress from '../contract/test.json'
import SuccessIcon from '../assets/image/common/success-icon.svg'
import ErrorIcon from '../assets/image/common/error-icon.svg'
import WarningIcon from '../assets/image/common/warning-icon.svg'
import InfoIcon from '../assets/image/common/info-icon.svg'
import store, { setToLogin } from "../store";

export const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
// export const emailReg = /[\s\S]*/;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const UNIT = 100000000
export const decimal = 4
export const UNIT_DECIMAL = 18

export const showLogin = () => {
  console.log('zhioxing')
  store.dispatch(setToLogin(true))
}
export const hideLogin = () => {
  store.dispatch(setToLogin(false))
}
const howManyZero = (num) => {
   if(num > 1) {
    return 0
   }  else {
    let zeronum = 0
     for(let i=0;i<=18;i++) {
        if(Number(num) >= Number(Math.pow(10, 0-i))) {
          zeronum = i
          break;
        }
     }
     return zeronum-1
   }
}
export const toFixed = (amount, num) => {
  if(Number(amount) < 1) {
    console.log(amount)
    console.log(howManyZero(amount))
      num <= howManyZero(amount) && (num=howManyZero(amount)+num)
  }
  return new BigNumber(
    Math.floor(Number(amount) * Math.pow(10, num)) / Math.pow(10, num)
  ).toString(10);
};
export const toUnit = (amount) => {
  return toBN(web3.utils.toWei(amount.toString(), "ether").toString());
};
export const toWei = (amount) => {
  return web3.utils.toWei(amount, "ether");
};


export const fromUnit = (wei) => {
  let weiwei = Number(wei) || 0
  return (web3.utils.fromWei((numberToStr(weiwei) || 0).toString(), "ether"));
};

export const toBN = (n) => {
  return new BigNumber(n);
};
export const findAddressByName = (name) => {
  let address = ''
  if(!name) {
   return ''
 }
 const ADDRESS = getAddress()
  for(let i in ADDRESS) {
    if(name.toLowerCase() == i.toLowerCase()) {
      address = ADDRESS[i]
    }
  }
  return address
}

export const findNameByAddress = (address) => {
  let name = ''
  if(!address) {
    return ''
  }
  const ADDRESS = getAddress()
  for(let i in ADDRESS) {
    if(address.toLowerCase() == ADDRESS[i].toLowerCase()) {
      name = i
    }
  }
  return name
}
const numberToStr = (num = 0) => {
  let splits = num.toString().toLowerCase().split("e+");
  let result = splits[0];
  if (splits.length === 2) {
    result = result * Math.pow(10, parseInt(splits[1]));
  }
  return result.toLocaleString("fullwide", {
    useGrouping: false,
  });
};

export const formatTime = (timestamp) => {
  if(!timestamp) {
    return '-'
  }
  let date = new Date(Number(timestamp) * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};
export const formatYearDate = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return (
    [year, month, day].map(formatNumber).join("-")
  );
};
export const formatDate = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return (
    [month, day].map(formatNumber).join("-")
  );
};
export const formatHour = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  var hour = date.getHours();
  var minute = date.getMinutes();
  return (
    [hour, minute].map(formatNumber).join(":")
  );
};
export const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
export const addPoint = (address, len=5) => {
  return address ?address.substr(0, len)+'...'+ address.substr(address.length-len,):''
}
export const numFormat = function (num){
  num=num.toString().split(".");  // 分隔小数点
  var arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
  var res=[];
  for(var i=0,len=arr.length;i<len;i++){
    if(i%3===0&&i!==0){
       res.push(",");   // 添加分隔符
    }
    res.push(arr[i]);
  }
  res.reverse(); // 再次倒序成为正确的顺序
  
  if(num[1]){  // 如果有小数的话添加小数部分
    return res.join("").concat("."+num[1]);
  }else{
    return res.join("");
  }
}

/**
 * 计算指定时间后多少天的时间
 * @param {*} timestamp 起始时间
 * @param {*} days 多少天后
 * @returns 
 */
export const formatTimeAddDate = (timestamp, days) => {
  if(!timestamp) {
    return '-'
  }
  let date = new Date(Number(timestamp) * 1000);
  date.setDate(date.getDate() + Number(days))
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

//将16进制转为 字符串
export const hexToString = (str) =>{
      var val="",len = str.length/2;
      for(var i = 0; i < len; i++){
        val += String.fromCharCode(parseInt(str.substr(i*2,2),16));
      }
     return utf8to16(val);
  }

 const  utf8to16= (str)=> {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
     c = str.charCodeAt(i++);
     switch(c >> 4){ 
         case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
         out += str.charAt(i-1);
       break;
         case 12: case 13:
         char2 = str.charCodeAt(i++);
         out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
       break;
         case 14:
         char2 = str.charCodeAt(i++);
         char3 = str.charCodeAt(i++);
         out += String.fromCharCode(((c & 0x0F) << 12) |
        ((char2 & 0x3F) << 6) |
        ((char3 & 0x3F) << 0));
       break;
      }
    }
    return out;
  }

/**
 * 通知提醒框
 * @param {*} type 类型 success | error | info | warning
 * @param {*} message 标题
 * @param {*} description 内容
 */
export const OpenNotification = (type, message, description, duration=3, isdestory=false) => {
  const config = {
    message,
    description,
    duration,
    className: 'orich-notification'
  }

  if (type === 'success') {
    config.icon = (
      <img width={40} height={40} src={SuccessIcon} />
    )
  }

  if (type === 'error') {
    config.icon = (
      <img width={40} height={40} src={ErrorIcon} />
    )
  }

  if (type === 'warning') {
    config.icon = (
      <img width={40} height={40} src={WarningIcon} />
    )
  }

  if (type === 'info') {
    config.icon = (
      <img width={40} height={40} src={InfoIcon} />
    )
  }
  notification[type](config);
}

export const fromatLpName = (type) => {
   if(!type) {
    return ''
   } else {
     let coins = type.split('LPToken<')[1].split('>')[0].split(', ')
     return findNameByAddress(coins[0])+'-'+findNameByAddress(coins[1])
   }
}

export const testInput = (value, max) => {
  return (!/^[0-9]*[.,]?[0-9]*$/.test(value) || value.indexOf('+') >=0 || value.indexOf('e') >=0 || value.indexOf('-') >=0) && (max ? value <=max:true)
}

export const calcDays = (timestamp) => {
   if(!timestamp || Number(timestamp) < (new Date().getTime()/1000)) {
     return 0
   }
   return Math.ceil(
    (Number(timestamp) - (new Date().getTime()/1000))
    /(24*60*60)
  )
}
export const calcHours = (timestamp) => {
  if(!timestamp || timestamp <=0) {
    return 0
  }
  let hours = Math.floor(timestamp/(60*60))
  let min = Math.ceil((timestamp%(60*60))/60)
  return (hours >0?hours+'h':'')+(min+'min')
}
export const formatName = (name) => {
  return name
  if(!name) {
    return ''
  } else {
    let names = name.split(' ')
    names.pop()
    return names.join(' ')
  }
}
export const onCopyToText=(text, t)=>{
  var textField = document.createElement('textarea')
  textField.innerText = text
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
  message.success(t('Copied'))
};

export function consoleLog () {
    console.log(arguments)
}

export function calcVolume (list, showAll) {
    const h24 = 24*60*60
    let fork_list = [...list]
    fork_list.map((item, index) => {
       let volume_24 = 0
       list.map((inner, idx) => {
             if(idx <= index && inner.time*1>= item.time-h24) {
              volume_24 += inner.volume*1
             }
       })
       item.volume_24 = volume_24
       return item
    })
   return fork_list.filter((item, index) => {
    return showAll || index*1 > (fork_list.length/2)
 })
}