import React from 'react';
import '../css/CheckOutItemsList.css';
import CartItem from './CartItem';
import {useSelector} from 'react-redux';

const CheckOutItemsList = ({listIdentifier}) => {

  const products = useSelector((state) => state['orderManager'][`${listIdentifier}`]);
  
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