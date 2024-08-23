// src/components/CartItem.js

import React from "react";
import "../css/CartItem.css";
import QuantityControl from "./QuantityControl";

const CartItem = ({ item, listIdentifier }) => {
  //const { image, name, price } = item;
  const { id, quantity, discount, image, name, price } = item;
  const totalBeforeDiscounts = price * quantity;
  const FinalTotal = (100-discount)*totalBeforeDiscounts/100;

  return (
    <div className="cart-item-wrapper">
      <div className="cart-item">
        <img src={image} alt={name} className="cart-item-image" />
        <div className="cart-item-details">
          <p className="cart-item-name">
            {quantity}x {name}
          </p>
          <p className="cart-item-price">
            $
            {
              price.toFixed(2)
            }
          </p>
        </div>
        <div className="cart-item-total">
          {discount ? (
            <>
              <p className="cart-item-total-before-discounts">
                <span className="before-discounts-text" >${totalBeforeDiscounts.toFixed(2)}</span>
                <span className="cart-item-discount">
                  ({discount}% off)
                </span>
              </p>
              <p className="cart-item-discount-total">${
                FinalTotal.toFixed(2)
              }</p>
              
            </>
          ) : (
            <p className="cart-item-price">${
              FinalTotal.toFixed(2)
            }</p>
          )}
        </div>
      </div>
      <QuantityControl listIdentifier={listIdentifier} id={id} quantity={quantity}/>
    </div>
  );
};

export default CartItem;
