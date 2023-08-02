import { Button } from 'antd';
import TradeIcon from '../../assets/image/home/trade-icon.png';
import './TradeEarn.scss';
export default () => {
  return (
    <div className="trade-earn">
      <div className="content-wrapper">
        <div className='bg-text'> Harwel</div>
        <div className="left">
          <div className="text-1">WELCOME TO Harwell</div>
          <div className="text-2">Trade 2 Earn on Harwell</div>
          <div className="text-3">
            Win extra Orich for every Swap or NFT trade on
            <a class='text-3' href="Harwell.pro" >Harwell.pro</a>
          </div>
          <Button className="btn">Trade Now !</Button>
        </div>
        <img src={TradeIcon} alt="" width={619} />
      </div>
    </div>
  );
};
