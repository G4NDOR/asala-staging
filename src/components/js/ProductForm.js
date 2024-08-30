import React, { useState } from 'react';
import TextInput from './TextInput';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';
import PhoneNumberInput from './PhoneNumberInput';
import '../css/ProductForm.css';

function ProductForm() {
  const defaultProduct = {
    id: "",
    isDefaultValue: true,
    preorderPeriodInHours: 48,
    fullImagesSrc: ["https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg"],
    category: "",
    comparePrice: 2,
    inStock: true,
    matchingProducts: [""],
    imagesSrc: [
      "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
      "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg"
    ],
    keywords: ["n", "na", "nam", "name", "ame", "me", "a", "e", "am"],
    fullName: "product name",
    discounts: [
      {
        active: false,
        description: "10% off on all snacks",
        quantity: 1,
        type: "percentage",
        value: 10,
        applyOnSingleItem: true
      }
    ],
    wishes: [""],
    prepTimeInMinutes: 20,
    price: 1.0,
    imageSrc: "https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg",
    name: "product",
    quantity: 1,
    producer: {
      id: "1IdZty4OGvALtPdXZ0X1",
      name: "Asala"
    },
    available: false,
    stock: 1,
    hours: [
      {
        end: "05:00 PM",
        start: "08:00 AM"
      }
    ],
    status: "present",
    daySpecificHoursSet: false,
    description: " little short description...",
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    fullDescription: "this is full description...",
    preorderSet: false,
    timeCreated: new Date()
  };

  const [product, setProduct] = useState(defaultProduct);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="product-form">
      <h1>Product Form</h1>
      <TextInput
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        required={true}
      />
      <TextArea
        label="Short Description"
        name="description"
        value={product.description}
        onChange={handleChange}
      />
      <TextArea
        label="Full Description"
        name="fullDescription"
        value={product.fullDescription}
        onChange={handleChange}
      />
      <TextInput
        label="Price"
        name="price"
        value={product.price}
        onChange={handleChange}
        type="number"
        required={true}
      />
      <TextInput
        label="Stock Quantity"
        name="stock"
        value={product.stock}
        onChange={handleChange}
        type="number"
      />
      <TextInput
        label="Preparation Time (minutes)"
        name="prepTimeInMinutes"
        value={product.prepTimeInMinutes}
        onChange={handleChange}
        type="number"
      />
      <TextInput
        label="Compare Price"
        name="comparePrice"
        value={product.comparePrice}
        onChange={handleChange}
        type="number"
      />
      <TextInput
        label="Category"
        name="category"
        value={product.category}
        onChange={handleChange}
      />
      <TextInput
        label="Image Source"
        name="imageSrc"
        value={product.imageSrc}
        onChange={handleChange}
      />
      <TextInput
        label="Full Image Source"
        name="fullImagesSrc"
        value={product.fullImagesSrc.join(', ')}
        onChange={(e) => handleChange({
          target: { name: 'fullImagesSrc', value: e.target.value.split(', ') }
        })}
      />
      <TextInput
        label="Keywords"
        name="keywords"
        value={product.keywords.join(', ')}
        onChange={(e) => handleChange({
          target: { name: 'keywords', value: e.target.value.split(', ') }
        })}
      />
      <TextInput
        label="Matching Products"
        name="matchingProducts"
        value={product.matchingProducts.join(', ')}
        onChange={(e) => handleChange({
          target: { name: 'matchingProducts', value: e.target.value.split(', ') }
        })}
      />
      <TextInput
        label="Wishes"
        name="wishes"
        value={product.wishes.join(', ')}
        onChange={(e) => handleChange({
          target: { name: 'wishes', value: e.target.value.split(', ') }
        })}
      />
      <TextInput
        label="Producer ID"
        name="producerId"
        value={product.producer.id}
        onChange={handleChange}
      />
      <TextInput
        label="Producer Name"
        name="producerName"
        value={product.producer.name}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Available"
        name="available"
        checked={product.available}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Preorder Set"
        name="preorderSet"
        checked={product.preorderSet}
        onChange={handleChange}
      />
      <ToggleSwitch
        label="Day Specific Hours Set"
        name="daySpecificHoursSet"
        checked={product.daySpecificHoursSet}
        onChange={handleChange}
      />
      <TextInput
        label="Hours Start"
        name="hoursStart"
        value={product.hours[0]?.start || ''}
        onChange={(e) => handleChange({
          target: {
            name: 'hours',
            value: [{ ...product.hours[0], start: e.target.value }]
          }
        })}
      />
      <TextInput
        label="Hours End"
        name="hoursEnd"
        value={product.hours[0]?.end || ''}
        onChange={(e) => handleChange({
          target: {
            name: 'hours',
            value: [{ ...product.hours[0], end: e.target.value }]
          }
        })}
      />
      <SelectInput
        label="Status"
        name="status"
        value={product.status}
        onChange={handleChange}
        options={[
          { value: 'present', label: 'Present' },
          { value: 'out_of_stock', label: 'Out of Stock' },
          { value: 'discontinued', label: 'Discontinued' }
        ]}
      />
      <button type="submit" className="submit-button">Save Product</button>
    </div>
  );
}

export default ProductForm;
