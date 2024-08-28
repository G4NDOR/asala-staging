import React, { useEffect } from 'react';
import '../css/CheckOutItemsList.css';
import CartItem from './CartItem';
import {useSelector} from 'react-redux';
import { saveOrUpdateCartItemToLocalStorage, updateCartItemsInFirebaseFromProductObjList } from '../../utils/firestoreUtils';
import { CART } from '../../constants/stateKeys';

const CheckOutItemsList = ({listIdentifier}) => {

  const cart = useSelector(state => state.orderManager.cart);
  const products = useSelector((state) => state['orderManager'][`${listIdentifier}`]);
  //we are in cart view and not oneItemCheckout
  const inCart = listIdentifier === CART;
  const cartLoadedFromStorage = useSelector(state => state.orderManager.cartLoadedFromStorage);


  
  return (
    <div className='items-list' style={{}}>
      <ul style={{

      }}>
        {
          products.map((product, index) => (
            <CartItem key={index} listIdentifier={listIdentifier} item={product} />
          ))
        }
      </ul>
    </div>
  );
};

export default CheckOutItemsList;