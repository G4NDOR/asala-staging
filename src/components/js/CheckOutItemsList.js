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
import { calculatePriceForItem, calculateTotalPrice, findAppliedDiscount, getPriceWithDiscountApplied } from '../../utils/appUtils';

const CheckOutItemsList = ({parent}) => {
  const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
  const currentPage = useSelector(state => state.appVars.currentPage);
  const isHomePage = currentPage === Paths.HOME;
  const isCartPage = currentPage === Paths.CART;
  const isNotCartPage = !isCartPage;
  const isCartComponent = parent == Paths.CART && isNotCartPage;
  const isNotCartComponent = !isCartComponent;

  //we are in cart view and not product page checkout section
  //if it's either the parent that called  this componen (CheckOutItemsList) is cart
  const inCart = parent == Paths.CART;
  console.log('inCart', inCart);
  const isProductCheckout = parent === Paths.PRODUCT;
  const getListIdentifier = () => {
    if(inCart) return CART;
    if(isProductCheckout) return ONE_ITEM_CHECKOUT;
    return null
  }

  const listIdentifier = getListIdentifier();
  const products = useSelector((state) => state['orderManager'][`${listIdentifier? listIdentifier:EMPTY_LIST}`]);
  const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);
  console.log('cartIsEmpty', cartIsEmpty);
  const cartLoadedFromStorage = useSelector(state => state.orderManager.cartLoadedFromStorage);
  const cart = useSelector(state => state.orderManager.cart);
  const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts);
  const usedCredit = useSelector(state => state.orderManager.usedCredit);

    const total = calculateTotalPrice(products, selectedDiscounts, usedCredit);
  
  const Finalcharge = { type: CHARGE_INFO_TYPES.TOTAL, value: total }

  if(products.length == 0) return null;
  
  return (
    <>
      {
        <div className='items-list' style={{}}>
          <ul>
            {
              products.map((product, index) => (
                <CartItem key={index} item={product} />
              ))
            }
            <ChargeInfo visible={!cartIsEmpty} charge={Finalcharge}/>
          </ul>
          <Discount visible={!cartIsEmpty && isNotCartComponent}/>
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