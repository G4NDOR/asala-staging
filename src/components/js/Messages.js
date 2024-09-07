import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import '../css/Messages.css'
import Message from './Message'

export default function Messages() {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.appVars.messages);
    
  
    return (
    <div className='messages-wrapper' style={{zIndex: CONSTANTS.Z_INDEXES.MESSAGES}} >
        {
            messages.map((message, index) => ( <Message key={index} id={index} message={message}/>))
        }
    </div>
  )
}
