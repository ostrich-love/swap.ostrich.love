/* eslint-disable import/no-anonymous-default-export */
import './progress.scss'
import ostrichrun from '../../assets/image/newlaunch/ostrichrun.svg'
export default ({showImg=true,schedule=60}) => {
  return <div className="progress-area flex flex-center ido-progress">
    <div className="progress-inner" style={{ width: `${schedule}%` }}></div>
    <div className='fruit-box flex flex-center flex-middle'>
     {showImg && <img className='point' src={ostrichrun} alt="" />} 
    </div>

  </div>
}