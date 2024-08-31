import React, { useEffect, useState } from "react";
import "../styles/ProductPage.css";
import ImageSlider from "../components/js/ImageSlider";
import CheckOutItemsList from "../components/js/CheckOutItemsList";
import AddressSelector from "../components/js/AddressSelector";
import { ONE_ITEM_CHECKOUT } from "../constants/stateKeys";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Paths from '../constants/navigationPages';
import DEFAULT_VALUES from "../constants/defaultValues";
import GoHomeBtn from "../components/js/GoHomeBtn";
import UpSell from "../components/js/UpSell";
import { addOneItemCheckout, clearOneItemCheckout } from "../redux/ducks/orderManager";
import OrderButton from "../components/js/OrderButton";
import { resetLoading, triggerLoading } from "../redux/ducks/appVars";
import LoadingAnimation from "../components/js/LoadingAnimation";
import { setAddress, setProducerImg, setRecommendations } from "../redux/ducks/productPageManager";
import { loadProductPageData } from "../utils/firestoreUtils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import AddressSlide from "../components/js/AddressSlide";
import { getOperatingTime, isOperatingTime } from "../utils/appUtils";
import { FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../constants/firebase";
import ProductPageProductInfoSection from "../components/js/ProductPageProductInfoSection";
import ProductOptions from "../components/js/ProductOptions";

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let product = DEFAULT_VALUES.PRODUCT;
  product = useSelector(state => state.productPageManager.product);
  const productId = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID}`];
  const productName = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.NAME}`];
  const productFullName = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.FULL_NAME}`];
  const recommendationsIds = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.MATCHING_PRODUCTS}`];
  const producerInfo = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PRODUCER}`];
  const ProducerId = producerInfo[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.PRODUCER.ID}`];
  const isDescriptionExpanded = useSelector(state => state.productPageManager.isDescriptionExpanded);
  const productIsRealeasedToPublic = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE}`];
  const productExists = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS}`] == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.present;
  const productInStock = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.IN_STOCK}`];
  const prepTime = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES}`]
  const prepTimeString = `${prepTime} ${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREP_TIME_IN_MINUTES}`;
  const prepTimeType = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES;
  const producerImg = useSelector(state => state.productPageManager.producerImg);
  const customerId = useSelector(state => state.appVars.customerId);
  const customer = useSelector(state => state.appVars.customerDetails);
  const homePageVisited = useSelector(state => state.appVars.homePageVisited);
  const homePageNotVisited = !homePageVisited;
  const addresses = useSelector(state => state.productPageManager.addresses);;
  const [showNotes, setShowNotes] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const recommendations = useSelector(state => state.productPageManager.recommendations);
  // Get available time for the product
  const days = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS}`];
  const daysType = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS;
  const hours = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS}`];
  const operatingTime = getOperatingTime(days, hours);//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'  
  // are we in operating time for this product
  const daysSpecificHoursNotSet = !product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS_SPECIFIC_HOURS_SET}`];
  const weAreInOperatingTime = isOperatingTime(days, hours, daysSpecificHoursNotSet);  
  const placingOrderAllowed = productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock;
  const upsell = (recommendations.length > 0) && placingOrderAllowed;

    
    // check if preorder is set
    const preOrderSet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREORDER_SET}`];
    const preOderPeriod = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREORDER_PERIOD_IN_HOURS}`];
    const preOrderInfoString = `pre Order (${preOderPeriod}${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREORDER_PERIOD_IN_HOURS})`;
    const availabilityInfoString = preOrderSet? preOrderInfoString : operatingTime;

    //allow customer to checkout if the product is released to the public
    //AND product Exists
    //AND the merchant is in operating time to sell this product
    //AND the product is in stock
    const checkoutAvailable = productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock;


  useEffect(() => {
    //console.log(product);
    //behind scenes work
    if (homePageVisited) {
      load()
      //done with behind scenes work
      dispatch(resetLoading());      
    }


    return () => {
      dispatch(triggerLoading());
      dispatch(clearOneItemCheckout());
    }
  }, [])

  const load = async () => {
    dispatch(addOneItemCheckout(product));
    const data = await loadProductPageData(productId ,ProducerId, recommendationsIds);
    dispatch(setProducerImg(data.producer['image-src']));
    //console.log('data',data);
    dispatch(setRecommendations(data.recommendations));
    //dispatch(setReviews(data.reviews));
  }
  


  useEffect(() => {
    if (!product || product['is-default-value'] || homePageNotVisited) {
      navigate(Paths.HOME);
    }
  }, [product, navigate]);

  useEffect(() => {
    console.log("addresses", addresses);
  }, [addresses]);
  
  


  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setShowNotes(true);
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // If product is not available, return null or a loading state
  if (!product || product == null) {
    return null; // Or you can return a loading spinner or placeholder
  }

  return (
    <div className="product-page">
      <LoadingAnimation/>
      <GoHomeBtn/>
      <AddressSelector/>
      <section className="my-slider-section">
        <Slider {...DEFAULT_VALUES.SLIDER_SETTINGS}>
          {
            addresses.map((v,i) => <AddressSlide key={i} address={v} id={i} />)
          }
        </Slider>
      </section>
      <div className="image-slider-wrapper">
        <ImageSlider images={product['images-src']} />
      </div>



      <div className="product-details">
        <h1 className="product-name">{productFullName}</h1>
        <ProductOptions variants={('variants' in product?product.variants:[])} />
        <ProductPageProductInfoSection type={prepTimeType} info={prepTimeString}/>
        <ProductPageProductInfoSection type={daysType} info={availabilityInfoString}/>        
        <div className="producer-info">
          <img
            src={producerImg}
            alt={product.producer.name}
            className="producer-image"
          />
          <p className="producer-name">by {product.producer.name}</p>
        </div>

        <div className="product-description">
          <p
            className={`description-text ${showFullDescription ? "expanded" : "collapsed"}`}
          >
            {product['full-description']}
          </p>
          <div
            className="toggle-description"
            onClick={handleToggleDescription}
          >
            {showFullDescription ? "< Read Less" : "Read More >"}
          </div>
        </div>
      </div>
      {
        upsell?
        <UpSell />:
        null
      }
      {
        checkoutAvailable?
        <div className="order-summary" >
          <h2 style={{marginLeft:'15px'}}>Order Summary</h2>
          <CheckOutItemsList />
          <OrderButton />
          {
            //<Payment/> when payment is integrated into the website
          }
        </div>:
        null        
      }
    </div>
  );
};

export default ProductPage;
