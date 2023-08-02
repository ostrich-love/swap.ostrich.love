// custom modal

import React, { useState, useEffect, useRef } from 'react';
import './Modal.scss'
import { Modal, Button} from 'antd';
// import { CloseOutlined } from '@ant-design/icons';
import close from '../../assets/image/common/close.svg'
import classNames from 'classnames';

export default function MyModal(props) {
  return (
    <Modal visible={props.isVisible} width={props.width||420} closable={false} footer={false} className={classNames(["my-modal", props.className])}>
      <div className={"modal-header "+(props.border?'has-border':'')}>
        <div className="modal-title">
          <div className="fwb c2b fz-24 h2">{props.title||'Title'}</div>
          {
            props.hideclose ? '':<div className="modal-close" onClick={props.onClose}><img src={close} /></div>
          }
        </div>
        {
           props.info && 
           <div className="modal-info fz-13 c236">
             {props.info}
           </div>
        }
       
      </div>
      <div className={"modal-content p-l-"+(props.margin??30)+" p-r-"+(props.margin??30)+" p-b-"+(props.margin??30)}>
          {props.children} 
      </div>

    </Modal>
  )
}
