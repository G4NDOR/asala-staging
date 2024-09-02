import DEFAULT_VALUES from "../constants/defaultValues";
import { DAY_INDEX_MAP, FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_NAMES, FIREBASE_DOCUMENTS_FEILDS_UNITS } from "../constants/firebase";

/**
 * Generates all possible substrings of a given string.
 * @param {string} str - The input string.
 * @returns {string[]} - An array of all possible substrings.
 * @example
 * // Sample Input:
 * const substrings = getAllSubstrings('abc');
 * console.log(substrings);
 * // Sample Output:
 * // ['a', 'ab', 'abc', 'b', 'bc', 'c']
 */
 export const getAllSubstrings = (str) => {
    const substrings = [];
    
    // Iterate over each starting position
    for (let start = 0; start < str.length; start++) {
      // Iterate over each ending position
      for (let end = start + 1; end <= str.length; end++) {
        substrings.push(str.substring(start, end));
      }
    }
    
    return substrings;
  };
  
  // Example Usage:
  //const substrings = getAllSubstrings('abc');
  //console.log(substrings); // Output: ['a', 'ab', 'abc', 'b', 'bc', 'c']


  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  


  /**
 * Checks if the current time falls within the operating hours for the given days.
 * @param {string[]} days - Array of days of the week.
 * @param {Object[]} hours - Array of objects representing operating hours.
 * @returns {boolean} - True if current time is within operating hours, false otherwise.
 */
