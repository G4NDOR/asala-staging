import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../../constants/appConstants";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../../constants/firebase";
import Paths from "../../constants/navigationPages";
import { addMessage, addToWishList, setCurrentPage, triggerLoading } from "../../redux/ducks/appVars";
import { setProductSelectedId } from "../../redux/ducks/homePageManager";
import { addItemToCart, resetAnimation, triggerAnimation, triggerUnseenChanges } from "../../redux/ducks/orderManager";
import { setProduct } from "../../redux/ducks/productPageManager";
import { getOperatingTime, isOperatingTime } from "../../utils/appUtils";
import { wishItem } from "../../utils/firestoreUtils";
import "../css/ProductCard.css";
import AddToCartButton from "./AddToCartButton";
import Button from "./Button";
import ButtonsContainer from "./ButtonsContainer";
import BuyItemButton from "./BuyItemButton";
import ImageSlider from "./ImageSlider";
import WishButton from "./WishButton";

const ProductCard = ({product}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishList = useSelector(state => state.appVars.wishList);
  const cartIsOpen = useSelector(state => state.orderManager.cartIsOpen);
  const customerId = useSelector(state => state.appVars.customerId);


  if (!product || product == null) return null;

  const { id, name, price, description, status, wishes, available, producer } = product;
  const images = product['images-src'];
  const image = product['image-src'];
  const producerName = producer[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.NAME}`];
  const productIsRealeasedToPublic = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.AVAILABLE}`];
  const wishListCount = wishes.length;
  const calculatedWishes = wishListCount + (wishList.includes(id)? 1 : 0);

  const alreadyWished = wishes.includes(customerId);
  const alreadyWishedInLocal = alreadyWished? alreadyWished: wishList.includes(id);
  const notWished =!alreadyWishedInLocal;
  const productInStock = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.IN_STOCK}`];
  const productNotInStock = !productInStock;
  const productExists = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS}`] == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.present;
  const productDoesNotExistYet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.STATUS}`] == FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.STATUS.future;


  // Get available time for the product
  const daysSpecificHoursSet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS_SPECIFIC_HOURS_SET}`];
  const daysSpecificHoursNotSet = !daysSpecificHoursSet;
  const schedule = product.schedule;
  const days = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DAYS}`];
  const hours = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS}`];
  const operatingTimesArray = getOperatingTime(schedule, daysSpecificHoursSet);//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'
  const operatingTime = operatingTimesArray.map((element, index) => (<span key={index}>{element}</span>));
  
  // check if preorder is set
  const preOrderSet = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREORDER_SET}`];
  const preOderPeriod = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREORDER_PERIOD_IN_HOURS}`];
  const preOrderInfoString = `pre Order (${preOderPeriod}${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREORDER_PERIOD_IN_HOURS})`;
  const availabilityInfoString = preOrderSet? preOrderInfoString : operatingTime;

  // are we in operating time for this product
  const weAreInOperatingTime = isOperatingTime(schedule);
  const weAreNotInOperatingTime =!weAreInOperatingTime;

  //prepare time
  const prepTime = product[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.PREP_TIME_IN_MINUTES}`];
  const prepTimeInfoString = `${prepTime}${FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.PREP_TIME_IN_MINUTES}`;
  const prepTimeInfo = preOrderSet?'':prepTimeInfoString;
  

  //navigate function to change pages
  const navigateToPage = (path) => {
    dispatch(setCurrentPage(path));
    navigate(path);
  }



  const deselect = () => {
    dispatch(setProductSelectedId(DEFAULT_VALUES.PRODUCT.id));
  }

    //util functions for button actions
    const goToProductPage = ({product}) => {
      dispatch(triggerLoading());
      dispatch(setProduct(product));
      navigateToPage(Paths.PRODUCT);   
    }

  // buttons needed for the product card
  const GoToProductPageButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "More",
    generalClassName: "home-page-product-card-go-to-product-page-button",
    activeAction: goToProductPage,
    params:{
      product
    }
  }
  const AddToCartButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productInStock,
    activeContent: "Add to Cart",
    generalClassName: "home-page-product-card-add-to-cart-button",
    activeAction: ({product}) => {
      const cartIsClosed = !cartIsOpen;
      dispatch(addItemToCart(product));
      dispatch(triggerAnimation());
      if(cartIsClosed){
          dispatch(triggerUnseenChanges());
      }
      setTimeout(() => {
          dispatch(resetAnimation());
        }, 300); // Match this duration to your CSS animation duration
    },
    params:{
      product
    }
  }
  const notInStockButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreInOperatingTime && productNotInStock,
    generalContent: "Out of Stock",
    generalClassName: "home-page-product-card-not-in-stock-button",
    activeAction: goToProductPage,
    params:{
      product
    }
  }
  const ItemUnavailableButtonDetails = {
    visible: productIsRealeasedToPublic && productExists && weAreNotInOperatingTime,
    activeContent: "Unavailable",
    generalClassName: "home-page-product-card-item-unavailable-button",
    activeAction: goToProductPage,
    params:{
      product
    }
  }
  const WishButtonDetails = {
    active: notWished,
    visible: productIsRealeasedToPublic && productDoesNotExistYet,
    generalContent: `Wish (${calculatedWishes})`,
    generalClassName: "home-page-product-card-wish-button",
    activeClassName: "home-page-product-card-wish-button-active",
    notActiveClassName: "home-page-product-card-wish-button-not-active",
    activeAction: ({customerId, id}) => {
      wishItem(customerId, id);
      //console.log("wish item");
      dispatch(addToWishList(id));
    },
    params:{
      customerId: customerId,
      id: id,
    }
  }


  

  const buttonsDetails = [
    GoToProductPageButtonDetails,
    AddToCartButtonDetails,
    notInStockButtonDetails,
    ItemUnavailableButtonDetails,
    WishButtonDetails 
  ]

  return (
    <div onClick={deselect} className="product-card-1">
      <div className="product-image">
        <ImageSlider images={images} />
      </div>
      <div className="product-info">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">
          ${price.toFixed(2)} 
          <span className="product-card-prep-time">
          {`  ${prepTimeInfo}`}
          </span>
        </p>
        <p className="product-description">{description}</p>
        <p className="product-availability">{availabilityInfoString}</p>
        <p className="product-producer">by {producerName}</p>
        <ButtonsContainer buttonsDetails={buttonsDetails}/>
      </div>
    </div>
  );
};

export default ProductCard;
