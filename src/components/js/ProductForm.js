import React, { useEffect, useState } from 'react';
import TextInput from './TextInput';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';
import SelectInput from './SelectInput';
import PhoneNumberInput from './PhoneNumberInput';
import '../css/ProductForm.css';
import CheckboxGroup from './CheckboxGroup';
import { addDocuments, getDatedDataForFirebaseDocumentsAdds } from '../../utils/firestoreUtils';
import CONSTANTS from '../../constants/appConstants';
import { generateUniqueId, getAllSubstrings } from '../../utils/appUtils';

const VARIANT_TYPE = CONSTANTS.UNIQUE_IDS.VARIANT.type;
const OPTIONAL_ADDITION_TYPE = CONSTANTS.UNIQUE_IDS.OPTIONAL_ADDITION.type;

const TEST_PRODUCTS = [
  {
    "producer": {
      "id": "1IdZty4OGvALtPdXZ0X1",
      "name": "Asala",
      "location": {
        "_lat": 44.581707,
        "_long": -123.2720098
      }
    },
    "preorder-set": false,
    "is-default-value": false,
    "available": true,
    "schedule": {
      "tuesday": "12:00 AM - 06:00 PM",
      "thursday": "10:00 AM - 05:00 PM",
      "friday": "10:00 AM - 05:00 PM",
      "saturday": "10:00 AM - 05:00 PM",
      "sunday": "10:00 AM - 05:00 PM",
      "wednesday": "10:00 AM - 06:00 PM",
      "monday": "10:00 AM - 11:59 PM"
    },
    "in-stock": true,
    "price": 3.99,
    "compare-price": 5,
    "name": "msemen",
    "commission": {
      "value": 10,
      "type": "percentage"
    },
    "category": "category ID",
    "status": "present",
    "full-name": "msemen maamar/ rghayef",
    "full-description": "I want to make a product page, where if you click on a product you get redirected to this page...",
    "matching-products": [
      "FJbZT1XPSdwxRrhgiMTQ"
    ],
    "prep-time-in-minutes": 20,
    "wishes": [
      "BwzgdHO3tnNF5qwal1F",
      "BwzgdHO3tnNF5qwal1FJ",
      "oeAk7CDJohfxlw1WT8sk"
    ],
    "range": "general",
    "quantity": 1,
    "preorder-period-in-hours": 48,
    "optional-additions": [
      {
        "name": "ketchup",
        "id": generateUniqueId(OPTIONAL_ADDITION_TYPE),
        "price": 5.99,
        "active": true,
        "add-by-default": true,
        "type": "sauces"
      }
    ],
    "images": {
      "full-images": [
        "products/FJbZT1XPSdwxRrhgiMTQ/images/download.png"
      ],
      "few-images": [
        "products/FJbZT1XPSdwxRrhgiMTQ/images/download.png"
      ],
      "main-image": "products/FJbZT1XPSdwxRrhgiMTQ/images/download.png"
    },
    "description": "little short description...",
    "variants": [
      { "id": generateUniqueId(VARIANT_TYPE), "active": true, "price": 0, "color": "blue", "add-by-default": true },
      { "id": generateUniqueId(VARIANT_TYPE), "active": true, "price": 0, "color": "green", "add-by-default": false }
    ],
    "stock": 1,
    "day-specific-hours-set": true
  },
  {
    "producer": {
      "id": "2IdZty4OGvALtPdXZ0X2",
      "name": "Moroccan Delights",
      "location": {
        "latitude": 45.123456,
        "longitude": -124.567890
      }
    },
    "preorder-set": true,
    "is-default-value": true,
    "available": true,
    "schedule": {
      "tuesday": "09:00 AM - 07:00 PM",
      "thursday": "09:00 AM - 07:00 PM",
      "friday": "09:00 AM - 07:00 PM",
      "saturday": "09:00 AM - 07:00 PM",
      "sunday": "09:00 AM - 07:00 PM",
      "wednesday": "09:00 AM - 07:00 PM",
      "monday": "09:00 AM - 07:00 PM"
    },
    "in-stock": true,
    "price": 12.99,
    "compare-price": 15,
    "name": "bastilla",
    "commission": {
      "value": 15,
      "type": "percentage"
    },
    "category": "category ID",
    "status": "available",
    "full-name": "chicken bastilla",
    "full-description": "Authentic Moroccan chicken bastilla with a perfect blend of spices...",
    "matching-products": [
      "XYZ123",
      "ABC456"
    ],
    "prep-time-in-minutes": 40,
    "wishes": [
      "CdEfGhIjKlMnOpQrStUvWxYz",
      "AbCdEfGhIjKlMnOpQrStUvWxYz"
    ],
    "range": "premium",
    "quantity": 1,
    "preorder-period-in-hours": 72,
    "optional-additions": [
      {
        "name": "spicy sauce",
        "id": generateUniqueId(OPTIONAL_ADDITION_TYPE),
        "price": 2.99,
        "active": true,
        "add-by-default": false,
        "type": "sauces"
      }
    ],
    "images": {
      "full-images": [
        "products/XYZ123/images/bastilla.png"
      ],
      "few-images": [
        "products/XYZ123/images/bastilla.png"
      ],
      "main-image": "products/XYZ123/images/bastilla.png"
    },
    "description": "delicious Moroccan bastilla...",
    "variants": [
      { "id": generateUniqueId(VARIANT_TYPE), "active": true, "price": 12.99, "size": "large", "add-by-default": true },
      { "id": generateUniqueId(VARIANT_TYPE), "active": true, "price": 10.99, "size": "medium", "add-by-default": false }
    ],
    "stock": 10,
    "day-specific-hours-set": true
  }
];

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
  const OPTIONS = {
    new: {
      label: 'new',
      value: 'new',
    },
    available: {
      label: 'available',
      value: 'available',
    },
    category: {
      label: 'category',
      value: 'category',
    },
    commission: {
      label: 'commission',
      value: 'commission',
    },
    comparePrice: {
      label: 'compare-price',
      value: 'compare-price',
    },
    daySpecificHoursSet: {
      label: 'day-specific-hours-set',
      value: 'day-specific-hours-set',
    },
    description: {
      label: 'description',
      value: 'description',
    },
    discounts: {
      label: 'discounts',
      value: 'discounts',
    },
    fullDescription: {
      label: 'full-description',
      value: 'full-description',
    },
    fullImagesSrc: {
      label: 'full-images-src',
      value: 'full-images-src',
    },
    fullName: {
      label: 'full-name',
      value: 'full-name',
    },
    imageSrc: {
      label: 'image-src',
      value: 'image-src',
    },
    imagesSrc: {
      label: 'images-src',
      value: 'images-src',
    },
    inStock: {
      label: 'in-stock',
      value: 'in-stock',
    },
    isDefaultValue: {
      label: 'is-default-value',
      value: 'is-default-value',
    },
    keywords: {
      label: 'keywords',
      value: 'keywords',
    },
    matchingProducts:{
      label: 'matching-products',
      value: 'matching-products',
    },
    name: {
      label: 'name',
      value: 'name',
    },
    optionalAdditions: {
      label: 'optional-additions',
      value: 'optional-additions',
    },
    preorderPeriodInHours: {
      label: 'preorder-period-in-hours',
      value: 'preorder-period-in-hours',
    },
    preorderSet: {
      label: 'preorder-set',
      value: 'preorder-set',
    },
    prepTimeInMinutes: {
      label: 'prep-time-in-minutes',
      value: 'prep-time-in-minutes',
    },
    price: {
      label: 'price',
      value: 'price',
    },
    producer: {
      label: 'producer',
      value: 'producer',
    },
    quantity: {
      label: 'quantity',
      value: 'quantity',
    },
    range: {
      label: 'range',
      value: 'range',
    },
    schedule:{
      label: 'schedule',
      value: 'schedule',
    },
    status: {
      label: 'status',
      value: 'status',
    },
    stock: {
      label: 'stock',
      value: 'stock',
    },
    timeCreated: {
      label: 'time-created',
      value: 'time-created',
    },
    variants: {
      label: 'variants',
      value: 'variants',
    },
    wishes: {
      label: 'wishes',
      value: 'wishes',
    },
  }
  const VARIANT_DEFAULT_PROPERTIES = [
    'active',
    'price',
    'add-by-default',
    'id',
  ]
  const [available, setAvailable] = useState(false);
  const [category, setCategory] = useState("");
  const [commission, setCommission] = useState({
    type: "percentage",
    value: 10
  });
  const [comparePrice, setComparePrice] = useState(2.0);
  const [daySpecificHoursSet, setDaySpecificHoursSet] = useState(true);
  const [description, setDescription] = useState("little short description...");
  const [discounts, setDiscounts] = useState([{
    active: false,
    description: "10% off on all snacks",
    quantity: 1,
    type: "percentage",
    value: 10,
    applyOnSingleItem: true
  }]);
  const [fullDescription, setFullDescription] = useState("full description...");
  const [fullImagesSrc, setFullImagesSrc] = useState(["https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg"]);
  const [fullName, setFullName] = useState("full name...");
  const [imageSrc, setImageSrc] = useState("https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg");
  const [images, setImages] = useState({
    'main-image': "common-images/unavailable-image.jpg",
    'few-images': ["common-images/unavailable-image.jpg",],
    'full-images': ["common-images/unavailable-image.jpg",]
  })
  const [imagesSrc, setImagesSrc] = useState(["https://eagle-sensors.com/wp-content/uploads/unavailable-image.jpg"]);
  const [inStock, setInStock] = useState(true);
  const [isDefaultValue, setIsDefaultValue] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState(["",]);
  const [name, setName] = useState("name");
  const [optionalAdditions, setOptionalAdditions] = useState([{
    active: false,
    'add-by-default': false,
    id: 'opt-1',
    name: "Option 1",
    price: 1.5,
    type: "regular"
  }]);
  const [preorderPeriodInHours, setPreorderPeriodInHours] = useState(48);
  const [preorderSet, setPreorderSet] = useState(false);
  const [prepTimeInMinutes, setPrepTimeInMinutes] = useState(20);
  const [price, setPrice] = useState(1.0);
  const [producer, setProducer] = useState({
    id: "1IdZty4OGvALtPdXZ0X1",
    name: "Asala",
    location: {
      _lat: 37.7749,
      _long: -122.4194
    }
  });
  const [quantity, setQuantity] = useState(1);
  const [range, setRange] = useState("");
  const [schedule, setSchedule] = useState({
    monday: "10:00 AM - 12:00 PM",
    tuesday: "02:00 PM - 04:00 PM",
    wednesday: "04:00 PM - 06:00 PM",
    thursday: "06:00 PM - 08:00 PM",
    friday: "08:00 PM - 10:00 PM",
    saturday: null,
    sunday: null
  });
  const [status, setStatus] = useState("future");
  const [stock, setStock] = useState(1);
  //const [timeCreated, setTimeCreated] = useState(new Date());
  const [variants, setVariants] = useState([{
    id: "var-1",
    active: true,
    price: null,
    weight: 100,
    'add-by-default': false,
  }]);
  const [wishes, setWishes] = useState(["",]);
  const [option, setOption] = useState("new")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [variantPropertyName, setVariantPropertyName] = useState('')
  const [product, setProduct] = useState(defaultProduct);

  useEffect(() => {
    populateForm(0)
  
    return () => {
      
    }
  }, [])

  const uploadDocuments = async () => {
    const keywords = getAllSubstrings(product['full-name'])
    const collectionName = "products";
    const docData = {
      data: {
        "keywords": keywords,
        "available": available,
        "category": category,
        "commission": commission,
        "compare-price": comparePrice,
        "day-specific-hours-set": daySpecificHoursSet,
        "description": description,
        "full-description": fullDescription,
        "full-name": fullName,
        "images": images,
        "in-stock": inStock,
        "is-default-value": isDefaultValue,
        "keywords": keywords,
        "matching-products": matchingProducts,
        "name": name,
        "optional-additions": optionalAdditions.map(addition=> getDatedDataForFirebaseDocumentsAdds(addition)),
        "preorder-period-in-hours": preorderPeriodInHours,
        "preorder-set": preorderSet,
        "prep-time-in-minutes": prepTimeInMinutes,
        "price": price,
        "producer": producer,
        "quantity": quantity,
        "range": range,
        "schedule": schedule,
        "status": status,
        "stock": stock,
        "variants": variants.map(variant=> getDatedDataForFirebaseDocumentsAdds(variant)),
        "wishes": wishes,
      },
      merge:false
    };
    const documentsIds = await addDocuments( collectionName, [docData]);
    console.log('Uploaded documents: ', documentsIds);
  } 
  

  const populateForm = (index) => {
    if (index > TEST_PRODUCTS.length - 1) return;
    const product = TEST_PRODUCTS[index];
    setProduct(product);
    setAvailable(product.available);
    setCategory(product.category);
    setCommission(product.commission);
    setComparePrice(product["compare-price"]);
    setDaySpecificHoursSet(product["day-specific-hours-set"]);
    setDescription(product.description);
    // setDiscounts(product.discounts);
    setFullDescription(product["full-description" ]);
    // setFullImagesSrc(product.fullImagesSrc);
    setFullName(product["full-name"]);
    setImages(product.images);
    // setImagesSrc(product.imagesSrc);
    setInStock(product["in-stock"]);
    setIsDefaultValue(product["is-default-value"]);
    // setKeywords(product.keywords);
    setMatchingProducts(product["matching-products"]);
    setName(product.name);
    setOptionalAdditions(product["optional-additions"]);
    setPreorderPeriodInHours(product["preorder-period-in-hours"]);
    setPreorderSet(product["preorder-set"]);
    setPrepTimeInMinutes(product["prep-time-in-minutes"]);
    setPrice(product.price);
    console.log('producer: ', product.producer)
    setProducer(product.producer);
    setQuantity(product.quantity);
    setRange(product.range);
    setSchedule(product.schedule);
    setStatus(product.status);
    setStock(product.stock);
    // setTimeCreated(new Date(product.timeCreated));
    setVariants(product.variants);
    setWishes(product.wishes);
    // setOption(product.option)
    // setSelectedOptions(product.selectedOptions)
  }

  const showMap = (map, name, onChange) => {
    const onChangeProperty = (propertyObj) =>{
      onChange({...map, ...propertyObj})
    }
    return (<>
      {
        Object.entries(map).map(([propertyName, propertyValue], Vi) => {
          return (
            <div key={Vi}>
              {
                showProperty(propertyName, propertyValue, name, onChangeProperty)
              }           
            </div>
          )
        })
        //add property
      }
    </>)
  }  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const showProperty = (propertyName, propertyValue, name, onChange) => {
    //if (propertyName === 'price') return (
    //  <TextInput
    //  label={`${name}  ${propertyName}`}//${index + 1}
    //  name={`${name}${propertyName}`}
    //  value={propertyValue}
    //  onChange={(value) => onChange({[propertyName]: value })}/>
    //)
    const type = typeof propertyValue;
    switch (type) {
      case 'string':
        return (
          <TextInput
          label={`${name}  ${propertyName}`}
          name={`${name}${propertyName}`}
          value={propertyValue}
          onChange={(value) => onChange({[propertyName]: value })}/>
        )
      case 'boolean':
        return (
          <ToggleSwitch
            label={`${name}  ${propertyName}`}
            name={`${name}${propertyName}`}
            checked={propertyValue}
            onChange={(checked) => onChange({[propertyName]: checked })}/>
        )
      case 'number':
          return (
            <TextInput
            label={`${name}  ${propertyName}`}
            name={`${name}${propertyName}`}
            value={propertyValue}
            onChange={(value) => onChange({[propertyName]: value })}/>            
          )
      default: return
    }
  }

  const showVariantForm = (variant, index) => {
    const name = "Variant"
    const onChange = (propertyObj) => {
      setVariants(variants.map((v, i) =>  i === index? {...v, ...propertyObj} : v ))
    }
    return (<>
      {
        Object.entries(variant).map(([propertyName, propertyValue], Vi) => {
          return (
            <div key={Vi}>
              {
                showProperty(propertyName, propertyValue, name, onChange)
              }
              <button onClick={() => setVariants(variants.map((v, i) => {
                const {[propertyName]: _ , ...newVariant} = v;
                return ((i === index)&&(!VARIANT_DEFAULT_PROPERTIES.includes(propertyName)))?  newVariant: v;
              } ))}>Remove property</button>                
            </div>
          )
        })
        //add property
      }
      <TextInput
        label={`Variant ${index + 1} New Property`}
        name={`Variant${index + 1}NewProperty`}
        value={variantPropertyName}
        onChange={(value)=> setVariantPropertyName(value)}/>
      <button onClick={(value) => {
        if (variantPropertyName && variantPropertyName.trim() !== '') {
          setVariants(variants.map((v, i) =>  i === index? {...v, [variantPropertyName]: false } : v ))
          setVariantPropertyName('')
        }
      }}>Add Boolean property</button>
      <button onClick={(value) => {
        if (variantPropertyName && variantPropertyName.trim()!== '') {
          setVariants(variants.map((v, i) =>  i === index? {...v, [variantPropertyName]: '' } : v ))
          setVariantPropertyName('')
        }
      }}>Add Text property</button>
    </>)
  }

  const showForm = (option) => {
    switch (option) {
      case OPTIONS.new.label:
        return (<>
          <ToggleSwitch
            label="Available"
            name="available"
            checked={available}
            onChange={(checked) => setAvailable(checked)}/>

          <TextInput
            label="Category"
            name="category"
            value={category}
            onChange={(value) => setCategory(value)}/>

          <h3>Commission</h3>  
          <div className='nested-form'>
            {
              showMap(commission, "Commission", setCommission)
            }
          </div>
            <TextInput
            label="Compare Price"
            name="comparePrice"
            value={comparePrice}
            onChange={(value) => setComparePrice(value)}/>

            <ToggleSwitch
            label="Day Specific Hours Set"
            name="daySpecificHoursSet"
            checked={daySpecificHoursSet}
            onChange={(checked) => setDaySpecificHoursSet(checked)}/>
            
            <TextInput
            label="Description"
            name="description"
            value={description}
            onChange={(value) => setDescription(value)}/>

            <TextInput
            label="Full Description"
            name="fullDescription"
            value={fullDescription}
            onChange={(value) => setFullDescription(value)}/>

            <TextInput
            label="Full Name"
            name="fullName"
            value={fullName}
            onChange={(value) => setFullName(value)}/>

          <h3>Images</h3>  
          <div className='nested-form'>
            {
              showMap(images, "Images", setImages)
            }
          </div>
            <ToggleSwitch
            label="In Stock"
            name="inStock"
            checked={inStock}
            onChange={(checked) => setInStock(checked)}/>

            <ToggleSwitch
            label="Is Default Value"
            name="isDefaultValue"
            checked={isDefaultValue}
            onChange={(checked) => setIsDefaultValue(checked)}/>

            <TextInput
            label="Name"
            name="name"
            value={name}
            onChange={(value) => setName(value)}/>

            <TextInput
            label="Preorder Period In Hours"
            name="preorderPeriodInHours"
            value={preorderPeriodInHours}
            onChange={(value) => setPreorderPeriodInHours(value)}/>

            <ToggleSwitch
            label="Preorder Set"
            name="preorderSet"
            checked={preorderSet}
            onChange={(checked) => setPreorderSet(checked)}/>

            <TextInput
            label="Prep Time In Minutes"
            name="prepTimeInMinutes"
            value={prepTimeInMinutes}
            onChange={(value) => setPrepTimeInMinutes(value)}/>

            <TextInput
            label="Price"
            name="price"
            value={price}
            onChange={(value) => setPrice(value)}/>

            <TextInput
            label="Quantity"
            name="quantity"
            value={quantity}
            onChange={(value) => setQuantity(value)}/>

            <TextInput
            label="Range"
            name="range"
            value={range}
            onChange={(value) => setRange(value)}/>

            <TextInput
            label="Status"
            name="status"
            value={status}
            onChange={(value) => setStatus(value)}/>

            <TextInput
            label="Stock"
            name="stock"
            value={stock}
            onChange={(value) => setStock(value)}/>        
                  
          <h3>Schedule</h3>  
          <div className='nested-form'>
            <TextInput
              label="Monday Hours"
              name="mondayHours"
              value={schedule.monday}
              onChange={(value) => setSchedule({...schedule, monday: value })}/>
            <TextInput
              label="Tuesday Hours"
              name="tuesdayHours"
              value={schedule.tuesday}
              onChange={(value) => setSchedule({...schedule, tuesday: value })}/>
            <TextInput
              label="Wednesday Hours"
              name="wednesdayHours"
              value={schedule.wednesday}
              onChange={(value) => setSchedule({...schedule, wednesday: value })}/>
            <TextInput
              label="Thursday Hours"
              name="thursdayHours"
              value={schedule.thursday}
              onChange={(value) => setSchedule({...schedule, thursday: value })}/>
            <TextInput
              label="Friday Hours"
              name="fridayHours"
              value={schedule.friday}
              onChange={(value) => setSchedule({...schedule, friday: value })}/>
            <TextInput
              label="Saturday Hours"
              name="saturdayHours"
              value={schedule.saturday}
              onChange={(value) => setSchedule({...schedule, saturday: value })}/>
            <TextInput
              label="Sunday Hours"
              name="sundayHours"
              value={schedule.sunday}
              onChange={(value) => setSchedule({...schedule, sunday: value })}/>
          </div>                  
          <h3>Producer</h3>  
          <div className='nested-form'>
            <TextInput
              label="Name"
              name="producerName"
              value={producer.name}
              onChange={(value) => setProducer({...producer, name: value })}/>
            <TextInput
              label="ID"
              name="producerId"
              value={producer.id}
              onChange={(value) => setProducer({...producer, id: value })}/>
            <h5>Location</h5>
            <div className='nested-form'>
              <TextInput
                label="Latitude"
                name="latitude"
                value={producer.location._lat}
                onChange={(value) => setProducer({...producer, location: {...producer.location, _lat: value }})}/>
              <TextInput
                label="Longitude"
                name="longitude"
                value={producer.location._long}
                onChange={(value) => setProducer({...producer, location: {...producer.location, _long: value }})}/>
            </div>
          </div>                  

          <h3>Optional Additions</h3>  
          <div className='nested-form'>
            {
              optionalAdditions.map((option, index) => (<>
                <h5>Option {index + 1}</h5>
                <div className='nested-form' key={index}>
                <ToggleSwitch
                   label={`Option ${index + 1} Active`}
                    name={`optionActive${index + 1}`}
                    value={option.active}
                    onChange={(checked) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, active: checked } : o ))}/>
                  <ToggleSwitch
                  label={`Option ${index + 1} Add by default`}
                  name={`optionAddByDefault${index + 1}`}
                  value={option['add-by-default']}
                  onChange={(checked) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, ['add-by-default']: checked} : o ))}/>                  
                  <TextInput
                   label={`Option ${index + 1} ID`}
                    name={`optionId${index + 1}`}
                    value={option.id}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, id: value } : o ))}/>
                  <TextInput
                   label={`Option ${index + 1} Price`}
                   name={`optionPrice${index + 1}`}
                    value={option.price}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, price: value } : o ))}/>
                  <TextInput
                    label={`Option ${index + 1} Type`}
                    name={`optionType${index + 1}`}
                    value={option.type}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, type: value } : o ))}/>
                  <TextInput
                    label={`Option ${index + 1} Name`}
                    name={`optionName${index + 1}`}
                    value={option.name}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, name: value } : o ))}/>
                  <button type="button" onClick={() => setOptionalAdditions(optionalAdditions.filter((_, i) => i!== index))}>Remove Option</button>
                </div>
              </>))
            }
            <button type="button" onClick={() => setOptionalAdditions([...optionalAdditions, { active: false, 'add-by-default': false, id: generateUniqueId(OPTIONAL_ADDITION_TYPE), price: '', type: '', name: '' }])}>Add Option</button>
          </div>

          <h3>Matching Products</h3>  
          <div className='nested-form'>
            {
              matchingProducts.map((productId, index) => (<>
                <h5>Product {index + 1}</h5>
                <div className='nested-form' key={index}>
                  <TextInput
                    label={`Product ${index + 1} ID`}
                    name={`productId${index + 1}`}
                    value={productId}
                    onChange={(value) => setMatchingProducts(matchingProducts.map((v, i) => i === index? (value) : v ))}/>
                  <button type="button" onClick={() => setMatchingProducts(matchingProducts.filter((_, i) => i!== index))}>Remove Product</button>
                </div>
              </>))
            }
          <button type="button" onClick={() => setMatchingProducts([...matchingProducts, '' ])}>Add Product Id</button>
          </div> 
          <h3>Variants</h3>  
          <div className='nested-form'>
            {
              variants.map((variant, index) => (<>
                <h5>Variant {index + 1}</h5>
                <div className='nested-form' key={index}>
                  {
                    showVariantForm(variant, index)
                  }
                </div>
                <button type="button" onClick={() => setVariants(variants.filter((_, i) => i!== index))}>Remove Variant</button>
              </>))
            }
            <button type="button" onClick={() => {setVariants([...variants, { active: false, 'add-by-default': false, id: generateUniqueId(VARIANT_TYPE), price: null }])}}>Add Variant</button>
          </div>                                                 
                  </>);
      case OPTIONS.available.label:
        return (<ToggleSwitch
          label="Available"
          name="available"
          checked={available}
          onChange={(checked) => setAvailable(checked)}/>);
      case OPTIONS.category.label:
        return (<TextInput
          label="Category"
          name="category"
          value={category}
          onChange={(value) => setCategory(value)}/>);
      case OPTIONS.comparePrice.label:
        return (<TextInput
          label="Compare Price"
          name="comparePrice"
          value={comparePrice}
          onChange={(value) => setComparePrice(value)}/>);
      case OPTIONS.daySpecificHoursSet.label:
        return (<ToggleSwitch
          label="Day Specific Hours Set"
          name="daySpecificHoursSet"
          checked={daySpecificHoursSet}
          onChange={(checked) => setDaySpecificHoursSet(checked)}/>);
      case OPTIONS.description.label:
        return (<TextInput
          label="Description"
          name="description"
          value={description}
          onChange={(value) => setDescription(value)}/>);
      case OPTIONS.fullDescription.label:
        return (<TextInput
          label="Full Description"
          name="fullDescription"
          value={fullDescription}
          onChange={(value) => setFullDescription(value)}/>);
      case OPTIONS.fullName.label:
        return (<TextInput
          label="Full Name"
          name="fullName"
          value={fullName}
          onChange={(value) => setFullName(value)}/>);
      case OPTIONS.imageSrc.label:
        return (<TextInput
          label="Image Src"
          name="imageSrc"
          value={imageSrc}
          onChange={(value) => setImageSrc(value)}/>);
      case OPTIONS.inStock.label:
        return (<ToggleSwitch
          label="In Stock"
          name="inStock"
          checked={inStock}
          onChange={(checked) => setInStock(checked)}/>);
      case OPTIONS.isDefaultValue.label:
        return (<ToggleSwitch
          label="Is Default Value"
          name="isDefaultValue"
          checked={isDefaultValue}
          onChange={(checked) => setIsDefaultValue(checked)}/>);
      case OPTIONS.name.label:
        return (<TextInput
          label="Name"
          name="name"
          value={name}
          onChange={(value) => setName(value)}/>);
      case OPTIONS.preorderPeriodInHours.label:
        return (<TextInput
          label="Preorder Period In Hours"
          name="preorderPeriodInHours"
          value={preorderPeriodInHours}
          onChange={(value) => setPreorderPeriodInHours(value)}/>);
      case OPTIONS.preorderSet.label:
        return (<ToggleSwitch
          label="Preorder Set"
          name="preorderSet"
          checked={preorderSet}
          onChange={(checked) => setPreorderSet(checked)}/>);
      case OPTIONS.prepTimeInMinutes.label:
        return (<TextInput
          label="Prep Time In Minutes"
          name="prepTimeInMinutes"
          value={prepTimeInMinutes}
          onChange={(value) => setPrepTimeInMinutes(value)}/>);
      case OPTIONS.price.label:
        return (<TextInput
          label="Price"
          name="price"
          value={price}
          onChange={(value) => setPrice(value)}
          type="number"
          required={true}
        />);
      case OPTIONS.quantity.label:
        return (<TextInput
          label="Quantity"
          name="quantity"
          value={quantity}
          onChange={(value) => setQuantity(value)}
          type="number"
          required={true}
        />);
      case OPTIONS.range.label:
        return (<TextInput
          label="Range"
          name="range"
          value={range}
          onChange={(value) => setRange(value)}/>);
      case OPTIONS.status.label:
        return (      <SelectInput
          label="Status"
          name="status"
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: 'present', label: 'Present' },
            { value: 'future', label: 'Future' },
            { value: 'discontinued', label: 'Discontinued' }]}
        />);
      case OPTIONS.stock.label:
        return (<TextInput
          label="Stock"
          name="stock"
          value={stock}
          onChange={(value) => setStock(value)}
          type="number"
          required={true}
        />);
      case OPTIONS.commission.label:
        return (<>
          <h3>Commission</h3>  
          <div className='nested-form'>
            {
              showMap(commission, "Commission", setCommission)
            }
          </div>
        </>);
      case OPTIONS.producer.label:
        return (<>
          <h3>Producer</h3>  
          <div className='nested-form'>
            <TextInput
              label="Name"
              name="producerName"
              value={producer.name}
              onChange={(value) => setProducer({...producer, name: value })}/>
            <TextInput
              label="ID"
              name="producerId"
              value={producer.id}
              onChange={(value) => setProducer({...producer, id: value })}/>
            <h5>Location</h5>
            <div className='nested-form'>
              <TextInput
                label="Latitude"
                name="latitude"
                value={producer.location._lat}
                onChange={(value) => setProducer({...producer, location: {...producer.location, _lat: value }})}/>
              <TextInput
                label="Longitude"
                name="longitude"
                value={producer.location._long}
                onChange={(value) => setProducer({...producer, location: {...producer.location, _long: value }})}/>
            </div>
          </div>
        </>);
      case OPTIONS.schedule.label:
        return (<>
          <h3>Schedule</h3>  
          <div className='nested-form'>
            <TextInput
              label="Monday Hours"
              name="mondayHours"
              value={schedule.monday}
              onChange={(value) => setSchedule({...schedule, monday: value })}/>
            <TextInput
              label="Tuesday Hours"
              name="tuesdayHours"
              value={schedule.tuesday}
              onChange={(value) => setSchedule({...schedule, tuesday: value })}/>
            <TextInput
              label="Wednesday Hours"
              name="wednesdayHours"
              value={schedule.wednesday}
              onChange={(value) => setSchedule({...schedule, wednesday: value })}/>
            <TextInput
              label="Thursday Hours"
              name="thursdayHours"
              value={schedule.thursday}
              onChange={(value) => setSchedule({...schedule, thursday: value })}/>
            <TextInput
              label="Friday Hours"
              name="fridayHours"
              value={schedule.friday}
              onChange={(value) => setSchedule({...schedule, friday: value })}/>
            <TextInput
              label="Saturday Hours"
              name="saturdayHours"
              value={schedule.saturday}
              onChange={(value) => setSchedule({...schedule, saturday: value })}/>
            <TextInput
              label="Sunday Hours"
              name="sundayHours"
              value={schedule.sunday}
              onChange={(value) => setSchedule({...schedule, sunday: value })}/>
          </div>
        </>);
