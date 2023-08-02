import './progress.scss'
import songzi from '../../assets/image/projectdetail/songshu.png'
export default ()=> {
    return <div className="progress-area flex flex-center ido-progress">
        <div className="progress-inner" style={{width: '60%'}}></div>
        <div className='fruit-box flex flex-center flex-middle'> <img className='point' src={songzi} alt="" /></div>
       
    </div>
}