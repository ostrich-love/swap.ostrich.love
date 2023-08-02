import { toFixed } from "accounting";
import { formatHour, formatDate, formatTime, numFormat } from "../../../lib/util";
export const showLine = function (
  xaxis,
  yaxis,
  echarts,
  type,
  isGreen,
  ConstList
) {
  console.log(yaxis)
  console.log(yaxis[yaxis.length -1]*1, yaxis[0]*1)
  console.log(yaxis[yaxis.length -1]*1 >= yaxis[0]*1)
  console.log(isGreen)
  let min = ([...yaxis].sort(function(a, b) {return a*1-b*1})[0]- ([...yaxis].sort(function(b, a) {return a*1-b*1})[0] - [...yaxis].sort(function(a, b) {return a*1-b*1})[0])/3)
  return {
    textStyle: {
      fontFamily:
        "Gilroy-Regular, -apple-system,BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.8)",
      axisPointer: {
        type: "cross",
        label: {
          show: false,
        },
        lineStyle: {
          color: [isGreen == 'green' ? "#f68731" :isGreen == 'blue'? "#00ffff":  '#999'],
        },
        crossStyle: {
          color: [isGreen == 'green' ? "#f68731" :isGreen == 'blue'? "#00ffff": '#999'],
        },
      },
      extraCssText: "z-index: 2",
      formatter: function (params) {
        console.log(params)
        let time = `<span>${formatTime(params[0].axisValue/1000)}</span>`;
        let price = `<div style="font-size: 14px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background:${
                  (isGreen == 'green' ? "#f68731" :isGreen == 'blue'? "#00ffff": '#999')
                }"></span> 
                Price: <span style="color: #000;font-size: 12px;">${
                  params[0].data
                }</span>
              </div>`;
        let volume = `<div style="font-size: 14px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background:${
              (isGreen == 'green' ? "#f68731" :isGreen == 'blue'? "#00ffff": '#999')
            }"></span> 
            Vol 24h: <span style="color: #000;font-size: 12px;">${
              numFormat(toFixed(ConstList[params[0].dataIndex].volume_24, 4)) 
            }</span>
          </div>`;
        let tipbox = `<div style="font-size: 12px;">${time}${price}${volume}</div>`;
        return tipbox;
      },
      // position: function (
      //   pos,
      //   size
      // ) {
      //   const obj = {};
      //   if (pos[0] < size.viewSize[0] / 2) {
      //     obj.left = pos[0];
      //   } else {
      //     obj.right = size.viewSize[0] - pos[0];
      //   }
      //   if (pos[1] < size.viewSize[1] / 2) {
      //     obj.top = pos[1];
      //   } else {
      //     obj.bottom = size.viewSize[1] - pos[1];
      //   }
      //   return obj;
      // },
    },
    grid: {
      top: 30,
      bottom: 0,
      left: 0,
      right: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xaxis,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#80706a",
          fontWeight: "normal",
        },
      },
      axisLabel: {
        formatter: function(value){
          return  type*1 === 1 ?  formatHour(value/1000):formatDate(value/1000)
        },
        padding: [0, 0, 0, 30],
      },
      splitLine: {
        show: false,
        onZero: false,
        lineStyle: {
          color: "#80706a",
          width: 1,
        },
      },
    },
    yAxis: [
      {
        show: true,
        type: "value",
        position: "right",
        // name: 'price',
        min: min,
        scale: true,
        axisLine: {
          show: false,
          lineStyle: {
            color: "#80706a",
          },
        },
        axisLabel: {
          formatter: function(value){
            return  value < 0 ?'':value.toFixed(4)
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#111111",
            width: 1,
          },
        }
      },
      {
        type: "value",
        show: false,
        max: ConstList.map(item => item.volume_24*1).sort(function(b, a) {return a*1-b*1})[0] * 8 || 100,
        min: 0,
        axisLine:{
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        offset: 100,
        // scale: true,
        position: "right",
        // name: 'volume'
      }
    ],

    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        data: yaxis,
        type: "line",
        symbol: "none",
        name: 'price',
        itemStyle: {
          normal: {
            // color: '#fff',
            lineStyle: {
              width: 2,
              color: (isGreen == 'green' ? "#f68731" :isGreen == 'blue'? "#00ffff": '#999'),
            },
          },
          emphasis: {
            lineStyle: {
              width: 2,
            },
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: (isGreen == 'green' ? "#f68731" :isGreen == 'blue'? "#00ffff": '#999'), // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#fff', // 100% 处的颜色
            },
          ]),
          opacity: 0.3,
        },
      },
      {
        data: ConstList.map(item => item.volume_24),
        type: 'bar',
        yAxisIndex: 1,
        name: 'volume',
        itemStyle: {
          color: '#cfd6e4',
        },
      }
    ],
  };
};

