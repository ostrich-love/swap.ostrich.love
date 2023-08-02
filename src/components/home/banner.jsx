import { NavLink } from 'react-router-dom'
import './banner.scss'
export default () => {
    return (
        <div className="banner-area p-l-64 p-r-64 p-t-40 p-b-40 flex-start flex">
            <div className="left-banner  flex-1">
                <div className="fz-16 c23 welcome">WELCOME TO APTOS</div>
                <div className="fz-56 c2b m-t-24 slogan">
                    Accelerate your speed in the Aptos ecosystem
                </div>
                <div className="fz-24 c2b m-t-24 desc">
                    Aptos enables you to participate in the outstanding projects in Aptosverse at an early stage.
                </div>

                <NavLink className="launch-btn color c2b ta fz-16 m-t-46" to="/launchpad">
                    {
                      ('APTOS LaunchPad').toUpperCase()
                    }
                    
                </NavLink>
            </div>
            <div className="right-banner flex-1">
                <img src={require('../../assets/image/home/banner.png')} alt="" />
            </div>
            <div className="bkg-text">
                Harwell
            </div>
        </div>
    )
}