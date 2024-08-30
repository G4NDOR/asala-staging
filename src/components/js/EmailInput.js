import React, { useState } from 'react';
import '../css/EmailInput.css';

function EmailInput({ label = "email", required = false , onChange, value}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    validateEmail(value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
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
          onChange(e);
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
