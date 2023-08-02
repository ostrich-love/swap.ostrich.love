import join from '../../assets/json/join'
import './join.scss'
import bkg from '../../assets/image/home/join_bg.png'
export default () => {
    return (
        <div className="join_us m-t-120">
            <div className="ta fz-40 c0 join-big-title p-b-187">How to start your journey with us?</div>
            <div className='flex flex-start flex-around join-wrap'>
            {
                join.map((item, index) => {
                    return (
                        <div className="join-items" key={item.name}>
                            <div className="join-item">
                                <div className="join-title flex flex-center flex-column">
                                    <div className="ta join-name c0 fz-20">{item.name}</div>
                                    <img src={item.logo} alt="" className="join-logo" />
                                </div>
                                <div className="join-steps">
                                {
                                    item.items.map((inner, idx)=>{
                                         return (
                                            <div className="step-item w100 flex flex-start" key={inner.title}>
                                                <div className="step-text fz-14 c0">
                                                    Step {idx+1}
                                                </div>
                                                <div className={"step-content flex flex-1 " + (idx == (item.items.length -1) ? 'last': '')}>
                                                    <div className="step-checkbox flex flex-center flex-middle">
                                                        <div className="step-checkbox-inner"></div>
                                                    </div>
                                                    <div className="step-content-text flex-1">
                                                        <div className="step-content-text-title fz-18 c0">{inner.title}</div>
                                                        <div className="step-content-text-desc fz-16">{inner.desc}</div>
                                                        <div className="apply-btn color ta show-m">Apply</div>
                                                    </div>
                                                    <div className="apply-btn color ta show-p">Apply</div>
                                                </div>
                                            </div>      
                                         )
                                    })
                                }
                                </div>
                                

                            </div>
                        </div>
                    )
                })
            }
            </div>
            
            
        </div>
    )
}