export const isOperatingTime = (days, hours, daysSpecificHoursNotSet) => {
    // Get the current date and time
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2); // E.g., 'Mon'
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // E.g., '08:00 AM'
  
    // Map short weekday names to index
    const dayIndexMap = DAY_INDEX_MAP;
  
    // Check if current day is within operating days
    const todayIndex = daysSpecificHoursNotSet? 0 : dayIndexMap[currentDay];
    const dayInOperation = days.includes(currentDay);
    
  
    if (!dayInOperation) {
      return false;
    }
  
    // Check if the current time falls within operating hours for today
    const operatingHours = hours[todayIndex];
    if (operatingHours) {
      const { start, end } = operatingHours;

    // Convert time strings to Date objects
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
      return new Date(`1970-01-01T${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);
    };      
  
      // Convert start and end times to date objects for comparison
      const startTime = parseTime(start);
      const endTime = parseTime(end);
      const currentTimeObj = parseTime(currentTime);
  
      // Check if current time is within the start and end times
      return currentTimeObj >= startTime && currentTimeObj <= endTime;
    }

    
  
    return false;
  };
  
  // Example usage:
  //const days = ["Mo", "Tu", "We"];
  //const hours = [
  //  { start: "08:00 AM", end: "12:00 PM" },
  //  { start: "12:00 PM", end: "04:00 PM" },
  //  { start: "04:00 PM", end: "08:00 PM" }
  //];
  //
  //console.log(isOperatingTime(days, hours)); // Output depends on current time and day


  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  





  function formatTime(time) {
    // Split the time into hours and minutes
    const [hours, minutes] = time.split(':');
    
    // Convert hours to a number to remove leading zero
    const formattedHours = parseInt(hours, 10); // Removes leading zero from hours
    
    // If minutes are "00", return only the hours
    if (minutes === '00') {
        return `${formattedHours}`;
    }
    
    // Otherwise, return the full time with hours and minutes
    return `${formattedHours}:${minutes}`;
  }


  export const getOperatingTime = (days, hours) => {
    const daysString = days.join(',');// ['Mo','Tu','We']=> 'Mo,Tu,We'
    const startTime = hours[0][`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS_START}`].split(' ')[0];//08:00 AM to 08:00
    const endTime = hours[0][`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.HOURS_END}`].split(' ')[0];//12:00 PM to 12:00
    const startTimeFormatted = formatTime(startTime);//08:00 AM to 8
    const endTimeFormatted = formatTime(endTime);//12:00 PM to 12
    const hoursString = [startTimeFormatted, endTimeFormatted].join('-');//['8', '12' ] => '8-12'
    const operatingTime = [daysString,hoursString].join(' ');//['Mo,Tu,We', '8-12'] => 'Mo,Tu,We 8-12'
    return operatingTime;
  }    



  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  



export const generateButtonDetails = ({
  active = null,
  visible = null,
  //content
  generalContent,
  activeContent,
  notActiveContent,
  //className
  generalClassName,
  activeClassName,
  notActiveClassName,
  //actions
  activeAction,
  notActiveAction,
  params
}) => {

  const _active = (active == null)? DEFAULT_VALUES.BUTTON_DETAILS.active: active;
  const _visible = (visible == null)? DEFAULT_VALUES.BUTTON_DETAILS.visible: visible;
  //content
  const _generalContent = !generalContent? DEFAULT_VALUES.BUTTON_DETAILS.generalContent: generalContent;
  const _activeContent = !activeContent? DEFAULT_VALUES.BUTTON_DETAILS.activeContent: activeContent;
  const _notActiveCotent = !notActiveContent? DEFAULT_VALUES.BUTTON_DETAILS.notActiveContent: notActiveContent;
  //className
  const _generalClassName = !generalClassName? DEFAULT_VALUES.BUTTON_DETAILS.generalClassName: generalClassName;
  const _activeClassName = !activeClassName? DEFAULT_VALUES.BUTTON_DETAILS.activeClassName: activeClassName;
  const _notActiveClassName = !notActiveClassName? DEFAULT_VALUES.BUTTON_DETAILS.notActiveClassName: notActiveClassName;
  //actions
  const _activeAction = !activeAction? DEFAULT_VALUES.BUTTON_DETAILS.activeAction: activeAction;
  const _notActiveAction = !notActiveAction? DEFAULT_VALUES.BUTTON_DETAILS.notActiveAction: notActiveAction;
  const _params = !params? DEFAULT_VALUES.BUTTON_DETAILS.params: params;
  

  const buttonDetails = {
    active: _active,
    visible: _visible,
    generalContent: _generalContent,
    activeContent: _activeContent,
    notActiveContent: _notActiveCotent,
    generalClassName: _generalClassName,
    activeClassName: _activeClassName,
    notActiveClasName: _notActiveClassName,
    activeAction: _activeAction,
    notActiveAction: _notActiveAction,
    params: _params
  };
  return buttonDetails;
};



  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  


  //finds the discounts that apply to the specified product
  export const findDiscountsForProduct = (discounts, productId) => {
    console.log('selected discounts', discounts)
    const discountsThatBelongToThisProduct = discounts.filter(discount => {
      const delimiter = '_';//assuming the product id is in the format 'productId_variantId' e.g.
      const noVariantProductId = productId.split(delimiter)[0];
      const discountBelongsToThisProduct = discount.product === noVariantProductId;
      return discountBelongsToThisProduct;
    });
    return discountsThatBelongToThisProduct;
  }

  //checks if the discount should be applied based on the quantity of the item purchased.
  export const findAppliedDiscount = (discounts, quantity) => {
    let appliedDiscount = null;
    const appliedDiscountBasedOnQuantity = discounts.filter(discount => {
      const quantityOnwhichDiscountApplies = discount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.QUANTITY}`];
      const discountShouldApply = quantity >= quantityOnwhichDiscountApplies;
      return discountShouldApply;
    });    
    if (appliedDiscountBasedOnQuantity.length > 0) 
      appliedDiscount = appliedDiscountBasedOnQuantity[0];
    return appliedDiscount;
  }

  //returns the new price based on the old price and the discount amount and its type.
  export const getPriceWithDiscountApplied = (discount, price) => {
    let amountTobeSubtracted = 0;
    const discountType = discount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.TYPE}`];
    const discountValue = discount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.VALUE}`];
    const DISCOUNT_TYPE_PERCENTAGE = FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.TYPE.PERCENTAGE;
    const DISCOUNT_TYPE_FIXED = FIREBASE_DOCUMENTS_FEILDS_UNITS.DISCOUNTS.TYPE.FIXED;
    switch (discountType) {
      case DISCOUNT_TYPE_PERCENTAGE:
        
        amountTobeSubtracted = (discountValue * price) / 100;   
             
        break;
  
      case DISCOUNT_TYPE_FIXED:
        amountTobeSubtracted = discountValue;          
        break;
      default:
        break;
    }

    const priceWithDiscountApplied = price - amountTobeSubtracted; 
    if (priceWithDiscountApplied < 0) return 0;  // In case the discounted price becomes negative, return 0 instead.
    return priceWithDiscountApplied;
  }


  //returns the total price for the given item after applying the discount.
  export const calculatePriceForItem = (appliedDiscount, price, quantity) => {   
    //const appliedDiscount = findAppliedDiscount(discounts, quantity);
    let total = price * quantity;
    if (!appliedDiscount) return total;
    const applyOnSingleItem = appliedDiscount[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.DISCOUNTS.APPLY_ON_SINGLE_ITEM}`];
    if (applyOnSingleItem) {
      const singleItemPriceWithDiscountApplied = getPriceWithDiscountApplied(appliedDiscount, price);
      total = singleItemPriceWithDiscountApplied * quantity;
    } else{
      const priceBasedOnQuantity = price * quantity;
      total = getPriceWithDiscountApplied(appliedDiscount, priceBasedOnQuantity);
    }
    
    return total;
  }




  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  

// takes the products list, discounts list and used credit
//  RETURNS Calculated final total price that the customer will pay
export const calculateTotalListPriceWithAppliedDiscountsAndUsedCredit = (products, selectedDiscounts, usedCredit) => {
  const totalBeforecredit = calculateTotalListPriceWithAppliedDiscounts(products, selectedDiscounts);
  const finalTotal = totalBeforecredit - usedCredit;
  if (finalTotal < 0) return 0;  //if used credit is more than total
  return finalTotal;
}; 

//takes the products list, discounts list
// RETURNS total price with applied discounts (non quantity discounts, and quantity discounts)
export const calculateTotalListPriceWithAppliedDiscounts = (products, selectedDiscounts) => {
  const totalOfAllItemsWithAppliedQuantityDiscounts = calculateTotalListPriceWithAppliedQuantityDiscounts(products, selectedDiscounts)
  
  //discounts that apply to final price not affected by specific items quantities
  const nonQuantityDiscounts = selectedDiscounts.filter(discount => discount.quantity === 0);
  const totalBeforecredit = totalWithAppliedNonQuantityDiscounts(nonQuantityDiscounts, totalOfAllItemsWithAppliedQuantityDiscounts);
  //console.log('totalBeforecredit', totalBeforecredit)
  return totalBeforecredit;
}

// takes total price after applying quantity discounts (discounts that apply on a specific item)
// RETURNS total price with applied non quantity discounts (discounts that apply on the whole order, not on specific items)
const totalWithAppliedNonQuantityDiscounts = (discounts, total) => {
  if(discounts.length === 0) return total;
  const discount = discounts[0];
  const leftDiscounts = discounts.slice(1);
  const totalAfterNonQuantityDiscount = getPriceWithDiscountApplied(discount, total);
  return totalWithAppliedNonQuantityDiscounts(leftDiscounts, totalAfterNonQuantityDiscount);
}


// takes products list, discounts list
// RETURNS total price with applied quantity discounts (discounts that apply on a specific item)
export const calculateTotalListPriceWithAppliedQuantityDiscounts = (products, selectedDiscounts) => {
  const totalOfAllItemsWithAppliedQuantityDiscounts = products.reduce((total, item) => {
    const { id, quantity, price } = item;
    const discountsForThisProduct = findDiscountsForProduct(selectedDiscounts, id);      
    const appliedDiscount = findAppliedDiscount(discountsForThisProduct, quantity);
    const totalOfThisItem = calculatePriceForItem(appliedDiscount, price, quantity);    
    return total + totalOfThisItem;
  }, 0);
  return totalOfAllItemsWithAppliedQuantityDiscounts;
}

//takes products list
// RETURNS total price based on itemss prices and quantities, without discounts (discounts are not applied)
export const calculateTotalListPriceWithoutDiscounts = (products) => {
  const totalOfAllItems = products.reduce((total, item) => {
    const { quantity, price } = item;
    const totalOfThisItem = price * quantity;        
    return total + totalOfThisItem;
  }, 0);
  return totalOfAllItems;
}

  
  

  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************
  //************************************************************************************************  



  
  