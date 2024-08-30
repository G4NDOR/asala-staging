// TextArea.js
import React from 'react';
import '../css/TextArea.css';

function TextArea({ label, value, onChange }) {
  return (
    <div className="text-area">
      <label>{label}</label>
      <textarea value={value} onChange={onChange} />
    </div>
  );
}

export default TextArea;
