import './style.scss'
import { useState } from 'react';
import headSculpture from '../../assets/image/newTrade/headSculpture.svg'
import ORICH from '../../assets/image/newTrade/ORICH.svg'
import Attention from '../../assets/image/newTrade/attention.svg'
// import { useNavigate } from 'react-router-dom';
const Index = () => {
  const [datalist, setList] = useState([
    {
      id: 1,
      logo: headSculpture,
      orich: 'ORICH/BUSD',
      multi: 'Multi',
      MultiNum: '20X',
      aprName: 'APR',
      percentage: '0.08%',
      cumulativeleft: 'Cumulative reward',
      cumulativeRight: 'My volume',
      lastlineLeft: '130.31 ORICH',
      lastlineRight: '130.31 ORICH',
      footTitle: "Unclaimed reward",
      footValue: "130.31 ORICH",
      InformationList: [{
        left: 'Rewards allocated',
        right: '1,000,000 PPP'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      }
      ]
    },
    {
      id: 2,
      logo: headSculpture,
      orich: 'ORICH/BUSD',
      multi: 'Multi',
      MultiNum: '20X',
      aprName: 'APR',
      percentage: '0.08%',
      cumulativeleft: 'Cumulative reward',
      cumulativeRight: 'My volume',
      lastlineLeft: '130.31 ORICH',
      lastlineRight: '130.31 ORICH',
      footTitle: "Unclaimed reward",
      footValue: "130.31 ORICH",
      InformationList: [{
        left: 'Rewards allocated',
        right: '1,000,000 PPP'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      }
      ]
    },
    {
      id: 3,
      logo: headSculpture,
      orich: 'ORICH/BUSD',
      multi: 'Multi',
      MultiNum: '20X',
      aprName: 'APR',
      percentage: '0.08%',
      cumulativeleft: 'Cumulative reward',
      cumulativeRight: 'My volume',
      lastlineLeft: '130.31 ORICH',
      lastlineRight: '130.31 ORICH',
      footTitle: "Unclaimed reward",
      footValue: "130.31 ORICH",
      InformationList: [{
        left: 'Rewards allocated',
        right: '1,000,000 PPP'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      }
      ]
    },
    {
      id: 4,
      logo: headSculpture,
      orich: 'ORICH/BUSD',
      multi: 'Multi',
      MultiNum: '20X',
      aprName: 'APR',
      percentage: '0.08%',
      cumulativeleft: 'Cumulative reward',
      cumulativeRight: 'My volume',
      lastlineLeft: '130.31 ORICH',
      lastlineRight: '130.31 ORICH',
      footTitle: "Unclaimed reward",
      footValue: "130.31 ORICH",
      InformationList: [{
        left: 'Rewards allocated',
        right: '1,000,000 PPP'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      }
      ]
    },
    {
      id: 5,
      logo: headSculpture,
      orich: 'ORICH/BUSD',
      multi: 'Multi',
      MultiNum: '20X',
      aprName: 'APR',
      percentage: '0.08%',
      cumulativeleft: 'Cumulative reward',
      cumulativeRight: 'My volume',
      lastlineLeft: '130.31 ORICH',
      lastlineRight: '130.31 ORICH',
      footTitle: "Unclaimed reward",
      footValue: "130.31 ORICH",
      InformationList: [{
        left: 'Rewards allocated',
        right: '1,000,000 PPP'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      }
      ]
    },
    {
      id: 6,
      logo: headSculpture,
      orich: 'ORICH/BUSD',
      multi: 'Multi',
      MultiNum: '20X',
      aprName: 'APR',
      percentage: '0.08%',
      cumulativeleft: 'Cumulative reward',
      cumulativeRight: 'My volume',
      lastlineLeft: '130.31 ORICH',
      lastlineRight: '130.31 ORICH',
      footTitle: "Unclaimed reward",
      footValue: "130.31 ORICH",
      InformationList: [{
        left: 'Rewards allocated',
        right: '1,000,000 PPP'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      },
      {
        left: 'Total volume',
        right: '$ 48992525.6924'
      }
      ]
    }
  ]);
  const [selectId, setSelectId] = useState(1)
  // const Navigate = useNavigate()

  return (
    <div className='farm-main'>
      <div className='heads'>
        <div className='title'>Swap Rewards</div>
        <div className='tip'>Multiple staking options for you to earn more rewards</div>
        {/* <div className='buttom'>Supply</div> */}
      </div>
      <div className='the-body'>
        <div className='head-card'>
          <div className='card'>
            <div className='title'>Total volume</div>
            <div className='value'>11623705.5744</div>
          </div>
          <div className='card'>
            <div className='title'>Current volume (In pool)</div>
            <div className='value'>553337.0485</div>
          </div>
          <div className='card bg'>
            <div className='content-bg'>
              <div className='title'>Your withdrawable rewards ORICH</div>
              <div className='value'>
                <img src={ORICH} alt='' width={32} />
                <div className='number'>2.335</div>
              </div>
            </div>
            <div className='buttom'>Harvest</div>
          </div>
        </div>
        <div className='tip'> <img  src={Attention} alt=''/> After the withdrawal of your rewards, you will lose the transaction mining weight</div>
        <div className='trading'>
          <div className='title'>Trading</div>
          <div className='tips'>All trading volume will mine WE block output pro rate.Thus, the trading volume is similar to a 'mining machine' which will be distoried when you harvest.</div>
        </div>
        <div className='content'>
          {datalist && datalist.map((res, index) => {
            return (
              <div
                className={`${res.id === selectId ? 'farm-card  selectBox' : 'farm-card'}`}
                key={res.id}
                onClick={() => setSelectId(res.id)}
              >
                <div className='card-content'>
                  <div className='title'>
                    <div className='logo'>
                      <img src={res.logo} alt='' />
                      <div className='information'>
                        <div className='orich'>{res.orich}</div>
                        <div className='multi'>{res.multi} <span>{res.MultiNum}</span></div>
                      </div>
                    </div>
                    <div className='APR'>
                      <div className='name'>{res.aprName}</div>
                      <div className='percentage'>{res.percentage}</div>
                    </div>
                  </div>
                  <div className='InformationBlock'>
                    {res.InformationList.map(res => (
                      <div className='row'>
                        <div className='left'>{res.left}</div>
                        <div className='right'>{res.right}</div>
                      </div>
                    ))}
                  </div>
                  <div className='line' />
                  <div className='cumulative'>
                    <div className='left'>{res.cumulativeleft}</div>
                    <div className='right'>{res.cumulativeRight}</div>
                  </div>
                  <div className='lastline'>
                    <div className='left'>{res.lastlineLeft}</div>
                    <div className='right'>{res.lastlineRight}</div>
                  </div>
                </div>
                <div className={`farm-foot ${res.id === selectId && 'selectCard'}`}>
                  <div className='title'>{res.footTitle}</div>
                  <div className='value'>{res.footValue}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Index;