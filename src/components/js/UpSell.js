import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { FIREBASE_DOCUMENTS_FEILDS_NAMES } from '../../constants/firebase';
import { addOneItemCheckout } from '../../redux/ducks/orderManager';
import { calculatePrice } from '../../utils/appUtils';
import '../css/UpSell.css'; // Import the CSS file for styling
import UpsellBtn from './UpsellBtn';

const UpSell = ({  }) => {
  const recommendations = useSelector(state => state.productPageManager.recommendations);


  

  return (
    <div className="upsell-section">
      <h2 className="upsell-title">You Might Also Like</h2>
      <div className="upsell-container">
        {recommendations.map((item) => {
          const id = item[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID}`];
          const imageUrl = item[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.IMAGE_URL}`];
          const name = item[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.NAME}`];
          const discounts = item[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DISCOUNTS}`];
          const price = item[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PRICE}`];
          const quantity = 1; // Default quantity for upsell items is 1
          const FinalPrice = calculatePrice(discounts, price, quantity);

          return (
            <div key={id} className="upsell-item">
              <img src={imageUrl} alt={name} className="upsell-image" />
              <div className="upsell-info">
                <h3 className="upsell-title">{name}</h3>
                {
                  <p className="upsell-price">${FinalPrice.toFixed(2)}</p>
                  //<p className="upsell-description">{item.description}</p>
                }
              </div>
              <UpsellBtn item={item}/>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default UpSell;
