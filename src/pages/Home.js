// src/App.js

import React, { useEffect, useState } from "react";
import Cart from "../components/js/Cart";
import "../styles/Home.css";
import ImageSlider from "../components/js/ImageSlider";
import ProductsContainer from "../components/js/ProductsContainer";
import DiscoverSection from "../components/js/DiscoverSection";
import { useDispatch, useSelector } from 'react-redux';
import { resetAnimation, setCart, setCartLoadedFromStorage, triggerAnimation, triggerUnseenChanges } from "../redux/ducks/orderManager";
import { setAnnouncements, setFirstTimePageVisit, setItems, setLastDoc, setWelcomeSectionContent, setWelcomeSectionImages, setWelcomeSectionTitle } from "../redux/ducks/homePageManager";
import LoadMoreBtn from "../components/js/LoadMoreBtn";
import DEFAULT_VALUES from "../constants/defaultValues";
import LoadingAnimation from "../components/js/LoadingAnimation";
import { resetLoading, setCustomerDetails, setCustomerId, setHomePageVisited, triggerLoading } from "../redux/ducks/appVars";
import { getIpAddress } from "../utils/retreiveIP_Address";
import { getCollection, loadHomeData, saveOrUpdateCartItemToLocalStorage, updateCartItemsInFirebaseFromProductObjList } from "../utils/firestoreUtils";
import { setAddress, setAddresses } from "../redux/ducks/productPageManager";
import SearchItem from "../components/js/SearchItem";
import Receipt from "../components/js/Receipt";
import ButtonsContainer from "../components/js/ButtonsContainer";
import { FIREBASE_CLLECTIONS_NAMES } from "../constants/firebase";
import { createAndDownloadJSON } from "../utils/getJsonFile";
import CartPage from "./CartPage";
import CONSTANTS from "../constants/appConstants";
import ConfirmationInfo from "../components/js/ConfirmationInfo";
import Form from "../components/js/Form";
import EmailInput from "../components/js/EmailInput";
import PhoneNumberInput from "../components/js/PhoneNumberInput";



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
  const customer = useSelector(state => state.appVars.customerDetails);
  const cart = useSelector(state => state.orderManager.cart);
  const cartLoadedFromStorage = useSelector(state => state.orderManager.cartLoadedFromStorage);
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

  useEffect(() => {
    //update cart when changed
    //console.log('cart updated: ', cart);
    //console.log('cart loaded from storage: ', cartLoadedFromStorage);
    if (cartLoadedFromStorage) {
      saveOrUpdateCartItemToLocalStorage(cart);
      updateCartItemsInFirebaseFromProductObjList(cart);
    };
  
    return () => {
      //save changes to firestore when leaving cart view
      //updateCartItemsInFirebaseFromProductObjList(cart);
    }
  }, [cart])    

  const showUnseenChangesIndicator = () => {
    dispatch(triggerAnimation());
    dispatch(triggerUnseenChanges());
    setTimeout(() => {
        dispatch(resetAnimation());
      }, 300); // Match this duration to your CSS animation duration
  }


  const load = async () => {
    //behind scenes work
    const data = await loadHomeData();
    //console.log('home data loaded: ', data);
    if (!data) {
      //console.log('Failed to load home data');
      dispatch(resetLoading());
      return;
    }
    //console.log('home data loaded with success: ', data);
    dispatch(setWelcomeSectionImages(data.welcomeImagesSrcs));
    dispatch(setItems(data.products));
    dispatch(setLastDoc(data.productsLastDoc));
    dispatch(setAnnouncements(data.announcements));
    dispatch(setWelcomeSectionContent(data.welcomeSectionContent));
    dispatch(setWelcomeSectionTitle(data.welcomeSectionTitle));
    dispatch(setCustomerId(data.customerId));
    dispatch(setCustomerDetails(data.customer));
    //if there's cart data from previous session show that to visitor
    if (data.cart.length > 0) showUnseenChangesIndicator();
    dispatch(setCart(data.cart));
    dispatch(setCartLoadedFromStorage(true));
    dispatch(setAddresses(data.addresses));
    if(data.addresses.length > 0) dispatch(setAddress(data.addresses[0]));
    dispatch(setFirstTimePageVisit(false));

    //done with behind scenes work
    //console.log('stop Loading');
    dispatch(resetLoading());      
  }


  const loadMore = ()=>{
    setHasMoreItems(false);
    setTimeout(() => {
      setHasMoreItems(true);
    }, 10000);
  }

  //util functions for buttons
  

  // For retreiving object strucred a sjson from firebase, remove when have a dashboard to manage firebase documents
/*
  // buttons needed for home page
  const getCustomerJsonFile = {
    active: true,
    visible: true,
    generalContent: "Get a customer json file",
    activeAction: createAndDownloadJSON,
    params:{
      data: customer,
      name: FIREBASE_CLLECTIONS_NAMES.CUSTOMERS,
    }
  }
  const getProductJsonFile = {
    active: true,
    visible: true,
    generalContent: "Get a product json file",
    activeAction: createAndDownloadJSON,
    params:{
      data: items[0],
      name: FIREBASE_CLLECTIONS_NAMES.PRODUCTS,
    }
  }
  const getAnnouncementJsonFile = {
    active: true,
    visible: true,
    generalContent: "Get an announcements json file",
    activeAction: createAndDownloadJSON,
    params:{
      data: announcements[0],
      name: FIREBASE_CLLECTIONS_NAMES.ANNOUNCEMENTS,
    }
  }

  const buttonsDetails = [
    getCustomerJsonFile,
    getProductJsonFile,
    getAnnouncementJsonFile,
  ]
*/

  const appStyle = {
    //padding: '20px',
    fontFamily: "Arial, sans-serif",
    maxWiDth: '100vw',
    overFlow: 'hidden'
  };

  const containerStyle = {
    //width: '90%',
    //maxWidth: '1200px',
    //padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa'
  };

  return (
    <div style={appStyle}>
      {
        <LoadingAnimation/>
        //<L2/>
      }
      
      <div className="container" style={containerStyle}>
        
        
        <SearchItem />
        <Cart />
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
        {
          //<ConfirmationInfo paymentMethod={CONSTANTS.PAYMENT_METHODS.CASH}/>
        }
        {
          //<Form />
        }
      </div>
    </div>
  );
};

export default Home;
