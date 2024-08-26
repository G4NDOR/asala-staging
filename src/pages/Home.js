// src/App.js

import React, { useEffect, useState } from "react";
import Cart from "../components/js/Cart";
import "../styles/Home.css";
import ImageSlider from "../components/js/ImageSlider";
import ProductsContainer from "../components/js/ProductsContainer";
import DiscoverSection from "../components/js/DiscoverSection";
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from "../redux/ducks/orderManager";
import { setAnnouncements, setFirstTimePageVisit, setItems, setLastDoc, setWelcomeSectionContent, setWelcomeSectionImages, setWelcomeSectionTitle } from "../redux/ducks/homePageManager";
import LoadMoreBtn from "../components/js/LoadMoreBtn";
import DEFAULT_VALUES from "../constants/defaultValues";
import LoadingAnimation from "../components/js/LoadingAnimation";
import { resetLoading, setCustomerDetails, setCustomerId, setHomePageVisited, triggerLoading } from "../redux/ducks/appVars";
import { getIpAddress } from "../utils/retreiveIP_Address";
import { getCollection, loadHomeData } from "../utils/firestoreUtils";
import { setAddress } from "../redux/ducks/productPageManager";
import SearchItem from "../components/js/SearchItem";
import Receipt from "../components/js/Receipt";
import ButtonsContainer from "../components/js/ButtonsContainer";



const Home = () => {
  const dispatch = useDispatch();
  const images = useSelector(state => state.homePageManager.welcomeSectionImages);
  const announcements = useSelector((state) => state.homePageManager.announcements);
  const items = useSelector(state => state.homePageManager.items);
  const title = useSelector(state => state.homePageManager.welcomeSectionTitle);
  const content = useSelector(state => state.homePageManager.welcomeSectionContent);
  const loadingMore = useSelector(state => state.homePageManager.loadingMore);
  const searching = useSelector(state => state.homePageManager.searching);
  const firstVisit = useSelector(state => state.homePageManager.firstTimePageVisit);
  const homePageVisited = useSelector(state => state.appVars.homePageVisited);
  //console.log('home page visited d: ', homePageVisited);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const products = DEFAULT_VALUES.PRODUCTS;

  //dispatch(setCart(products));
  //dispatch(setItems(products));

  const ipAddress = getIpAddress();

  useEffect(() => {
    //behind scenes work
    dispatch(setHomePageVisited(true));
    if(firstVisit) load();
    else     //done with behind scenes work
      dispatch(resetLoading());      
  
    return () => {
      dispatch(triggerLoading());
      //console.log('home page visited end: ', homePageVisited);
    }
  }, [])


  const load = async () => {
    //behind scenes work
    const data = await loadHomeData();
    console.log('home data loaded: ', data);
    if (!data) {
      console.log('Failed to load home data');
      dispatch(resetLoading());
      return;
    }
    console.log('home data loaded with success: ', data);
    dispatch(setWelcomeSectionImages(data.welcomeImagesSrcs));
    dispatch(setItems(data.products));
    dispatch(setLastDoc(data.productsLastDoc));
    dispatch(setAnnouncements(data.announcements));
    dispatch(setWelcomeSectionContent(data.welcomeSectionContent));
    dispatch(setWelcomeSectionTitle(data.welcomeSectionTitle));
    dispatch(setCustomerId(data.customerId));
    dispatch(setCustomerDetails(data.customer));
    dispatch(setAddress(data.customer['address-list'][0].string));
    dispatch(setFirstTimePageVisit(false));

    //done with behind scenes work
    console.log('stop Loading');
    dispatch(resetLoading());      
  }


  const loadMore = ()=>{
    setHasMoreItems(false);
    setTimeout(() => {
      setHasMoreItems(true);
    }, 10000);
  }
  


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
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={appStyle}>
      {
        <LoadingAnimation/>
        //<L2/>
      }
      
      <div style={containerStyle}>
        <Cart />
        
        <SearchItem />
        <div className="image-slider-wrapper">
          <ImageSlider images={images} />
          <div className="welcome-text">
            <h1 className="title" >{title} </h1>
            <p className="paragraph" >{content} {DEFAULT_VALUES.COMMIT_NUMBER}</p>
          </div>
        </div>
        {
          (announcements.length > 0)?
          <DiscoverSection />:
          <></>
        }
        {
          items.length > 0?
          <ProductsContainer />:
          <>
          {
            loadingMore?
            <></>:
            <p style={{ textAlign:'center'}} >No items found</p>
          }          
          </>          
        }
        <LoadMoreBtn 
          loadMoreItems={loadMore}
          hasMoreItems={hasMoreItems}
        />
        {
          //<Receipt/>
        }
        
        
      </div>
    </div>
  );
};

export default Home;
