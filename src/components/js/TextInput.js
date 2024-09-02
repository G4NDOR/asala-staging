// TextInput.js
import React, { useState } from 'react';
import '../css/TextInput.css';

function TextInput({ label, finalValue, onChange }) {

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      if (!finalValue) {
        setIsFocused(false);
      }
    };

  return (
    <div className={`text-input ${isFocused || finalValue ? 'focused' : ''}`}>
      <label className="input-label">{label}</label>
      <input 
        type="text"
        value={finalValue}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}      
      />
    </div>
  );
}

export default TextInput;
