import React from 'react'
import '../css/SwipeConfirmation.css'
import CONSTANTS from '../../constants/appConstants'
import { useSwipeable } from'react-swipeable';
import ConfirmationInfo from './ConfirmationInfo';

const SwipeAnimation = ({horizontal, right}) => {
    const style = {
        transform: horizontal? (right? 'rotateZ(90deg)': 'rotateZ(-90deg)'):'',
        
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

export default function SwipeConfirmation({active, onConfirm, onCancel, parent}) {
  const disabled =!active;

  const confirmationHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
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
            <div className="confirmation-page-content-wrapper">
                <div className='swipe-confirmation-info-wrapper'>
                    <ConfirmationInfo parent={parent} />
                    <div className='swipe-confirmation-cover'>
                
                    </div>                
                </div>
                <div {...cancelationHandlers} className="swipe-cancelation">
                    <SwipeAnimation horizontal={true} right={false}/>
                    
                    <span className='swipe-cancelation-lable' >Cancel</span>
                </div>
                <div {...confirmationHandlers} className="swipe-confirmation" >
                    <SwipeAnimation horizontal={true} right={true}/>
                    <span className='swipe-confirmation-lable' >Confirm</span>
                </div>                      
            </div>
            

        </div>
  )
}
