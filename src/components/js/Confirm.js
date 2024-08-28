import React, { useState } from 'react';
import '../css/ConfirmBtn.css';

const ConfirmBtn = ({ onConfirm }) => {
  const [swiped, setSwiped] = useState(false);
  const [content,setContent] = useState("Confirm");
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (event) => {
    setStartY(event.touches[0].clientY)
    console.log('startY',startY)
    //setSwiped(true);
    //setContent('confirmed')
    //onConfirm(); // Trigger the action on swipe up
  };

  const handleTouchEnd = (event) => {
    const endY = event.changedTouches[0].clientY;
    if (endY - startY > 10){
      setSwiped(true);
      setContent('confirmed')
      onConfirm(); // Trigger the action on swipe up
    }
    //setSwiped(false);
    //setContent('Confirm')
  }

  return (
    <div 
      className={`confirm-btn ${swiped ? 'swiped' : ''}`} 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd} // For desktop users
      onClick={()=>console.log('clicked')}
    >
      {content}
      <div className="arrows">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default ConfirmBtn;


