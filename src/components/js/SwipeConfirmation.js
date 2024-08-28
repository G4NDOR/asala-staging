import React from 'react'
import '../css/SwipeConfirmation.css'
import CONSTANTS from '../../constants/appConstants'
import { useSwipeable } from'react-swipeable';

const SwipeAnimation = ({horizontal}) => {
    const style = {
        transform: horizontal? 'rotateZ(-90deg)' : '',
        
    }

    return (
        <div class="swipe-container" style={style}>
            <div class="swipe">
                <div class="swipe-arrow"></div>
                <div class="swipe-arrow"></div>
                <div class="swipe-arrow"></div>
            </div>
        </div>        
    )
}

export default function SwipeConfirmation({active, onConfirm, onCancel}) {
  const disabled =!active;

  const confirmationHandlers = useSwipeable({
    onSwipedUp: (eventData) => {
        onConfirm();
    }
    
  });  

  const cancelationHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      onCancel();
    }
  })

    return (
        <div className={`swipe-confirmation-page ${disabled? 'swipe-confirmation-page-disabled': ''}`} style={{zIndex:`${CONSTANTS.Z_INDEXES.SWIPE_CONFIRMATION}`}}>
            <div {...cancelationHandlers} className="swipe-cancelation">
                <SwipeAnimation horizontal={true}/>
                
                <span className='swipe-cancelation-lable' >Cancel</span>
            </div>
            <div {...confirmationHandlers} className="swipe-confirmation" >
                <SwipeAnimation horizontal={false}/>
                <span className='swipe-confirmation-lable' >Confirm</span>
            </div>
        </div>
  )
}
