// TextInput.js
import React, { useState } from 'react';
import '../css/TextInput.css';

function TextInput({ label, value, onChange }) {

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      if (!value) {
        setIsFocused(false);
      }
    };

  return (
    <div className={`text-input ${isFocused || value ? 'focused' : ''}`}>
      <label className="input-label">{label}</label>
      <input 
        type="text"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}      
      />
    </div>
  );
}

export default TextInput;
