// TextInput.js
import React, { useState } from 'react';
import '../css/TextInput.css';

function TextInput({ label, value, onChange }) {

    const [isFocused, setIsFocused] = useState(false);
    const type = (typeof value === 'number' || label == 'Price')? 'number' : 'text';

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      console.log('final value: ', value);
      if (!value && value !== 0) {
        setIsFocused(false);
      }
    };

  return (
    <div className={`text-input ${isFocused || value ? 'focused' : ''}`}>
      <label className="input-label">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => {
          console.log('value changed: ', e.target.value);
          console.log('type: ', type);
          const value = e.target.value;
          if (type === 'text') onChange(value)
          if (type === 'number' && Number(value) !== NaN) onChange(Number(value))
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}      
      />
    </div>
  );
}

export default TextInput;
