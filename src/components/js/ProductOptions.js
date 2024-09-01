import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deselectVariant, selectVariant, setStartIndex, setEndIndex, removeOptionalAddition, addOptionalAddition, setVariantField } from '../../redux/ducks/productPageManager';
import '../css/ProductOptions.css'
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup'

const Variant = ({ parentProductField, index, productField, variants })=>{
    const dispatch = useDispatch();
    const startIndex = useSelector(state => state.productPageManager.startIndex);
    const endIndex = useSelector(state => state.productPageManager.endIndex);
    const selectedVariants = useSelector(state => state.productPageManager.selectedVariants);
    //const selectedVariantsArray = Object.values(selectedVariants);
    const isTheParent = index == startIndex;
    const unidentifiedPrentSelcted = `${index - 1}` in selectedVariants;
    //unselect all the dependent(children) variants of the previous selcted variant at [index] 
    
    let selectableVariants = [];
    //console.log("index: ", index, "startIndex: ", startIndex, "parentSelected: ", parentSelected)
    if (isTheParent) {
        selectableVariants = variants;
    } else if (unidentifiedPrentSelcted) selectableVariants = variants.filter(variant => {
        //const [active, price, id, ...productProperties] = Object.keys(variant);
        //productProperties.map();
        let isParent = true;
        const [ active, id, price, ...uncleanProperties] = Object.keys(selectedVariants[index - 1]);
        const properties = uncleanProperties.filter(property => property !== 'add-by-default');
        properties.map(property => {
            //console.log("property: ", property, "variant[property]: ", variant[property], "selectedVariants[index-1][property]: ", selectedVariants[index-1][property], 'selectedVariants[index-1]: ', selectedVariants[index - 1]);
            const isMatching = variant[property] == selectedVariants[index - 1][property];
            if (!isMatching) isParent = false;
        });
        return isParent;
    });

    //for (let i = startIndex; i < endIndex; i++) {
    //    const selctedVariant = selectedVariants[i];
    //    const selectedField = selctedVariant
    //}
    //if this component is rendered => there's at least one variant
    //variants[0] 
    //Object.keys(variants[0]).
    const defaultOption = selectedVariants[index] || {id:''};
    const defaultValue = defaultOption.id;
    const [value, setValue] = useState(defaultValue);
    const label = productField;
    const name = `${label.toLowerCase()}-variant`;
    const options = selectableVariants.map(variant => {
        const price = variant.price? ` $${variant.price}` : '';
        const label = `${variant[productField]}${price}`;
        const value = variant.id;
        return {
            label: label, value: value
        }
    });

    const variantOptionsClassNameString = `variant-options${index > startIndex?'show' : ''}`;
    
    const onChange = (id) => {
        //console.log('value:', value, 'id', id);
        setValue(id);
        const variant = variants.find(v => v.id == id);
        //console.log("variant: ", variant, "index: ", index)
        dispatch(selectVariant(variant,index));
        //unselect all the dependent(children) variants of the previous selcted variant at [index] 
        for (let i = index + 1; i < endIndex; i++) {
            dispatch(deselectVariant(i));
        }
    }
    
    return (
        <div className={variantOptionsClassNameString}>
            <RadioGroup onChange={onChange} label={label} name={name} options={options} value={value} />
        </div>
    )
}

const OptionalAddition = ({type, optionalAdditions}) => {
    const dispatch = useDispatch();
    const selectedOptionalAdditions = useSelector(state => state.productPageManager.selectedOptionalAdditions);
    const selectedAdditions = selectedOptionalAdditions[type];
    const values = selectedAdditions? selectedAdditions.map(addition => addition.id): [];
    const label = type;
    const options = optionalAdditions.map(addition => {
        const label = `${addition.name} - $${addition.price.toFixed(2)}`;
        const value = addition.id;
        return {
            label: label, value: value
        }
    })
    
    
    const onChange = (id) => {
        //if selected before => we are deselecting it in this block of code
        const deselecting = values.includes(id);
        const addition = optionalAdditions.find(addition => addition.id == id);
        if (deselecting) {
            dispatch(removeOptionalAddition(addition));
        } else {
            dispatch(addOptionalAddition(addition));
        }
    }


    return <CheckboxGroup label={label} options={options} values={values} onChange={onChange} />;
}

