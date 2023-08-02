import './index.scss'
export default () => {
    const textList = [
    //     {
    //     text: 'Ostrich',
    //     type: 'text',
    //     order: 1,
    //     order_mini: 1
    // }, 
    // {
    //     text: 'PROOF OF PARTICIPATION',
    //     type: 'text',
    //     order: 14,
    //     order_mini: 4
    // },
     {
        text: 'TWITTER',
        type: 'link',
        url: 'https://twitter.com/ostrich_btc',
        order: 35,
        order_mini: 9
    }]
    return (
        <>
          <div className="box-wrapper">
             {
                (() => {
                    let boxes = []
                    for(let i = 0; i<50; i++) {
                        if(textList.some(item => item.order-1 == i)) {
                            textList.find(item => item.order-1==i).type =='text'? boxes.push(<div className="box-item">{textList.find(item => item.order-1==i).text}</div>):
                            boxes.push(<a className="box-item" target='_blank' href={textList.find(item => item.order-1==i).url}>{textList.find(item => item.order-1==i).text}</a>)
                        } else {
                            boxes.push(<div className="box-item"></div>)
                        }
                        
                    }
                    return boxes
                })()
             }

          </div>

          <div className="box-wrapper-mobile">
          {
                (() => {
                    let boxes = []
                    for(let i = 0; i<20; i++) {
                        if(textList.some(item => item.order_mini-1 == i)) {
                            textList.find(item => item.order_mini-1==i).type =='text'? boxes.push(<div className="box-item">{textList.find(item => item.order_mini-1==i).text}</div>):
                            boxes.push(<a className="box-item" target='_blank' href={textList.find(item => item.order_mini-1==i).url}>{textList.find(item => item.order_mini-1==i).text}</a>)
                        } else {
                            boxes.push(<div className="box-item"></div>)
                        }
                        
                    }
                    return boxes
                })()
             }

          </div>
        </>
    )
}