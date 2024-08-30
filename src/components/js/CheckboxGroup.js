// CheckboxGroup.js
import React from 'react';
import '../css/CheckboxGroup.css';

function CheckboxGroup({ label, options, values, onChange }) {
  return (
    <div className="checkbox-group">
      <label>{label}</label>
      {options.map((option, index) => (
        <div key={index} className="checkbox-option">
          <input
            type="checkbox"
            value={option.value}
            checked={values.includes(option.value)}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}

export default CheckboxGroup;
