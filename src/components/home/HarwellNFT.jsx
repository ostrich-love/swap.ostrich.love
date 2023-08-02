import { Button } from 'antd';
import "./HarwellNFT.scss"
export default () => {
  return (
    <div className="orich-nft">
      <div className="content-wrapper">
        <div className="left">
          <div className="text-1">Harwell have all kinds of NFT</div>
          <div className="text-2">
            You can buy & sell your NFTs in{' '}
            <span className="fwb">Harwell marketplace</span>
          </div>
          <Button className="btn">Explore NFT</Button>
        </div>
        {/* <img src={} alt={} width={783}/> */}
        <div style={{width:'783px',height:'783px'}}> </div>
      </div>
    </div>
  );
};