/*
      case OPTIONS.discounts.label:
        return (<>
          <h3>Discounts</h3>  
          <div className='nested-form'>
            {
              discounts.map((discount, index) => (<>
                <h5>Variant {index + 1}</h5>
                <div className='nested-form' key={index}>
                  <TextInput
                    label={`Discount ${index + 1} Name`}
                    name={`discountName${index + 1}`}
                    value={discount.name}
                    onChange={(value) => setDiscounts(discounts.map((d, i) => i === index? {...d, name: value } : d ))}/>
                  <TextInput
                    label={`Discount ${index + 1} Value`}
                    name={`discountValue${index + 1}`}
                    value={discount.value}
                    onChange={(value) => setDiscounts(discounts.map((d, i) => i === index? {...d, value: value } : d ))}/>
                  <TextInput
                    label="Quantity"
                    name={`discountQuantity${index + 1}`}
                    value={discount.quantity}
                    onChange={(value) => setDiscounts(discounts.map((d, i) => i === index? {...d, quantity: value } : d ))}/>
                  <button type="button" onClick={() => setDiscounts(discounts.filter((_, i) => i!== index))}>Remove Discount</button>
                </div>
              </>))
            }
            <button type="button" onClick={() => setDiscounts([...discounts, { name: '', value: '', quantity: '' }])}>Add Discount</button>
          </div>
        </>);
*/
      case OPTIONS.imagesSrc.label:
        return (<>
          <h3>Images</h3>  
          <div className='nested-form'>
            {
              imagesSrc.map((image, index) => (<>
                <h5>Image {index + 1}</h5>
                <div className='nested-form' key={index}>
                  <TextInput
                    label={`Image ${index + 1} URL`}
                    name={`imageURL${index + 1}`}
                    value={image}
                    onChange={(value) => setImagesSrc(imagesSrc.map((v, i) => i === index? value : v ))}/>
                  <button type="button" onClick={() => setImagesSrc(imagesSrc.filter((_, i) => i!== index))}>Remove Image</button>
                </div>
              </>))
            }
            <button type="button" onClick={() => setImagesSrc([...imagesSrc, '' ])}>Add Image</button>
          </div>
        </>);
      case OPTIONS.matchingProducts.label:
        return (<>
          <h3>Matching Products</h3>  
          <div className='nested-form'>
            {
              matchingProducts.map((productId, index) => (<>
                <h5>Product {index + 1}</h5>
                <div className='nested-form' key={index}>
                  <TextInput
                    label={`Product ${index + 1} ID`}
                    name={`productId${index + 1}`}
                    value={productId}
                    onChange={(value) => setMatchingProducts(matchingProducts.map((v, i) => i === index? (value) : v ))}/>
                  <button type="button" onClick={() => setMatchingProducts(matchingProducts.filter((_, i) => i!== index))}>Remove Product</button>
                </div>
              </>))
            }
          <button type="button" onClick={() => setMatchingProducts([...matchingProducts, '' ])}>Add Product Id</button>
          </div>
        </>);
      case OPTIONS.optionalAdditions.label:
        return (<>
          <h3>Optional Additions</h3>  
          <div className='nested-form'>
            {
              optionalAdditions.map((option, index) => (<>
                <h5>Option {index + 1}</h5>
                <div className='nested-form' key={index}>
                <ToggleSwitch
                   label={`Option ${index + 1} Active`}
                    name={`optionActive${index + 1}`}
                    value={option.active}
                    onChange={(checked) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, active: checked } : o ))}/>
                  <ToggleSwitch
                  label={`Option ${index + 1} Add by default`}
                  name={`optionAddByDefault${index + 1}`}
                  value={option['add-by-default']}
                  onChange={(checked) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, ['add-by-default']: checked} : o ))}/>                  
                  <TextInput
                   label={`Option ${index + 1} ID`}
                    name={`optionId${index + 1}`}
                    value={option.id}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, id: value } : o ))}/>
                  <TextInput
                   label={`Option ${index + 1} Price`}
                   name={`optionPrice${index + 1}`}
                    value={option.price}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, price: value } : o ))}/>
                  <TextInput
                    label={`Option ${index + 1} Type`}
                    name={`optionType${index + 1}`}
                    value={option.type}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, type: value } : o ))}/>
                  <TextInput
                    label={`Option ${index + 1} Name`}
                    name={`optionName${index + 1}`}
                    value={option.name}
                    onChange={(value) => setOptionalAdditions(optionalAdditions.map((o, i) => i === index? {...o, name: value } : o ))}/>
                  <button type="button" onClick={() => setOptionalAdditions(optionalAdditions.filter((_, i) => i!== index))}>Remove Option</button>
                </div>
              </>))
            }
            <button type="button" onClick={() => {
              const id = generateUniqueId(OPTIONAL_ADDITION_TYPE);
              setOptionalAdditions([...optionalAdditions, { active: false, 'add-by-default': false, id: id, price: '', type: '', name: '' }])
            }}>Add Option</button>
          </div>
        </>);
      case OPTIONS.variants.label:
        return (<>
          <h3>Variants</h3>  
          <div className='nested-form'>
            {
              variants.map((variant, index) => (<>
                <h5>Variant {index + 1}</h5>
                <div className='nested-form' key={index}>
                  {
                    showVariantForm(variant, index)
                  }
                </div>
                <button type="button" onClick={() => setVariants(variants.filter((_, i) => i!== index))}>Remove Variant</button>
              </>))
            }
            <button type="button" onClick={() => {
              const id = generateUniqueId(VARIANT_TYPE);
              setVariants([...variants, { active: false, 'add-by-default': false, id: id, price: null }])
            }}>Add Variant</button>
          </div>
        </>)
      default:
          return <></>;
  }
  }
  const onChange = (option) => {
    if (selectedOptions.includes(option)) setSelectedOptions(selectedOptions.filter((o) => o!== option));
    else setSelectedOptions([...selectedOptions, option]);
  }

  return (
    <div className="product-form">
      <h1>Product Form</h1>
      <CheckboxGroup label={"Create new / Update"} values={selectedOptions} onChange={onChange} options={Object.values(OPTIONS)} />
      {
        selectedOptions.map((option) => showForm(option))
      }

      <button type="submit" className="submit-button">Save Product</button>
      <button onClick={()=>uploadDocuments()} type="submit" className="submit-button">upload test products</button>
    </div>
  );
}

export default ProductForm;
