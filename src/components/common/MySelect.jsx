import { useState } from 'react'
import selectImg from '../../assets/image/checkbox/selected.png'
import unselectImg from '../../assets/image/checkbox/unselect.png'
export default () => {
    let [selected, setSelected] = useState(false)
    return (
        <div className='flex flex-center pointer' onClick={()=>{setSelected(!selected)}}>
            <img src={selected ?selectImg: unselectImg} alt=""  style={{width: 24}}/>
            <span className='fz-14 m-l-5'>Only show me</span>
        </div>
    )
}