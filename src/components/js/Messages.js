import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import '../css/Messages.css'
import Message from './Message'

export default function Messages() {
    const dispatch = useDispatch();
    const messagesObj = useSelector(state => state.appVars.messages);
    const messagesIds = Object.keys(messagesObj);    
    
  
    return (
    <div className='messages-wrapper' style={{zIndex: CONSTANTS.Z_INDEXES.MESSAGES}} >
        {
            messagesIds.map((id, index) => ( <Message key={index} id={id} message={messagesObj[id]}/>))
        }
    </div>
  )
}
