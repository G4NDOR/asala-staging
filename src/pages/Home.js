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
import { resetLoading, setBaseDeliveryDistance, setBaseDeliveryFee, setCurrentPage, setCustomerDetails, setCustomerId, setDeliveryPricePerMile, setDeliveryRange, setDeliverySpeed, setEmail, setHomePageVisited, setPhoneNumber, setReturnPolicy, setTaxFee, setWebsite, triggerLoading } from "../redux/ducks/appVars";
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
import Message from "../components/js/Message";
import Messages from "../components/js/Messages";
import Paths from "../constants/navigationPages";



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
    dispatch(setCurrentPage(Paths.HOME));
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
    if (data.welcomeImagesSrcs) dispatch(setWelcomeSectionImages(data.welcomeImagesSrcs));
    dispatch(setItems(data.products));
    dispatch(setLastDoc(data.productsLastDoc));
    dispatch(setAnnouncements(data.announcements));
    dispatch(setWelcomeSectionContent(data.welcomeSectionContent));
    dispatch(setWelcomeSectionTitle(data.welcomeSectionTitle));
    dispatch(setCustomerId(data.customerId));
    dispatch(setCustomerDetails(data.customer));
    //if there's cart data from previous session show that to visitor
    console.log('cart data from previous session: ', data.cart);
    if (data.cart.length > 0) showUnseenChangesIndicator();
    dispatch(setCart(data.cart));
    dispatch(setCartLoadedFromStorage(true));
    dispatch(setAddresses(data.addresses));
    if(data.addresses.length > 0) dispatch(setAddress(data.addresses[0]));
    dispatch(setFirstTimePageVisit(false));
    dispatch(setDeliveryRange(data.deliveryRange))
    dispatch(setBaseDeliveryFee(data.baseDeliveryFee))
    dispatch(setBaseDeliveryDistance(data.baseDeliveryDistance))
    dispatch(setDeliveryPricePerMile(data.deliveryPricePerMile))
    dispatch(setTaxFee(data.taxFee))
    //email,
    //website,
    //returnPolicy,
    //phoneNumber,
    dispatch(setEmail(data.email))
    dispatch(setWebsite(data.website))
    dispatch(setReturnPolicy(data.returnPolicy))
    dispatch(setPhoneNumber(data.phoneNumber))
    dispatch(setDeliverySpeed(data.deliverySpeed))
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

  const test = async () => {
    // window.open('https://sandbox.square.link/u/qjO2S6OM', '_blank');
    const rawData = {
      idempotencyKey: window.crypto.randomUUID(),
      description: "description ...",
      locationId:DEFAULT_VALUES.SAND_BOX_LOCATION_ID,
      lineItems:[
        {
          name: 'wa',
          quantity: '3',
          basePriceMoney: {
            amount: 200,
            currency: 'USD'
          }
        },
        {
          name: 'fa',
          quantity: '2',
          appliedDiscounts: [
            {
              uid: '00001',
              discountUid: '0000'
            }
          ],
          basePriceMoney: {
            amount: 500,
            currency: 'USD'
          }
        }
      ],
      discounts:[
        {
          uid: '0000',
          name: 'out Of Stock Discount',
          type: 'FIXED_PERCENTAGE',
          percentage: '10.00',
          scope: 'LINE_ITEM'
        }
      ],
      paymentNote: "payment notes ...",
    }    
    const body = JSON.stringify({post: 'yes'});
    // const paymentResponse = await fetch('/test', {
      // method: 'GET',
      // headers: {
        // 'Content-Type': 'application/json',
      // },
    // }).then(response=> response.json());
    const localLink = 'http://localhost:5001/asala-staging/us-central1/testFunction'
    const developement = 'https://us-central1-asala-staging.cloudfunctions.net/testFunction'
    const production = '/test'
    const paymentResponse = await fetch(developement, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    // console.log('paymentResponse: ', paymentResponse);
    // console.log('paymentResponse.body: ', paymentResponse.body);
    if (paymentResponse.ok) {
      const res = await paymentResponse.json();
      console.log('Payment response:', res);
      return //paymentResponse.json();
    }
    //const paymentResponse2 = await fetch('http://localhost:5001/asala-staging/us-central1/hello-world', {
    //  method: 'POST',
    //  headers: {
    //    'Content-Type': 'application/json',
    //  },
    //  body,
    //});
    //if (paymentResponse2.ok) {
    //  console.log('Payment response:', await paymentResponse2.json());
    //  // return paymentResponse2.json();
    //}    
    console.log('Failed to get payment response', paymentResponse);
    // return null;
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

  return (
    <div className="home-page-container-wrapper" >
      {
        <LoadingAnimation/>
        //<L2/>
      }
      
      <div className="container">
        
      {
        //<button onClick={test}>Test</button>
      }
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
        <Messages/>
      </div>
    </div>
  );
};

export default Home;
