// src/components/CartItem.js

import React, { useState } from "react";
import "../css/CartItem.css";
import QuantityControl from "./QuantityControl";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { calculatePriceForItem, findAppliedDiscount, findDiscountsForProduct, isOperatingTime } from "../../utils/appUtils";
import { useSelector } from "react-redux";

const _optionalAdditions = [
  { id: 1, name: 'ketchup', price: 5.99, active: true, type: 'sauces', 'add-by-default': true },
  { id: 2, name: 'onion', price: 3.99, active: true, type: 'vegetables', 'add-by-default': true },
  { id: 3, name: 'cheese', price: 7.99, active: true, type: 'cheeses', 'add-by-default': false },
  { id: 4, name: 'pepperoni', price: 8.99, active: true, type: 'toppings', 'add-by-default': false },
  { id: 5, name: 'lettuce', price: 2.99, active: true, type:'vegetables', 'add-by-default': true },
  { id: 6, name: 'tomatoes', price: 2.99, active: true, type:'vegetables', 'add-by-default': true },
];

const CartItem = ({ item, parent }) => {
  //const { image, name, price } = item;
  const { id, quantity, name, price } = item;
  const image = item['image-src'];
  const [showOptionalAdditions, setShowOptionalAdditions] = useState(false);
  const itemReleasedToPublic = item.available;
  const itemIsPresent = item.status == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.present;
  const weAreInOperatingTime = isOperatingTime(item.schedule);
  const itemInStock = item['in-stock'];
  const getError = () => {
    if (!itemReleasedToPublic) return { error: "Removed", string: "Removed" };
    if (!itemIsPresent) return { error: "Not-present-yet", string: "Not present yet" };
    if (!weAreInOperatingTime) return { error: "Not-operating-time", string: "Not operating time" };
    if (!itemInStock) return { error: "Not-in-stock", string: "Not in stock" };
    return {error: '', string: '' };
  }  
  const error = getError();
  const nameString = name //+ ' - ' + ;
  const visible = itemReleasedToPublic && itemIsPresent && weAreInOperatingTime && itemInStock;


  

  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts[parent]);
  
  const thisProductSelectedDiscounts = findDiscountsForProduct( selectedDiscounts, id);
  const discounts = thisProductSelectedDiscounts;
  const optionalAdditions = item['optional-additions'] || [];
  
  const appliedDiscount = findAppliedDiscount(discounts, quantity);
  const appliedDiscountDoesNotExist = !appliedDiscount;
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
  const getOptionalAdditionString = (addition) => {
    return`${addition.name} - $${addition.price.toFixed(2)}`
  }
  const noOptionalAdditionsString = 'No add-ons'



  return (
    <div className="cart-item-wrapper">
      <div className="cart-item">
      
        <img src={image} alt={nameString} className="cart-item-image" />
        <div className="cart-item-details">
          <p className={`cart-item-name`}>
            {quantity}x {nameString} <span className={error.error}> - {error.string}</span>
          </p>
          <p className="cart-item-price" onClick={()=>setShowOptionalAdditions(!showOptionalAdditions)} >
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
        
        <QuantityControl visible={visible} parent={parent} id={id} quantity={quantity}/>
      </div>
      
      <div className={`optional-additions-wrapper ${showOptionalAdditions? 'open': 'closed'}`} >
        {
          optionalAdditions.map((addition, index) => (
            <span>{getOptionalAdditionString(addition)}</span>
          ))
        }
        {
          optionalAdditions.length === 0?
          <span>{noOptionalAdditionsString}</span>:
          null
        }
      </div>
    </div>
  );
};

export default CartItem;
