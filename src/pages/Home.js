// src/App.js

import React, { useEffect, useState } from "react";
import Cart from "../components/js/Cart";
import "../styles/Home.css";
import ImageSlider from "../components/js/ImageSlider";
import ProductsContainer from "../components/js/ProductsContainer";
import DiscoverSection from "../components/js/DiscoverSection";
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from "../redux/ducks/orderManager";
import { setItems } from "../redux/ducks/homePageManager";
import LoadMoreBtn from "../components/js/LoadMoreBtn";
import DEFAULT_VALUES from "../constants/defaultValues";
import LoadingAnimation from "../components/js/LoadingAnimation";
import { resetLoading, triggerLoading } from "../redux/ducks/appVars";



const Home = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.homePageManager.items);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const products = DEFAULT_VALUES.PRODUCTS;

  //dispatch(setCart(products));
  dispatch(setItems(products));

  fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => console.log(data.ip))
  .catch(error => console.error('Error:', error));

  useEffect(() => {
    dispatch(resetLoading());
  
    return () => {
      dispatch(triggerLoading());
    }
  }, [])
  


  const loadMore = ()=>{
    setHasMoreItems(false);
    setTimeout(() => {
      setHasMoreItems(true);
    }, 10000);
  }

  const images = [
    'https://www.eatright.org/-/media/images/eatright-landing-pages/foodgroupslp_804x482.jpg?as=0&w=967&rev=d0d1ce321d944bbe82024fff81c938e7&hash=E6474C8EFC5BE5F0DA9C32D4A797D10D',
    'https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
    // Add more image URLs here
  ];


  const appStyle = {
    //padding: '20px',
    fontFamily: "Arial, sans-serif",
    maxWisth: '100vw',
    overFlow: 'hidden'
  };

  const containerStyle = {
    //width: '90%',
    //maxWidth: '1200px',
    margin: "0 auto",
    //padding: '20px 0',
  };

  return (
    <div style={appStyle}>
      {
        <LoadingAnimation/>
        //<L2/>
      }
      <div style={containerStyle}>
        <Cart products={products} />
        <div className="image-slider-wrapper">
          <ImageSlider images={images} />
          <div className="welcome-text">
            <h1>Welcome to Our Store</h1>
            <p>Discover the best products just for you! {DEFAULT_VALUES.COMMIT_NUMBER}</p>
          </div>
        </div>
        {
          items.length > 0?
          <>
          <DiscoverSection />
          <ProductsContainer />
          <LoadMoreBtn 
          loadMoreItems={loadMore}
          hasMoreItems={hasMoreItems}
        />
          </>:
          <></>
        }
        
      </div>
    </div>
  );
};

export default Home;
