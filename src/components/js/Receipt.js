import React from 'react';
import CONSTANTS from '../../constants/appConstants';
import '../css/Receipt.css';
import ChargeInfo from './ChargeInfo';
import CheckoutContactInfo from './CheckoutContactInfo';
import CheckoutItemMini from './CheckoutItemMini';
import CheckoutTotalSection from './CheckoutTotalSection';

const Receipt = ({order}) => {

    //general information
    const paymentMethod = "Credit Card";
    const items = [
    { name: "Item 1", quantity: 2, price: 10.00, discount: 2.00 },
    { name: "Item 2", quantity: 1, price: 15.00, discount: 3.00 },
    { name: "Item 3", quantity: 3, price: 7.50, discount: 1.50 },
    ];
    const specialMessage = "Thank you for your purchase! Enjoy your day!";

    const contactInfo = {
        merchantName: "Asala",
        receiptId: "R123456789",
        date: "2024-08-27",
        customerName: "John Doe",
        customerContact: "+1 234-567-890",
        returnPolicy: "No returns allowed.",
        contactInfo: "123-456-7890 | info@asala.com | www.asala.com",
    }

    //charges
    const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
    const charges = [
        { type: CHARGE_INFO_TYPES.SUBTOTAL, value: 50.50 },
        { type: CHARGE_INFO_TYPES.DISCOUNT, value: 5.00 },
        { type: CHARGE_INFO_TYPES.DELIVERY, value: 3.00 },
        { type: CHARGE_INFO_TYPES.TAX, value: 2.50 },
        { type: CHARGE_INFO_TYPES.TOTAL, value: 57.00 },
        { type: CHARGE_INFO_TYPES.SAVINGS, value: 2.50 },
    ];

    // strings to be displayed in html elements
    const titleString = `Order Summary (${items.length} Items)`;
    const paymentMethodString = `Payment Method: ${paymentMethod}`;
    const specialMessageString = `${specialMessage}`;
  

  return (
    <div className="receipt">
        <CheckoutContactInfo info={contactInfo} />

      <div className="receipt-order-summary">
        <span className='receipt-order-summary-title'>{titleString}</span>
        <ul>
          {items.map((item, index) => <CheckoutItemMini key={index} item={item}/>)}
        </ul>
      </div>
      <CheckoutTotalSection charges={charges}/>

      <div className="receipt-payment-method">
        <p>{paymentMethodString}</p>
      </div>

      <div className="receipt-special-message">
        <p>{specialMessageString}</p>
      </div>


    </div>
  );
};

export default Receipt;


