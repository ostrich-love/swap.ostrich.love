// import './Loading.scss'
import loading from '../../assets/image/common/loading1.gif'
export default ({zoom=1, className}) => {
    return (
        <div id="loader-wrapper" className={className} style={{zoom: zoom}}>
            {/* <div id="loader"></div>
            
            <div className="loader-section section-left"></div>
            <div className="loader-section section-right"></div> */}
            <img src={loading} alt="" style={{width: 100}} />
            
        </div>
    )
}