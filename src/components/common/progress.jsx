import './progress.scss'
import songzi from '../../assets/image/project/songzi.svg'
export default ()=> {
    return <div className="progress-area flex flex-center">
        <div className="progress-inner" style={{width: '60%'}}></div>
        <div className='fruit-box flex flex-center flex-middle'> <img  src={songzi} alt="" /></div>
       
    </div>
}