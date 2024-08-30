// src/components/CartItem.js

import React from "react";
import "../css/CartItem.css";
import QuantityControl from "./QuantityControl";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { calculatePriceForItem, findAppliedDiscount } from "../../utils/appUtils";
import { useSelector } from "react-redux";

const CartItem = ({ item }) => {
  //const { image, name, price } = item;
  const { id, quantity, name, price } = item;
  const image = item['image-src'];
  

  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts);
  
  const thisProductSelectedDiscounts = selectedDiscounts.filter(discount => {
    const discountBelongsToThisProduct = discount.product === id;
    return discountBelongsToThisProduct;
  });
  const discounts = thisProductSelectedDiscounts;
  console.log('Cart item: discounts', discounts);
  
  const appliedDiscount = findAppliedDiscount(discounts, quantity);
  const appliedDiscountDoesNotExist = !appliedDiscount;
  console.log('Cart item: applied discount', appliedDiscount);
  //name of a field of a feild, name of a nested feild
  

  const totalBeforeDiscounts = price * quantity;
  const FinalTotal = calculatePriceForItem(appliedDiscount, price, quantity);

  const getDiscountString = () => {
    if (appliedDiscountDoesNotExist) return "";

    const appliedDiscountValue = appliedDiscount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.VALUE}`];
    const discountAppliedOnSingleItem = appliedDiscount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.APPLY_ON_SINGLE_ITEM}`];
    const discountType = appliedDiscount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.TYPE}`];
    const discountFixed = discountType === FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.TYPE.FIXED;
    const discountPercentage = discountType === FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.TYPE.PERCENTAGE;
    const discountUnit = `${discountFixed? '$': (discountPercentage? '%': '')}`;
    const discountString = `(${appliedDiscountValue}${discountUnit} off${discountAppliedOnSingleItem? ' each': ''})`;
    return discountString;
  }

  const discountString = getDiscountString();



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
          {appliedDiscountDoesNotExist ? 
            (
              <p className="cart-item-price">${
                FinalTotal.toFixed(2)
              }</p>
            ):
            (
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
            )            
          }
        </div>
      </div>
      <QuantityControl id={id} quantity={quantity}/>
    </div>
  );
};

export default CartItem;
