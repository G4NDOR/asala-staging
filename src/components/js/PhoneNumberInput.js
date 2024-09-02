import React, { useState } from 'react';
import '../css/PhoneNumberInput.css';

function PhoneNumberInput({ label = "phone number", required = false, onChange, finalValue }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState(finalValue);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const formatPhoneNumber = (number) => {
    const cleaned = ('' + number).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const formattedNumber = !match[2]
        ? `(${match[1]}`
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
      return formattedNumber;
    }
    return number;
  };

  const handleChange = (e) => {
    let inputValue = e.target.value;
    const cleaned = inputValue.replace(/\D/g, '');
    console.log(cleaned);
    if (cleaned.length <= 10) {
      setIsValid(cleaned.length === 10);
      setValue(formatPhoneNumber(inputValue));
      console.log(formatPhoneNumber(inputValue))
      if (cleaned.length === 10 || cleaned.length === 0) onChange(cleaned);
    }
  };

  return (
    <div className={`phone-input ${isFocused || value ? 'focused' : ''} ${!isValid ? 'invalid' : ''}`}>
      <label className="input-label">
        {label} {required && '*'}
      </label>
      <input
        type="tel"
        value={formatPhoneNumber(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        placeholder=" "
      />
      {!isValid && <span className="error-message">Please enter a valid phone number</span>}
    </div>
  );
}

export default PhoneNumberInput;
