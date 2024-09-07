import React, { useEffect, useState } from "react";
import "../styles/CartPage.css";
import CheckOutItemsList from "../components/js/CheckOutItemsList";

import { useDispatch, useSelector } from 'react-redux';
import { CART } from "../constants/stateKeys";
import GoHomeBtn from "../components/js/GoHomeBtn";
import OrderButton from "../components/js/OrderButton";
import { resetLoading, triggerLoading, setCurrentPage } from "../redux/ducks/appVars";
import LoadingAnimation from "../components/js/LoadingAnimation";
import Paths from "../constants/navigationPages";
import { useNavigate } from "react-router-dom";
import { saveOrUpdateCartItemToLocalStorage, updateCartItemsInFirebaseFromProductObjList } from "../utils/firestoreUtils";
import Cart from "../components/js/Cart";
import AddressSelector from "../components/js/AddressSelector";
import Slider from "react-slick";
import DEFAULT_VALUES from "../constants/defaultValues";
import AddressSlide from "../components/js/AddressSlide";
import Messages from "../components/js/Messages";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addresses = useSelector(state => state.productPageManager.addresses);
  const cartIsEmpty = useSelector((state) => state.orderManager.cartIsEmpty);
  const cartIsNotEmpty =!cartIsEmpty;
  const cart = useSelector(state => state.orderManager.cart);
  const cartLoadedFromStorage = useSelector(state => state.orderManager.cartLoadedFromStorage);
  const homePageVisited = useSelector(state => state.appVars.homePageVisited);
  const homePageNotVisited = !homePageVisited;
  const currentPage = useSelector(state => state.appVars.currentPage);
  const payClicked = useSelector(state => state.orderManager.intentToPay);
  const payNotClicked =!payClicked;
  const isCartPage = currentPage == Paths.CART;

  useEffect(() => {
    dispatch(setCurrentPage(Paths.CART));
    // make sure visitor came from home page, not from baseurl/cart
    if (homePageVisited) {
      //behind scenes work
      load()
      //done with behind scenes work
      dispatch(resetLoading());      
    }





    return () => {
      dispatch(triggerLoading());
    }
  }, [])

  useEffect(() => {
    if (homePageNotVisited) {
      navigate(Paths.HOME);
    }
  }, [navigate]);

  useEffect(() => {
    //update cart when changed
    //updateCartItemsInFirebaseFromProductObjList
    //console.log('cart updated: ', cart);
    //console.log('cart loaded from storage: ', cartLoadedFromStorage);
    if (cartLoadedFromStorage) {
      saveOrUpdateCartItemToLocalStorage(cart);
      updateCartItemsInFirebaseFromProductObjList(cart);
    };
    return () => {
      //save changes to firestore when leaving cart view
      //if(inCart) updateCartItemsInFirebaseFromProductObjList(cart);
    }
  }, [cart])  

  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 10.0,
      status: "present",
      description: " little short description...",
      image:
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      wishes: 500,
      available: true,
      producer: "Asala",
      availableTime: "Mo,Tu,We,Th,Fr 8-5",
      quantity: 3,
      discount: 10,
    },
    {
      id: 2,
      name: "Product 2",
      price: 20.0,
      status: "future",
      description: " little short description...",
      image:
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      wishes: 700,
      available: true,
      producer: "Asala",
      availableTime: "Mo,Tu,We,Th,Fr 8-5",
      quantity: 5,
      discount: 0,
    },
    {
      id: 3,
      name: "Product 3",
      price: 30.0,
      status: "future",
      description: " little short description...",
      image:
        "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      wishes: 50,
      available: true,
      producer: "Asala",
      availableTime: "Mo,Tu,We,Th,Fr 8-5",
      quantity: 15,
      discount: 50,
    },
  ];

  const load = async () => {
    //behind scenes work
    // fetch cart data from the backend


  };

    //navigate function to change pages
    const navigateToPage = (path) => {
      dispatch(setCurrentPage(path));
      navigate(path);
    }

  const closeCart = () => {
    //behind scenes work
    // save cart data to the backend
    // navigate to home page
    navigate(-1);
  };

  return (
    <div className="cart-page-container" style={{}}>
      <LoadingAnimation/>
      <GoHomeBtn/>
      <span className="cart-page-close-btn" onClick={closeCart}>X</span>
      <h3 style={{padding:'8px'}}>Your Cart</h3>
      
      <div className="cart-items-wrapper">
        <CheckOutItemsList parent={Paths.CART}/>
        {
          cartIsEmpty?
          <p className="cart-empty-text">Your cart is empty</p>:
          null
        }        
        <AddressSelector visible={cartIsNotEmpty && payNotClicked}/>
      <section className={`cart-page-my-slider-section ${(cartIsEmpty || payClicked)? 'invisible':''}`}>
        <Slider {...DEFAULT_VALUES.SLIDER_SETTINGS}>
          {
            addresses.map((v,i) => <AddressSlide key={i} address={v} id={i} />)
          }
        </Slider>
      </section>      
      {
        <OrderButton parent={Paths.CART}/>
      }
      {
        //<Payment/> when payment is integrated into the website
      }        
      </div>
      <Messages />
    </div>
  );
};

export default CartPage;