export default function ProductOptions({variants, optionalAdditions}) {
    const _variants = [
        // Parent variants with price null
        { id: 1, active: true, price: null, color: 'blue', 'add-by-default': true },
        { id: 2, active: true, price: null, color: 'green', 'add-by-default': false },
      
        // Child variants with specific prices
        { id: 3, active: true, price: 19.99, color: 'blue', size: '12oz', 'add-by-default': false },
        { id: 4, active: true, price: 24.99, color: 'blue', size: '16oz', 'add-by-default': false },
      
        // Variants that act as both parents and children
        { id: 5, active: true, price: null, color: 'blue', size: '20oz', 'add-by-default': true }, // Parent of below child variants
        { id: 6, active: true, price: 29.99, color: 'blue', size: '20oz', material: 'cotton', 'add-by-default': true },
        { id: 7, active: true, price: 34.99, color: 'blue', size: '20oz', material: 'polyester', 'add-by-default': false },
      
        { id: 8, active: true, price: 20.99, color: 'green', size: '12oz', 'add-by-default': false },
        { id: 9, active: true, price: 25.99, color: 'green', size: '16oz', 'add-by-default': false },
      
        // Variants that act as both parents and children
        { id: 10, active: true, price: null, color: 'green', size: '20oz', 'add-by-default': false }, // Parent of below child variants
        { id: 11, active: true, price: 30.99, color: 'green', size: '20oz', material: 'cotton', 'add-by-default': false },
        { id: 12, active: true, price: 35.99, color: 'green', size: '20oz', material: 'polyester', 'add-by-default': false },
    ];
    const _optionalAdditions = [
        { id: 1, name: 'ketchup', price: 5.99, active: true, type: 'sauces', 'add-by-default': true },
        { id: 2, name: 'onion', price: 3.99, active: true, type: 'vegetables', 'add-by-default': true },
        { id: 3, name: 'cheese', price: 7.99, active: true, type: 'cheeses', 'add-by-default': false },
        { id: 4, name: 'pepperoni', price: 8.99, active: true, type: 'toppings', 'add-by-default': false },
        { id: 5, name: 'lettuce', price: 2.99, active: true, type:'vegetables', 'add-by-default': true },
        { id: 6, name: 'tomatoes', price: 2.99, active: true, type:'vegetables', 'add-by-default': true },
    ];
    const dispatch = useDispatch();
    const [initialized, setInitialized] = useState(false);
    const [variantsContent, setVariantsContent] = useState(null);
    const [optionalAdditionsContent, setOptionalAdditionsContent] = useState(null);
    //const bbb = useSelector(state => state.productPageManager.selectedOptionalAdditions);
    //const selectedOptionalAdditions = useSelector(state => state.productPageManager.selectedOptionalAdditions);
    const selectedVariants = useSelector(state => state.productPageManager.selectedVariants);


    const initializeVariants = () => {
        //the essential variant fields are 'id', 'active', 'price'  (set to null by default) they are fields that concern the variant (give information on the variant) more than the product
        const essentialVariantFields = ['id', 'active', 'price', 'add-by-default'];
        // this array will hold the non-essential variant fields that are needed to create a variant, the fields that will give information on the product not the variant
        const productVariantFields = [];

        //a variant object that will assing an array of variants to a key that is that represents thier hierarchical level
        //the key will be the length of the variant fields, since a higher level variant will have field X, and the lower level variant will have field X as well
        //so the length shows the hierarchy level
        //lower level variants hold lower and upper level fields
        const variantsObj = {};
        //the fields that are changed or varried from the original product
        //each variant will have values that differ from the original product
        //thus creating a variant
        //this obj holds those adjusted values in a hierarchical manner same as the variant obj
        //a key will represent an array of fields
        //the key will be the same as the variants object
        //thus a key will give you an array of fields if plugged into productFieldsObj
        //and the key will also give you an array of variants if plugged into variantsObj
        //the smallest key shows the highest hierarchical level variants and the largest key shows the lowest hierarchical level variants
        //higher level could be a color,
        //and a smaller level could be a size
        //each color variant will have different sizes (several size variants)
        const productFieldsObj = {};
        const activeVariants = _variants.filter(variant=>{
            //only consider variants that are active, inactive variants are not used, (chosen by the producer of the product)
            if (variant.active){
                //get an array of the fields of the variant
                const fields = Object.keys(variant);
                //console.log('fields: ', fields);
                //get its length for later use, 
                //NOTE: the smallest length is 4, since the essential variant fields are 3 and in order to exist in needs to modify a field in the product
                // so the smallest length is 4
                // and the largest length is the length of the variant fields array
                // a length of 4, indictes one field is varried from the product
                // => the variant with length 4 is only controlled by one field
                // while more than 4 means multiple fields are varied from the product
                // so the variant is controlled by more than one field
                //example variant X controlled by only color will be 'blue'
                // while a variant Y controlled by color and size ('blue' and '12oz') will be visible only when the variantX is selected
                const length = fields.length;
                fields.forEach(field=>{
                    //if it is included in essentialVariantFields => it is an essential field, no nned to operate on it
                    if (!essentialVariantFields.includes(field)) {
                        if(!productVariantFields.includes(field)) productVariantFields.push(field);
                        //if there's a length key in productFieldsObj=> means theres an array of fields, just add to it
                        //if not create a new array
                        if(`${length}` in productFieldsObj){
                            //make sure no duplicates are added
                            if(!productFieldsObj[`${length}`].includes(field)) productFieldsObj[`${length}`].push(field);                 
                        }else{
                            productFieldsObj[length] = [field];
                        }

                    };
                })
                //if there's a length key in variantsObj=> means theres an array of variants, just add to it
                //if not create a new array
                if (`${length}` in variantsObj) {
                    variantsObj[`${length}`].push(variant);
                } else {
                    variantsObj[length] = [variant];
                }
                //get the variants that the producer set as default => selected by default, if customer didn't specify variants, those will be the variants
                if (variant['add-by-default']) {
                    dispatch(selectVariant(variant, length));
                }              
                
                return true;
            }
            return false;
        })
        //the start index is going to be the length of the upper level variants 
        //which will affect one field in the product
        //=> essential fields that exist in every variant length + 1 for the field
        //because the keys are the lenghts of the variants' keys
        const startIndex = essentialVariantFields.length + 1;
        dispatch(setStartIndex(startIndex));
        //end index will depend on how many hierarchical levels there are
        //which is also the number of altered fields from the product
        const endIndex = productVariantFields.length + startIndex;
        dispatch(setEndIndex(endIndex));        
        return { variantsObj, productFieldsObj, startIndex, endIndex, productVariantFields };
    }

    const initializeOptionalAdditions = () => {
        // will hold a key (type of the additions) and a value (array of the additions in that type) pairs
        const optionalAdditionsObj = {};
        _optionalAdditions.map((addition, index) => {
            //only add active additions, inactive ones are set to false by the producer
            if (addition.active){
                //check if there's an array of additions that have the same type
                //if there is an array, add this addition to it
                //if there's no array, create a new array with this addition
                const array = [addition, ...optionalAdditionsObj[`${addition.type}`] || []];
                optionalAdditionsObj[`${addition.type}`] = array;
                //get the additions that the producer set as default => selected by default, if customer didn't specify add-ons, those will be the add-ons
                if (addition['add-by-default']) {
                    dispatch(addOptionalAddition(addition));
                }  
                        
            }
        })   
        return optionalAdditionsObj;
    }

    useEffect(() => {

        if(!initialized){
            const { variantsObj, productFieldsObj, startIndex, endIndex, productVariantFields } = initializeVariants();
            const optionalAdditionsObj = initializeOptionalAdditions();
    
            //fields that have been looped through and used
            const usedFields = [];
    
            const variantsContent = [];
            //console.log('startIndex: ', startIndex, 'endIndex: ', endIndex)
            for (let i = startIndex; i < endIndex; i++) {
                //only get the fierst field of the not sused fields which is the only one that is not used
                const parentProductField = usedFields.length >0? usedFields[usedFields.length - 1] : null;
                const productField = productFieldsObj[i].filter(field=>(!usedFields.includes(field)))[0];
                dispatch(setVariantField(productField, i));
                usedFields.push(productField);
                const variants = variantsObj[i];
                //console.log('parentProductField: ', parentProductField)
                variantsContent.push(
                    <Variant parentProductField={parentProductField} key={i} index={i} productField={productField} variants={variants} />
                );
            }
            
    
    
    
    
    
            const optionalAdditionsContent = [];
            //loop through the optional additionsObj and create JSX elements for each addition type
            const additionTypes = Object.keys(optionalAdditionsObj);
            additionTypes.forEach(additionType => {
                //get the array of additions of the current type
                const additions = optionalAdditionsObj[additionType];
                optionalAdditionsContent.push(
                    <OptionalAddition type={additionType} optionalAdditions={additions}/>
                )
            })
    
    
            setVariantsContent(variantsContent);
            setOptionalAdditionsContent(optionalAdditionsContent);
            setInitialized(true);            
        }
    
    }, [initialized, dispatch]);
    


  return (
    <div className='product-page-product-options-section'>
        <h2>Product Options</h2>
        {
            variantsContent
        }
        <h2>Add-ons</h2>
        {
            optionalAdditionsContent
        }
        <button onClick={()=>{console.log(selectedVariants)}} >Debug</button>
    </div>
  )
}


