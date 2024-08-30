import React, { useState } from 'react';
import TextInput from './TextInput';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';
import '../css/DiscountForm.css';

function DiscountForm() {
  const defaultDiscount = {
    id: "",
    active: false,
    applyOnSingleItem: true,
    customers: [],
    description: "10% off on all snacks",
    expiration: null,
    maxUses: 10,
    products: [],
    quantity: 3,
    type: "percentage",
    value: 10,
    isDefaultValue: true,
    timeCreated: new Date()
  };

  const [discount, setDiscount] = useState(defaultDiscount);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDiscount({
      ...discount,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (e, fieldName) => {
    setDiscount({
      ...discount,
      [fieldName]: e.target.value.split(',').map(item => item.trim())
    });
  };

  return (
    <div className="discount-form">
      <h1>Discount Form</h1>
      <TextInput
        label="Discount Description"
        name="description"
        value={discount.description}
        onChange={handleChange}
      />
      <TextInput
        label="Value"
        name="value"
        value={discount.value}
        onChange={handleChange}
        type="number"
        required={true}
      />
      <TextInput
        label="Quantity"
        name="quantity"
        value={discount.quantity}
        onChange={handleChange}
        type="number"
        required={true}
      />
      <TextInput
        label="Max Uses"
        name="maxUses"
        value={discount.maxUses}
        onChange={handleChange}
        type="number"
      />
      <TextInput
        label="Products (IDs)"
        name="products"
        value={discount.products.join(', ')}
        onChange={(e) => handleArrayChange(e, 'products')}
      />
      <TextInput
        label="Customers (IDs)"
        name="customers"
        value={discount.customers.join(', ')}
        onChange={(e) => handleArrayChange(e, 'customers')}
      />
      <TextInput
        label="Expiration Date"
        name="expiration"
        value={discount.expiration || ''}
        onChange={handleChange}
        type="date"
      />
      <TextInput
        label="Type"
        name="type"
        value={discount.type}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Active"
        name="active"
        checked={discount.active}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Apply on Single Item"
        name="applyOnSingleItem"
        checked={discount.applyOnSingleItem}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Default Value"
        name="isDefaultValue"
        checked={discount.isDefaultValue}
        onChange={handleChange}
      />
      <button type="submit" className="submit-button">Save Discount</button>
    </div>
  );
}

export default DiscountForm;
