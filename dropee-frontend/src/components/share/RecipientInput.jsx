import React from 'react';

const RecipientInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Email or phone number (optional)'}
      className="input-field"
    />
  );
};

export default RecipientInput;
