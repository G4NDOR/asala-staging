import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeMessage } from '../../redux/ducks/appVars';
import '../css/Message.css';
import { useSwipeable } from'react-swipeable';
import CONSTANTS from '../../constants/appConstants';

const Message = ({ key, id, message}) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(true);
    const { content, severity = CONSTANTS.SEVERITIES.INFO } = message;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const onClose = () => {
    dispatch(removeMessage(id));
  };

  const closeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
        handleClose();
    },
    onSwipedLeft: (eventData) => {
        handleClose();
    }    
  })


    useEffect(() => {
      setTimeout(() => {
        handleClose();
      }, 5000);
    
      return () => {
        clearTimeout();
      }
    }, [])  

  return (
    <div {...closeHandlers} className={`message ${severity}`}>
      <span className="message-text">{content}</span>
      <button className="close-btn" onClick={handleClose}>&times;</button>
    </div>
  );
};

export default Message;
