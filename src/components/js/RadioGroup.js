// RadioGroup.js
import React from 'react';
import '../css/RadioGroup.css';

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div className="radio-group">
      <label>{label}</label>
      {options.map((option, index) => (
        <div key={index} className="radio-option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
          {option.label}
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;
