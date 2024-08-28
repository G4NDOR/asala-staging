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


  export const findAppliedDiscount = (discounts, quantity) => {
    let appliedDiscount = DEFAULT_VALUES.PRODUCT[`${FIREBASE_DOCUMENTS_FEILDS_NAMES.PRODUCTS.DISCOUNTS}`][0];
    const activeDiscounts = discounts.filter(discount => (discount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.ACTIVE}`]));        
    const appliedDiscountBasedOnQuantity = activeDiscounts.filter(discount => {
      const quantityOnwhichDiscountApplies = discount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.QUANTITY}`];
      const discountShouldApply = quantity >= quantityOnwhichDiscountApplies;
      return discountShouldApply;
    });    
    if (appliedDiscountBasedOnQuantity.length > 0) 
      appliedDiscount = appliedDiscountBasedOnQuantity[0];
    return appliedDiscount;
  }

  const getPriceWithDiscountApplied = (discount, price) => {
    let amountTobeSubtracted = 0;
    const discountExists = discount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.ACTIVE}`];//if there's none, discount will be default value which has "active" set to false
    const discountType = discount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.TYPE}`];
    const discountValue = discount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.VALUE}`];
    const DISCOUNT_TYPE_OPTION_1 = FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.DISCOUNTS.TYPE.PERCENTAGE;
    const DISCOUNT_TYPE_OPTION_2 = FIREBASE_DOCUMENTS_FEILDS_UNITS.PRODUCTS.DISCOUNTS.TYPE.FIXED;
    if (discountExists) {
      switch (discountType) {
        case DISCOUNT_TYPE_OPTION_1:
          amountTobeSubtracted = (discountValue * price) / 100;          
          break;
    
        case DISCOUNT_TYPE_OPTION_2:
          amountTobeSubtracted = discountValue;          
          break;
        default:
          break;
      }
    }
    const priceWithDiscountApplied = price - amountTobeSubtracted;    
    return priceWithDiscountApplied;
  }



  export const calculatePrice = (discounts, price, quantity) => {    
    const appliedDiscount = findAppliedDiscount(discounts, quantity);
    let total = price * quantity;
    const applyOnSingleItem = appliedDiscount[`${FIREBASE_DOCUMENTS_1_NESTED_FEILDS_NAMES.PRODUCTS.DISCOUNTS.APPLY_ON_SINGLE_ITEM}`];
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



  
  