import { useEffect, useState, memo } from 'react'
import CountUp from 'react-countup'
export default memo(function ({value, decimals, classes}) {
    let [start, setStart] = useState(0)
    let [end, setEnd] = useState(isNaN(value)?0:value)
    // console.log(start)
    useEffect(()=> {
        setStart(end)
        setEnd(value)
    }, [value])
    return (
        (!isNaN(value) && value > 0) ? <CountUp separator="," className={classes} end={end} start={start} duration={0.8}  decimals={decimals}></CountUp>: <span className={classes}>0</span>    
    )
})