import React from 'react';
import '../css/Receipt.css';

const CHARGE_INFO_TYPES = {
    SUBTOTAL: 'subtotal',
    DISCOUNT: 'discount',
    DELIVERY: 'delivery',
    TAX: 'tax',
    TOTAL: 'total',
    SAVINGS:'savings'

}

const ChargeInfo = ({ charge }) => {

    const { SUBTOTAL, DISCOUNT, DELIVERY, TAX, TOTAL, SAVINGS } = CHARGE_INFO_TYPES;
    const chargeType = charge.type;
    const chargeValue = charge.value;


    const getChargeInfoTitleString = (type) => {
        let chargeInfoTitleString = '';
        switch (type) {
            case SUBTOTAL:
                chargeInfoTitleString = "Subtotal:";
                break;
            case DISCOUNT:
                chargeInfoTitleString = "Discount:";
                break;
            case DELIVERY:
                chargeInfoTitleString = "Delivery:";
                break;
            case TAX:
                chargeInfoTitleString = "Tax:";
                break;
            case TOTAL:
                chargeInfoTitleString = "Total:";
                break;
            case SAVINGS:
                chargeInfoTitleString = "Total Savings:";
                break;

            default:
                break;
        }
        return chargeInfoTitleString;
    }

    const getChargeInfoValueString = (type, value) => {
        let chargeInfoValueString = '';
        switch (type) {
            case SUBTOTAL:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case DISCOUNT:
                chargeInfoValueString = `-$${value.toFixed(2)}`;
                break;
            case DELIVERY:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case TAX:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case TOTAL:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case SAVINGS:
                chargeInfoValueString = `-$${value.toFixed(2)}`;
                break;
            default:
                break;
        }
        return chargeInfoValueString;
    }

    const getClassNameString = (type) => {
        let classNameString = '';
        switch (type) {
            case SUBTOTAL:
                classNameString = "receipt-subtotal";
                break;
            case DISCOUNT:
                classNameString = "receipt-discount";
                break;
            case DELIVERY:
                classNameString = "receipt-delivery";
                break;
            case TAX:
                classNameString = "receipt-tax";
                break;
            case TOTAL:
                classNameString = "receipt-total";
                break;
            case SAVINGS:
                classNameString = "receipt-savings";
                break;
            default:
                break;
        }
        return classNameString;
    }

    const chargeInfoTitleString = getChargeInfoTitleString(chargeType);
    const chargeInfoValueString = getChargeInfoValueString(chargeType, chargeValue);
    const classNameString = getClassNameString(chargeType);

    return (
        <div className={classNameString}>
          <span>{chargeInfoTitleString}</span>
          <span>{chargeInfoValueString}</span>
        </div>
    );
}

const ReceiptItem = ({ item }) => {
    const nameString = `${item.name} (x${item.quantity})`;
    const crossedPriceString = `$${(item.price + item.discount).toFixed(2)}`;
    const priceString = `$${item.price.toFixed(2)}`;
    return (
        <li className="receipt-order-item">
          <span className="receipt-item-name">{nameString}</span>
          <span className="receipt-item-price">
            <span className="receipt-crossed-price">{crossedPriceString}</span> 
            {priceString}
          </span>
        </li>
      );
}

const Receipt = ({order}) => {

    //general information
    const merchantName = "Asala";
    const receiptId = "R123456789";
    const date = "2024-08-27";
    const customerName = "John Doe";
    const customerContact = "+1 234-567-890";
    const paymentMethod = "Credit Card";
    const items = [
    { name: "Item 1", quantity: 2, price: 10.00, discount: 2.00 },
    { name: "Item 2", quantity: 1, price: 15.00, discount: 3.00 },
    { name: "Item 3", quantity: 3, price: 7.50, discount: 1.50 },
    ];
    const specialMessage = "Thank you for your purchase! Enjoy your day!";
    const returnPolicy = "No returns allowed.";
    const contactInfo = "123-456-7890 | info@asala.com | www.asala.com";

    //charges
    const charges = [
        { type: CHARGE_INFO_TYPES.SUBTOTAL, value: 50.50 },
        { type: CHARGE_INFO_TYPES.DISCOUNT, value: 5.00 },
        { type: CHARGE_INFO_TYPES.DELIVERY, value: 3.00 },
        { type: CHARGE_INFO_TYPES.TAX, value: 2.50 },
        { type: CHARGE_INFO_TYPES.TOTAL, value: 57.00 },
        { type: CHARGE_INFO_TYPES.SAVINGS, value: 2.50 },
    ];

    // strings to be displayed in html elements
    const merchantNameString = `${merchantName}`;
    const receiptIdString = `Receipt ID: ${receiptId}`;
    const dateString = `Date: ${date}`;
    const contactInfoString = `Contact: ${contactInfo}`;
    const customerInfoString = `Customer: ${customerName} | ${customerContact}`;
    const returnPolicyString = `Return Policy: ${returnPolicy}`;
    const titleString = `Order Summary (${items.length} Items)`;
    const paymentMethodString = `Payment Method: ${paymentMethod}`;
    const specialMessageString = `${specialMessage}`;
  

  return (
    <div className="receipt">
      <h1 className='receipt-merchant-name'>{merchantNameString}</h1>
      <div className="receipt-info">
        <span>{receiptIdString}</span>
        <span>{dateString}</span>
        <span>{contactInfoString}</span>
        <span>{customerInfoString}</span>
        <span>{returnPolicyString}</span>
      </div>

      <div className="receipt-order-summary">
        <span className='title'>{titleString}</span>
        <ul>
          {items.map((item, index) => <ReceiptItem key={index} item={item}/>)}
        </ul>
      </div>

      <div className="receipt-totals">
        {
            charges.map((charge, index) => <ChargeInfo key={index} charge={charge}/>)
        }
      </div>

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


