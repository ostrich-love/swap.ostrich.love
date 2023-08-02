import './index.scss'
import { NavLink } from 'react-router-dom'
import list from './list'
import arrow from '../../assets/image/bridge/arrow.svg'

const Bridge = ({info}) => {
  return (
    <div className="bridge-item p-l-24 p-r-24 p-t-16 p-b-16 c2e m-b-30">
         <div className="logo-area flex flex-last">
          <div className="logo-box flex flex-center flex-middle">
          <img src={info.logo} alt="" className="logo" />
          </div>
            
            <a href={info.link} className='open islink flex flex-center flex-middle' target="_blank">Open
            <img src={arrow} className='m-l-3' alt="" />
            </a>
         </div>
         <div className="name fz-24 fwb m-t-24">{info.name}</div>
         <div className="desc fz-14">{info.desc}</div>
         <div className="tips flex gap-8">
          {
            info.tip.map(item => {
              return <span className="tip-item">{item}</span>
            })
          }
         </div>
    </div>
  )
}
export default () => {

  return (
    <div className="bridge">
      <div className="bridge-banner-area w100">
        <div className="bridge-banner-content flex flex-column flex-middle">
          <div className='fz-40 c231 pools'>Say hello to a new era.</div>
          <div className="c231 fz-20 m-t-4 bridge-slogan">Enjoy faster, cheaper and more efficient transactions with the future proof zkEVM scaling <br/> Ethereum‘s security and values.</div>
          {/* <NavLink to="/submit" className='color supply-btn cf fz-14 fwb m-t-25 ta hover' >What are bridges? </NavLink> */}

        </div>
      </div>
      <div className="project-list">
          <div className="ce fz-18 fwb">Choose a bridge</div>
          <div className="flex flex-wrap gap-60 p-t-60">
            {
              list.map(item => {
                return <Bridge key={item.name} info={item}/>
              })
            }
          </div>
          
         
      </div>
    </div>
  )
}