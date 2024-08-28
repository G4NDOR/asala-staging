// src/components/CartItem.js

import React from "react";
import "../css/CartItem.css";
import QuantityControl from "./QuantityControl";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { calculatePrice, findAppliedDiscount } from "../../utils/appUtils";

const CartItem = ({ item, listIdentifier }) => {
  //const { image, name, price } = item;
  const { id, quantity, name, price } = item;
  const image = item['image-src'];
  //name of a field, 
  const discounts = item[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DISCOUNTS}`];
  
  const appliedDiscount = findAppliedDiscount(discounts, quantity);
  
  //name of a field of a feild, name of a nested feild
  const appliedDiscountExists = appliedDiscount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.ACTIVE}`];//since default value will be false by default unless there's a discount
  const appliedDiscountValue = appliedDiscount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.VALUE}`];
  const totalBeforeDiscounts = price * quantity;
  const FinalTotal = calculatePrice(discounts, price, quantity);

  const discountAppliedOnSingleItem = appliedDiscount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.APPLY_ON_SINGLE_ITEM}`];
  const discountType = appliedDiscount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.TYPE}`];
  const discountFixed = discountType === FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.DISCOUNTS.TYPE.FIXED;
  const discountPercentage = discountType === FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.DISCOUNTS.TYPE.PERCENTAGE;
  const discountUnit = `${discountFixed? '$': (discountPercentage? '%': '')}`;
  const discountString = `(${appliedDiscountValue}${discountUnit} off${discountAppliedOnSingleItem? ' each': ''})`;




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
          {appliedDiscountExists ? (
            <>
              <p className="cart-item-total-before-discounts">
                <span className="before-discounts-text" >${totalBeforeDiscounts.toFixed(2)}</span>
                <span className="cart-item-discount">
                  {discountString}
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
