// RadioGroup.js
import React from 'react';
import '../css/RadioGroup.css';

function RadioGroup({ label, name, options, value, onChange }) {
  const _label = `${label}${options.length > 0? '': ' (choose above first)'}`;
  return (
    <div className="radio-group">
      <label>{_label}</label>
      {options.map((option, index) => (
        <div key={index} className="radio-option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value == option.value}
            onChange={(e)=> onChange(e.target.value)  }
          />
          {option.label}
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;
