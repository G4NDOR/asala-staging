import React, { useState } from 'react';
import '../css/EmailInput.css';

function EmailInput({ label = "email", required = false , onChange, finalValue}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState(finalValue);


  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    validateEmail(value);
  };

  const validateEmail = (email) => {
    setValue(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
    if(emailRegex.test(email) || (email == '')) onChange(email);
  };

  return (
    <div className={`email-input ${isFocused || value ? 'focused' : ''} ${!isValid ? 'invalid' : ''}`}>
      <label className="input-label">
        {label} {required && '*'}
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => {
          validateEmail(e.target.value);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        placeholder=" "
      />
      {!isValid && <span className="error-message">Invalid email address</span>}
    </div>
  );
}

export default EmailInput;
