import React from 'react'
import { FIREBASE_DOCUMENTS_FEILDS_NAMES } from '../../constants/firebase';
import "../css/ProductPageProductInfoSection.css";

export default function ProductPageProductInfoSection({type, info  }) {

    const prepTimeType = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES;
    const days = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS;
    
    
    const getTitle = (type) => {
        let title = 'Title';
        switch (type) {
            case prepTimeType:
                title = 'Preparation Time:';                
                break;
            case days:
                title = 'Hours of Operation:';
                break;

            case FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DELIVERY_DAYS:
        
            default:
                break;
        }        
        return title;
    }

    const getInfoString = (type, content) => {
        let info = content;
        switch (type) {
            case prepTimeType:
                info = `Could be done in ${info}`;
                break;
            case days:
                info = info;
                break;
            default:
                break;
        }        
        return info;
    }    
    
    
    const title = getTitle(type);
    const infoString = getInfoString(type, info);





  return (
    <div className='product-page-product-info-section' >
        <div className='title'>
            {title}
        </div>
        <div className='info'>
            {infoString}
        </div>
    </div>
  )
}
