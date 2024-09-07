// ToggleSwitch.js
import React from 'react';
import '../css/ToggleSwitch.css';

function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="toggle-switch">
      <label>
        {label}
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default ToggleSwitch;
