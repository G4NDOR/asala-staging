import React, { useState } from 'react';
import TextInput from './TextInput';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';
import '../css/ProducerForm.css';

function ProducerForm() {
  const defaultProducer = {
    active: true,
    commission: 15,
    id: 0,
    imageSrc: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
    name: "Asala",
    products: ['1', '2', '3'],
    timeCreated: new Date(),
    isDefaultValue: true
  };

  const [producer, setProducer] = useState(defaultProducer);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducer({
      ...producer,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (e, fieldName) => {
    setProducer({
      ...producer,
      [fieldName]: e.target.value.split(',').map(item => item.trim())
    });
  };

  return (
    <div className="producer-form">
      <h1>Producer Form</h1>
      <TextInput
        label="Producer Name"
        name="name"
        value={producer.name}
        onChange={handleChange}
        required={true}
      />
      <TextInput
        label="Commission (%)"
        name="commission"
        value={producer.commission}
        onChange={handleChange}
        type="number"
        required={true}
      />
      <TextInput
        label="Image Source"
        name="imageSrc"
        value={producer.imageSrc}
        onChange={handleChange}
      />
      <TextInput
        label="Products (IDs)"
        name="products"
        value={producer.products.join(', ')}
        onChange={(e) => handleArrayChange(e, 'products')}
      />
      <ToggleSwitch
        label="Active"
        name="active"
        checked={producer.active}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Default Value"
        name="isDefaultValue"
        checked={producer.isDefaultValue}
        onChange={handleChange}
      />
      <button type="submit" className="submit-button">Save Producer</button>
    </div>
  );
}

export default ProducerForm;
