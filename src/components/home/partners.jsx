
import './partners.scss'
import Partners1 from '../../assets/image/partners/1.png'
import Partners2 from '../../assets/image/partners/2.png'
import Partners3 from '../../assets/image/partners/3.png'
import Partners4 from '../../assets/image/partners/4.png'
import Partners5 from '../../assets/image/partners/5.png'
import Partners6 from '../../assets/image/partners/6.png'

const partnersImages = [Partners1, Partners2,Partners3,Partners4,Partners5,Partners6]
export default () => {
    return (
        <div className="partners flex flex-column flex-middle flex-center p-t-160 p-b-160">
            <div className="c0 fz-40 ta partner-title">Distinguished Partners</div>

            <div className="partners-inner flex flex-wrap m-t-60">
                {
                    partnersImages.map((item, idx) => {
                        return (
                            <div key={idx} className="partner-item m-5 flex flex-center flex-middle">
                                    <img src={item} alt="" />
                            </div>
                        )
                    })
                }
               
            </div>
            <img className='left-img show-p' src={require('../../assets/image/partners/left.png')} alt="" />
            <img className='right-img show-p' src={require('../../assets/image/partners/right.png')} alt="" />
        </div>
    )
}