import { DAY_INDEX_MAP, FIREBASE_DOCUMENTS_FEILDS_NAMES } from "../constants/firebase";

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


  
  