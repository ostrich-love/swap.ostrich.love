import './index.scss'
import banner from '../../assets/image/project/mock/highstreet_banner.png'
import logo from '../../assets/image/project/mock/highstreet.png'
import remind from '../../assets/image/project/tixing.svg'
import heart from '../../assets/image/project/xin.svg'
import member from '../../assets/image/project/yonghu.svg'
import Progress from '../common/progress'
import { NavLink } from 'react-router-dom'
import { formatTime } from '../../lib/util'
export default (props)=>{
    return (
        <NavLink className={"project-item "+ props.className} to={"/launchpad/project/"+props.info?.id}>
             <img src={banner} alt="" className='banner'/>
             <div className="project-info">
                <div className="logo">
                    <img src={props.info?.logo} alt="" />
                </div>
                <div className="status-bar fz-14 p-r-20 tr">
                     1{props.info?.tokenSymbol} = {props.info?.saleAmount/props.info?.totalUsd} USDC
                </div>
                <div className="project-name-bar m-t-13 p-l-30 p-r-30 flex flex-start flex-between">
                    <div className="project-name">
                         <div className="name fz-24 fwb">{props.info?.name}</div>
                         <div className="desc m-t-5">{props.info?.describe}</div>
                    </div>
                    <div className="remind flex flex-center flex-middle hover">
                        <img src={remind} alt="" className='m-r-6'/>
                        <span>
                            Remind Me
                        </span>
                    </div>
                </div>
                <div className="p-20 w100">
                    <div className="amount-info w100 p-16">
                        <div className="amount-item flex flex-between">
                            <div className="amount-name fz-14">Presale Amount</div>
                            <div className="amount-data fz-14">{props.info?.saleAmount} {props.info?.tokenSymbol}</div>
                        </div>
                        <div className="amount-item flex flex-between">
                            <div className="amount-name fz-14">Start Time</div>
                            <div className="amount-data fz-14">{formatTime(props.info?.startTime)}</div>
                        </div>
                        <div className="amount-item flex flex-between">
                            <div className="amount-name fz-14">NO. of Rounds</div>
                            <div className="amount-data fz-14">{props.info?.round}/{JSON.parse(props.info?.rounds||'[]').length}</div>
                        </div>
                        <div className="amount-item flex flex-between">
                            <div className="amount-name fz-14">Progress</div>
                            <div className="amount-data fz-14">999,888/{props.info?.saleAmount} (99.99%)</div>
                        </div>
                        <Progress/>
                    </div>
                </div>
                {/* <div className="like-area flex flex-center flex-middle">
                     <div className="like-num flex flex-center ">
                         <img src={heart} alt="" />
                         <span className='num fz-14 m-l-8'>112</span>
                     </div>
                     <div className="like-num  flex flex-center m-l-32">
                         <img src={member} alt="" />
                         <span className='num fz-14 m-l-8'>112</span>
                     </div>
                </div> */}
             </div>
        </NavLink>
    )
}