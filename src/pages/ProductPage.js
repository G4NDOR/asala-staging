import React, { useEffect, useState } from "react";
import "../styles/ProductPage.css";
import ImageSlider from "../components/js/ImageSlider";
import CheckOutItemsList from "../components/js/CheckOutItemsList";
import Payment from "../components/js/Payment";
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

const ProductPage = () => {
  const dispatch = useDispatch();
  let product = DEFAULT_VALUES.PRODUCT;
  product = useSelector(state => state.productPageManager.product);
  const isDescriptionExpanded = useSelector(state => state.productPageManager.isDescriptionExpanded);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const recommendations = [];//[...DEFAULT_VALUES.PRODUCTS];
  const upsell = recommendations.length > 0;

  useEffect(() => {
    dispatch(addOneItemCheckout(product));
    return () => {
      dispatch(clearOneItemCheckout());
    }
  }, [])
  


  useEffect(() => {
    if (!product) {
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
  if (!product) {
    return null; // Or you can return a loading spinner or placeholder
  }

  return (
    <div className="product-page">
      <GoHomeBtn/>
      <AddressSelector/>
      <div className="image-slider-wrapper">
        <ImageSlider images={product.images} />
      </div>

      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
        <div className="producer-info">
          <img
            src={product.producerImage}
            alt={product.producer}
            className="producer-image"
          />
          <p className="producer-name">by {product.producer}</p>
        </div>

        <div className="product-description">
          <p
            className={`description-text ${showFullDescription ? "expanded" : "collapsed"}`}
          >
            {product.fullDescription}
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
      <div className="order-summary" >
        <h2 style={{marginLeft:'15px'}}>Order Summary</h2>
        <CheckOutItemsList listIdentifier={ONE_ITEM_CHECKOUT}/>
        <OrderButton location={Paths.PRODUCT} />
        {
          //<Payment/> when payment is integrated into the website
        }
      </div>
    </div>
  );
};

export default ProductPage;
