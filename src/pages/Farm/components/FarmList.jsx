
import '../index.scss';
import FarmItem from './FarmItem';
import FarmItemFixed from './FarmItemFixed';
const decimal = 6

const FarmList = (props) => {

  return (
    <div className='farm-list m-t-30 flex flex-wrap flex-between flex-start'>
      {
        props.farmlist.map((item, index) => (
            item.type == 'flexible' ?
          <FarmItem key={index} type={props.type} account={props.account} info={item} flexibleType={item.type}/>:
          <FarmItemFixed key={index} type={props.type} account={props.account} info={item} flexibleType={item.type}/>
        ))
      }
      <div className='list-offset'></div>
      {
        props.farmlist.length == 0 ? <div className='c05 ta w100'>No Data</div>:''
      }
    </div>
  )
}

export default FarmList