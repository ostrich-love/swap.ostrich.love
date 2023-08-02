import classNames from "classnames";
import { useEffect, useState } from "react";
import './PineconeSwitch.scss'
import offIcon from '../../assets/image/launchpad/off-icon.svg'
import onIcon from '../../assets/image/launchpad/on-icon.svg'

function PineconeSwitch(props) {
  const { className, defaultChecked } = props;
  console.log('////////////////////////')
  console.log(props.defaultChecked)
  const [checkValue, setCheckValue] = useState(defaultChecked*1 || false);
  useEffect(()=>{
    props.onChange && props.onChange(checkValue)
  }, [checkValue])
  return (
    <div
      className={classNames('pinecone-switch', className)}
      onClick={() => setCheckValue(value => !value)}>
      <div className={classNames('switch-inner', {
        'switch-on': checkValue
      })}></div>
      {
        checkValue ? (
          <img className="on-icon" src={onIcon} alt="" />
        ) : (
          <img className="off-icon" src={offIcon} alt="" />
        )
      }
    </div>
  )
}

export default PineconeSwitch;