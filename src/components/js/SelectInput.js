// SelectInput.js
import React from 'react';
import '../css/SelectInput.css';

function SelectInput({ label, options, value, onChange }) {
  return (
    <div className="select-input">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
