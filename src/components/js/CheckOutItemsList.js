import React, { useEffect, useRef } from 'react';
import '../css/CheckOutItemsList.css';
import CartItem from './CartItem';
import {useSelector} from 'react-redux';
import { saveOrUpdateCartItemToLocalStorage, updateCartItemsInFirebaseFromProductObjList } from '../../utils/firestoreUtils';
import { CART, EMPTY_LIST, ONE_ITEM_CHECKOUT } from '../../constants/stateKeys';
import Paths from '../../constants/navigationPages';
import CheckoutTotalSection from './CheckoutTotalSection';
import Discount from './Discount';
import ChargeInfo from './ChargeInfo';
import CONSTANTS from '../../constants/appConstants';
import { calculatePriceForItem, calculateTotalListPriceWithAppliedDiscountsAndUsedCredit, findAppliedDiscount, getPriceWithDiscountApplied } from '../../utils/appUtils';

const CheckOutItemsList = ({parent}) => {
  const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
  const currentPage = useSelector(state => state.appVars.currentPage);
  const isHomePage = currentPage === Paths.HOME;
  const isCartPage = currentPage === Paths.CART;
  const isNotCartPage = !isCartPage;
  const isCartComponent = parent == Paths.CART && isNotCartPage;
  const isNotCartComponent = !isCartComponent;
  const payClicked = useSelector(state => state.orderManager.intentToPay);


  //we are in cart view and not product page checkout section
  //if it's either the parent that called  this componen (CheckOutItemsList) is cart
  const inCart = parent == Paths.CART;
  const isProductCheckout = parent === Paths.PRODUCT;
  const getListIdentifier = () => {
    if(inCart) return CART;
    if(isProductCheckout) return ONE_ITEM_CHECKOUT;
    return null
  }

  const listIdentifier = getListIdentifier();
  const products = useSelector((state) => state['orderManager'][`${listIdentifier? listIdentifier:EMPTY_LIST}`]);
  const listIsNotEmpty = products.length > 0;
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  const cartLoadedFromStorage = useSelector(state => state.orderManager.cartLoadedFromStorage);
  const cart = useSelector(state => state.orderManager.cart);
  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts[parent]);
  const usedCredit = useSelector(state => state.orderManager.usedCredit);

    const total = calculateTotalListPriceWithAppliedDiscountsAndUsedCredit(products, selectedDiscounts, usedCredit);
  
  const Finalcharge = { type: CHARGE_INFO_TYPES.TOTAL, value: total }

  if((products.length == 0) || (payClicked && isNotCartComponent)) return null;
  
  return (
    <>
      {
        <div className='items-list' style={{}}>
          <ul>
            {
              products.map((product, index) => (
                <CartItem parent={parent} key={index} item={product} />
              ))
            }
            <ChargeInfo parent={parent} visible={listIsNotEmpty} charge={Finalcharge}/>
          </ul>
          <Discount parent={parent} visible={listIsNotEmpty && isNotCartComponent}/>
        </div>
          
      }    
      {
        inCart && cartIsEmpty?
        <p className="cart-empty-text">Your cart is empty</p>:
        null
      }
    </>
  );
};

export default CheckOutItemsList;