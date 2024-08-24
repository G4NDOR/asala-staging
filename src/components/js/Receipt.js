import React, { useRef } from 'react';
import '../css/Receipt.css';
import html2canvas from 'html2canvas';
import { useSelector } from'react-redux';


const Receipt = ({ receiptData }) => {
    const { merchantName, date, total } = {date: "date", items: [], total: "total", merchantName: "merchantName"};
    const items = useSelector(state => state.orderManager.cart); // Accessing the items from the Redux store
    
      // Create a reference to the receipt div for taking screenshots
  const receiptRef = useRef(null);

  const handleScreenshot = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'receipt.png';
      link.click();
    }
  };

  return (
    <div className="receipt-container">
      <div className="receipt" ref={receiptRef}>
        <h2 className="receipt-title">Receipt</h2>
        <div className="receipt-details">
          <p className="receipt-merchant">{merchantName}</p>
          <p>{date}</p>
        </div>
        <div className="receipt-items">
          {items.map((item, index) => (
            <div key={index} className="receipt-item">
              <span>{item.name}</span>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
        <div className="receipt-total">
          <span>Total</span>
          <span>{total}</span>
        </div>
        <p className="receipt-thankyou">Thank you for your purchase!</p>
      </div>
      <button onClick={handleScreenshot} className="screenshot-button">Download Receipt</button>
    </div>
  );
};

export default Receipt;
