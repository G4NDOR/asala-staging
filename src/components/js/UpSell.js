import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { addOneItemCheckout } from '../../redux/ducks/orderManager';
import '../css/UpSell.css'; // Import the CSS file for styling
import UpsellBtn from './UpsellBtn';

const UpSell = ({ recommendations }) => {

  return (
    <div className="upsell-section">
      <h2 className="upsell-title">You Might Also Like</h2>
      <div className="upsell-container">
        {recommendations.map((item) => (
          <div key={item.id} className="upsell-item">
            <img src={item.image} alt={item.name} className="upsell-image" />
            <div className="upsell-info">
              <h3 className="upsell-title">{item.name}</h3>
              {
                <p className="upsell-price">${item.price.toFixed(2)}</p>
                //<p className="upsell-description">{item.description}</p>
              }
            </div>
            <UpsellBtn item={item}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpSell;
