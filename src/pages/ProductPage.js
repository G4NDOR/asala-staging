import React, { useEffect, useRef, useState } from "react";
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
import Cart from "../components/js/Cart";
import { addItemToCart, addOneItemCheckout, clearOneItemCheckout, resetAnimation, triggerAnimation, triggerUnseenChanges } from "../redux/ducks/orderManager";
import OrderButton from "../components/js/OrderButton";
import { addMessage, resetLoading, setCurrentPage, triggerLoading } from "../redux/ducks/appVars";
import LoadingAnimation from "../components/js/LoadingAnimation";
import { setAddress, setProducerImg, setRecommendations } from "../redux/ducks/productPageManager";
import { getImages, loadProductPageData } from "../utils/firestoreUtils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import AddressSlide from "../components/js/AddressSlide";
import { getOperatingTime, getProductToAdd, isOperatingTime } from "../utils/appUtils";
import { FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../constants/firebase";
import ProductPageProductInfoSection from "../components/js/ProductPageProductInfoSection";
import ProductOptions from "../components/js/ProductOptions";
import ButtonsContainer from "../components/js/ButtonsContainer";
import CONSTANTS from "../constants/appConstants";
import Messages from "../components/js/Messages";

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [scroll, setScroll] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [images, setImages] = useState(DEFAULT_VALUES.IMAGES['full-images']);
  let product = DEFAULT_VALUES.PRODUCT;
  product = useSelector(state => state.productPageManager.product);
  const products = useSelector(state => state.orderManager.oneItemCheckout);
  const isDescriptionExpanded = useSelector(state => state.productPageManager.isDescriptionExpanded);
  const producerImg = useSelector(state => state.productPageManager.producerImg);
  const customerId = useSelector(state => state.appVars.customerId);
  const customer = useSelector(state => state.appVars.customerDetails);
  const cartIsOpen = useSelector(state => state.orderManager.cartIsOpen);
  const addresses = useSelector(state => state.productPageManager.addresses);;
  const recommendations = useSelector(state => state.productPageManager.recommendations);
  const selectedVariants = useSelector(state => state.productPageManager.selectedVariants);
  const homePageVisited = useSelector(state => state.appVars.homePageVisited);
  const variantsFields = useSelector(state => state.productPageManager.variantsFields);
  const startIndex = useSelector(state => state.productPageManager.startIndex);
  const selectedOptionalAdditionsObj = useSelector(state => state.productPageManager.selectedOptionalAdditions);
  const [showNotes, setShowNotes] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const initialize = async () => {
    const imagesPaths = (product['images'] || {'full-images': []})['full-images'];
    const images = await getImages(imagesPaths);
    if(images) setImages(images);
    setInitialized(true);
  }

  useEffect(() => {
    //behind scenes work
    dispatch(setCurrentPage(Paths.PRODUCT));
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

  useEffect(() => {
    if(scroll && scrollRef.current){
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      setScroll(false);
    }
  }, [scroll, scrollRef])

  useEffect(() => {
    if (!product || product['is-default-value'] || homePageNotVisited) {
      navigate(Paths.HOME);
    }
  }, [product, navigate]);

  // If product is not available, return null or a loading state
  if (!product || product == null) {
    return null; // Or you can return a loading spinner or placeholder
  }


  const productId = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.ID}`];
  const productName = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.NAME}`];
  const productFullName = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.FULL_NAME}`];
  const recommendationsIds = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.MATCHING_PRODUCTS}`];
  const producerInfo = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PRODUCER}`];
  const ProducerId = producerInfo[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.PRODUCER.ID}`];
  const productIsRealeasedToPublic = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE}`];
  const productExists = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS}`] == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.present;
  const productInStock = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.IN_STOCK}`];
  const prepTime = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES}`]
  const prepTimeString = `${prepTime} ${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREP_TIME_IN_MINUTES}`;
  const prepTimeType = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES;

  const homePageNotVisited = !homePageVisited;


  
  const productVariants = product.variants || [];
  const productHasVariants = productVariants.length > 0;
  const productDoesNotHaveVariants =!productHasVariants;
  const selectedVariantsArray = Object.values(selectedVariants);
  const theSelectedChildVariant = selectedVariantsArray.length > 0? selectedVariantsArray[selectedVariantsArray.length - 1]: {price: null};
  const variantsSelected = theSelectedChildVariant.price !== null;

  const selectedOptionalAdditionsArrays = Object.values(selectedOptionalAdditionsObj);
  const selectedOptionalAdditions = selectedOptionalAdditionsArrays.flat();
  // Get available time for the product
  const days = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS}`];
  const daysType = FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS;
  const hours = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS}`];
  const daysSpecificHoursSet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS_SPECIFIC_HOURS_SET}`];
  const daysSpecificHoursNotSet = !daysSpecificHoursSet;
  const schedule = product.schedule;
  const operatingTimesArray = getOperatingTime(schedule, daysSpecificHoursSet);//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'
  const operatingTime = operatingTimesArray.map((element, index) => (<span key={index}>{element}</span>));
  // are we in operating time for this product
  const weAreInOperatingTime = isOperatingTime(schedule);  
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



  

  const load = async () => {
    //for default selection, not supported anymore
    //dispatch(addOneItemCheckout(product));
    const data = await loadProductPageData(productId ,ProducerId, recommendationsIds);
    dispatch(setProducerImg(data.producer['image-src']));
    //console.log('data',data);
    dispatch(setRecommendations(data.recommendations));
    //dispatch(setReviews(data.reviews));
    if(!initialized) initialize();
  }
  



  
  


  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setShowNotes(true);
  };

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };



  //util functions for button actions
  const BUY_ITEM_BUTTON_ACTION_NAME = 'buy-item';
  const ADD_TO_CART_BUTTON_ACTION_NAME = 'add-to-cart';



  const addProductToCheckout = ({actionName}) =>{
    const variantsNotSelected = !variantsSelected;
    if(productHasVariants && variantsNotSelected) {
      const message = {content: 'Please select a product option!', severity: CONSTANTS.SEVERITIES.WARNING}
      dispatch(addMessage(message));
      return;
    };
    console.log('selectedVariants: ', selectedVariants)
    const newProduct = getProductToAdd(product, selectedOptionalAdditions, selectedVariants);
    if (actionName == ADD_TO_CART_BUTTON_ACTION_NAME){
      //giving it the product set in this page
      addToCart({product: newProduct});
    } else if (actionName == BUY_ITEM_BUTTON_ACTION_NAME){
      goToProductPageCheckoutSection({product: newProduct});
    }
  }

  const goToProductPageCheckoutSection = ({product}) => {
    dispatch(addOneItemCheckout(product));
    setTimeout(() => {
      setScroll(true); 
    }, 0)
  }

  const addToCart = ({product}) => {
    const cartIsClosed = !cartIsOpen;
    dispatch(addItemToCart(product));
    dispatch(triggerAnimation());
    if(cartIsClosed){
      dispatch(triggerUnseenChanges());
    }
    setTimeout(() => {
      dispatch(resetAnimation());
    }, 300); // Match this duration to your CSS animation duration
  }

  const BuyItemButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Buy Now",
    generalClassName: "product-page-buy-item-button",
    activeAction: addProductToCheckout,
    params:{
      actionName:BUY_ITEM_BUTTON_ACTION_NAME
    }    
  }
  const AddToCartButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Add to Cart",
    generalClassName: "add-to-cart-button",
    activeAction: addProductToCheckout,
    params:{
      actionName:ADD_TO_CART_BUTTON_ACTION_NAME
    }
  }

  const buttonsDetails = [
    BuyItemButtonDetails,
    AddToCartButtonDetails,
  ]

  return (
    <div className="product-page">
      <LoadingAnimation/>
      <GoHomeBtn/>
      <Cart />
      <AddressSelector/>
      <section className="my-slider-section">
        <Slider {...DEFAULT_VALUES.SLIDER_SETTINGS}>
          {
            
            addresses.map((v,i) => {
              //console.log('address ************', v, i)
              return <AddressSlide key={i} address={v} id={i} />;
            })
          }
        </Slider>
      </section>
      <div className="image-slider-wrapper">
        <ImageSlider images={images} />
      </div>



      <div className="product-details">
        <h1 className="product-name">{productFullName}</h1>
        <ProductOptions variants={('variants' in product?product.variants:[])} optionalAdditions={product['optional-additions']} />
        <ProductPageProductInfoSection type={prepTimeType} info={prepTimeString}/>
        <ProductPageProductInfoSection type={daysType} info={availabilityInfoString}/>        
        <ButtonsContainer buttonsDetails={buttonsDetails} />
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
        {
          upsell?
          <UpSell />:
          null
        }        
      </div>

      {
        checkoutAvailable?
        <div className={`order-summary ${products.length > 0? '':'invisible'}`} >
          <h2 style={{marginLeft:'15px'}}>Order Summary</h2>
          <div ref={scrollRef} className="Checkout-section-wrapper">
            <CheckOutItemsList parent={Paths.PRODUCT} />
          </div>
          <OrderButton parent={Paths.PRODUCT}/>
          {
            //<Payment/> when payment is integrated into the website
          }
        </div>:
        null        
      }
      <Messages />
    </div>
  );
};

export default ProductPage;
