import React, { useState } from 'react';
import '../css/EmailInput.css';

function EmailInput({ label = "email", required = false , onChange, value}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [_value, setValue] = useState(value);


  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    validateEmail(_value);
  };

  const validateEmail = (email) => {
    setValue(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
    if(emailRegex.test(email) || (email == '')) onChange(email);
  };

  return (
    <div className={`email-input ${isFocused || _value ? 'focused' : ''} ${!isValid ? 'invalid' : ''}`}>
      <label className="input-label">
        {label} {required && '*'}
      </label>
      <input
        type="email"
        value={_value}
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
