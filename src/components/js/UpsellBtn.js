import React from 'react'
import { FaPlus } from 'react-icons/fa';
import { addOneItemCheckout } from '../../redux/ducks/orderManager';
import { useDispatch } from 'react-redux';
import '../css/UpSellBtn.css'

export default function UpsellBtn({ item }) {
    
    const dispatch = useDispatch();

    const addItemToOneItemCheckout = () => {
        dispatch(addOneItemCheckout(item))
    }

  return (
    <button onClick={addItemToOneItemCheckout} className="upsell-button">
        <FaPlus />
    </button>
  )
}
