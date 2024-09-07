import React from 'react'
import '../css/SwipeConfirmation.css'
import CONSTANTS from '../../constants/appConstants'
import { useSwipeable } from'react-swipeable';
import ConfirmationInfo from './ConfirmationInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getMaxTimeEstimateBasedOnPrepTimes } from '../../utils/appUtils';
import Paths from '../../constants/navigationPages';

const SwipeAnimation = ({horizontal, right}) => {
    const style = {
        transform: horizontal? (right? 'rotateZ(90deg)': 'rotateZ(-90deg)'):'',
        
    }

    return (
        <div className="swipe-container" style={style}>
            <div className="swipe">
                <div className="swipe-arrow"></div>
                <div className="swipe-arrow"></div>
                <div className="swipe-arrow"></div>
            </div>
        </div>        
    )
}

export default function SwipeConfirmation({active, onConfirm, onCancel, parent, contact, charges}) {
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
                    <ConfirmationInfo contact={contact} charges={charges} parent={parent} />
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
