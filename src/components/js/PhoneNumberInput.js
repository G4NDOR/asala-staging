import React, { useState } from 'react';
import { formatPhoneNumberStyle1 } from '../../utils/appUtils';
import '../css/PhoneNumberInput.css';

function PhoneNumberInput({ label = "phone number", required = false, onChange, finalValue }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState(finalValue);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);



  const handleChange = (e) => {
    let inputValue = e.target.value;
    const cleaned = inputValue.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setIsValid(cleaned.length === 10);
      setValue(formatPhoneNumberStyle1(inputValue));
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
        value={formatPhoneNumberStyle1(value)}
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
