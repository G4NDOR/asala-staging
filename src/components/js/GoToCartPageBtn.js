import React from 'react'
import Paths from '../../constants/navigationPages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../css/GoToCartPageBtn.css'
import { setCartIsOpen } from '../../redux/ducks/orderManager';

export default function GoToCartPageBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartIsEmpty = useSelector(state => state.orderManager.cartIsEmpty);

    const handleCartBtnClick = () => {
      dispatch(setCartIsOpen(false));
      navigate(Paths.CART); // Programmatically navigate to the /cart route
    }

  return (
    <button disabled={cartIsEmpty} className={`go-to-cart-btn ${cartIsEmpty?'disabled':''}`} onClick={handleCartBtnClick}>
        Finish
    </button>
  )
}