export const showK = function (xaxis, yaxis, type, ConstList) {
  let min = [...yaxis].sort(function(a, b) {return a[2]*1-b[2]*1})[0][2]- ([...yaxis].sort(function(b, a) {return a[2]*1-b[2]*1})[0][2] - [...yaxis].sort(function(a, b) {return a[2]*1-b[2]*1})[0][2])/2

  return {
    textStyle: {
      fontFamily:
        "Gilroy-Regular, -apple-system,BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.8)",
      axisPointer: {
        type: "cross",
        label: {
          show: false,
        },
        crossStyle: {
          color: "#f68731",
        },
        lineStyle: {
          color: "#f68731",
        },
      },
      extraCssText: "z-index: 2",
      formatter: function (params) {
        let last_close =
          params[0].dataIndex === 0
            ? yaxis[0][1]
            : yaxis[params[0].dataIndex - 1][1];
        let time = `<span>${formatTime(params[0].axisValue/1000)}</span>`;
        let oc = `<div>
              <span>O: </span><span style="color: ${
                params[0].data[1]*1 > last_close*1
                  ? "#f68731"
                  : params[0].data[1] === last_close
                  ? "#999"
                  : "#00ffff"
              }">${params[0].data[1]}</span>
              <span style="margin-left: 20px"> C: </span><span style="color: ${
                params[0].data[2] > last_close
                  ? "#f68731"
                  : params[0].data[2] === last_close
                  ? "#999"
                  : "#00ffff"
              }">${params[0].data[2]}</span>
              </div>`;
        let hl = `<div>
              <span>H: </span><span style="color: ${
                params[0].data[4]*1 > last_close*1
                  ? "#f68731"
                  : params[0].data[4] === last_close
                  ? "#999"
                  : "#00ffff"
              }">${params[0].data[4]}</span>
              <span style="margin-left: 20px"> L: </span><span style="color: ${
                params[0].data[3]*1 > last_close*1
                  ? "#f68731"
                  : params[0].data[3]*1 === last_close*1
                  ? "#999"
                  : "#00ffff"
              }">${params[0].data[3]}</span>
              </div>`;
        let rate = `<div>
              <span style="color: ${
                params[0].data[2]*1 >= params[0].data[1]*1 ? "#f68731" : "#00ffff"
              }">${params[0].data[2]*1 >= params[0].data[1]*1 ? "+" : ""}${(
          params[0].data[2] - params[0].data[1]
        ).toFixed(4)}</span>
              <span style="margin-left: 20px;color: ${
                params[0].data[2]*1 >= params[0].data[1]*1 ? "#f68731" : "#00ffff"
              }">${params[0].data[2]*1 >= params[0].data[1]*1 ? "+" : ""}${(
          ((params[0].data[2] - params[0].data[1]) * 100) /
          params[0].data[1]
        ).toFixed(4)}%</span>
              </div>`;
          let volume = `<div style="font-size: 14px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius: 50%;background:${
            "#00ffff"
          }"></span> 
          Volume: <span style="color: #000;font-size: 12px;">${
            numFormat(toFixed(ConstList[params[0].dataIndex].volume_24, 4))
          }</span>
        </div>`;
        let tipbox = `<div style="font-size: 12px;">${time}${oc}${hl}${rate}${volume}</div>`;
        return tipbox;
      },
      // position: function (
      //   pos,
      //   size
      // ) {
      //   const obj = {};
      //   if (pos[0] < size.viewSize[0] / 2) {
      //     obj.left = pos[0];
      //   } else {
      //     obj.right = size.viewSize[0] - pos[0];
      //   }
      //   if (pos[1] < size.viewSize[1] / 2) {
      //     obj.top = pos[1];
      //   } else {
      //     obj.bottom = size.viewSize[1] - pos[1];
      //   }
      //   return obj;
      // },
    },
    grid: {
      top: "30",
      bottom: "0",
      left: "0",
      right: "10",
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
        start: 70,
        end: 100
      }
    ],
    xAxis: {
      type: "category",
      data: xaxis,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#80706a",
        },
      },
      axisLabel: {
        formatter: function(value){
          return (type*1 === 5 || type*1 === 6 || type*1 === 7) ? formatHour(value/1000):formatDate(value/1000)
        },
        padding: [0, 0, 0, 30],
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "#80706a",
          width: 1,
        },
      },
    },
    yAxis: [{
      show: true,
      type: "value",
      position: "right",
      scale: true,
      splitLine: {
        show: false,
      },
      min: min,
      axisLabel: {
        formatter: function(value){
          return  value < 0 ? '':value.toFixed(4)
        }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "#80706a",
        },
      },
    },
    {
      type: "value",
      show: false,
      max: ConstList.map(item => item.volume_24*1).sort(function(b, a) {return a*1-b*1})[0] * 7 || 100,
      min: 0,
      axisLine:{
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      offset: 100,
      // scale: true,
      position: "right",
      // name: 'volume'
    }],
    series: [
      {
        data: yaxis,
        type: "candlestick",
        symbol: "none",
        itemStyle: {
          normal: {
            color: "#f68731",
            color0: "#00ffff",
            borderColor: "#f68731",
            borderColor0: "#00ffff",
          },
          emphasis: {
            lineStyle: {
              width: 2,
            },
          },
        },
      },
      {
        data: ConstList.map(item => item.volume_24),
        type: 'bar',
        yAxisIndex: 1,
        name: 'volume',
        itemStyle: {
          color: '#cfd6e4',
        },
      }
    ],
  };
};
