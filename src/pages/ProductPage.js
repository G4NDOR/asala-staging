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
import { setAddress, setProducerImg } from "../redux/ducks/productPageManager";
import { loadProductPageData } from "../utils/firestoreUtils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import AddressSlide from "../components/js/AddressSlide";
import { getOperatingTime, isOperatingTime } from "../utils/appUtils";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES } from "../constants/firebase";

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let product = DEFAULT_VALUES.PRODUCT;
  product = useSelector(state => state.productPageManager.product);
  const isDescriptionExpanded = useSelector(state => state.productPageManager.isDescriptionExpanded);
  const producerImg = useSelector(state => state.productPageManager.producerImg);
  const customerId = useSelector(state => state.appVars.customerId);
  const customer = useSelector(state => state.appVars.customerDetails);
  const addresses = customer['is-default-value']?[]:customer['address-list'];
  const [showNotes, setShowNotes] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const recommendations = [];//[...DEFAULT_VALUES.PRODUCTS];
  // Get available time for the product
  const days = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS}`];
  const hours = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS}`];
  const operatingTime = getOperatingTime(days, hours);//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'  
  // are we in operating time for this product
  const daysSpecificHoursNotSet = !product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS_SPECIFIC_HOURS_SET}`];
  const weAreInOperatingTime = isOperatingTime(days, hours, daysSpecificHoursNotSet);  
  const upsell = (recommendations.length > 0) && weAreInOperatingTime;
  

  useEffect(() => {
    console.log(product);
    //behind scenes work
    load();

    //done with behind scenes work
    dispatch(resetLoading());
    return () => {
      dispatch(triggerLoading());
      dispatch(clearOneItemCheckout());
    }
  }, [])

  const load = async () => {
    dispatch(addOneItemCheckout(product));
    const data = await loadProductPageData(product.id ,product.producer.id);
    dispatch(setProducerImg(data.producer['image-src']));
    //dispatch(setReviews(data.reviews));
  }
  


  useEffect(() => {
    if (!product || product['is-default-value']) {
      navigate(Paths.HOME);
    }
  }, [product, navigate]);
  


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
            addresses.map((v,i) => <AddressSlide key={i} address={v.string} id={i} />)
          }
        </Slider>
      </section>
      <div className="image-slider-wrapper">
        <ImageSlider images={product['images-src']} />
      </div>

      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
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
        <UpSell recommendations={recommendations}/>:
        null
      }
      {
        weAreInOperatingTime?
        <div className="order-summary" >
          <h2 style={{marginLeft:'15px'}}>Order Summary</h2>
          <CheckOutItemsList listIdentifier={ONE_ITEM_CHECKOUT}/>
          <OrderButton location={Paths.PRODUCT} />
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
