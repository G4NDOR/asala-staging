import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import DEFAULT_VALUES from '../../constants/defaultValues';
import { setAddress, setNotes } from '../../redux/ducks/productPageManager';
import '../css/AddressSelector.css';

const AddressSelector = () => {
  const dispatch = useDispatch();
  const address = useSelector(state => state.productPageManager.address);
  const notes = useSelector(state => state.productPageManager.notes);
  const apiKey = DEFAULT_VALUES.API_KEY;//process.env.GOOGLE_API_KEY

  useEffect(() => {
    console.log(address);
  
    return () => {
      
    }
  }, [address]);
  
  const onAddresschnaged = (address) => {
    dispatch(setAddress(address.label));
  }

  const noNotesChanged = (notes)=> {
    dispatch(setNotes(notes));
  }

  return (
    <div className="address-selector">
      <GooglePlacesAutocomplete
        apiKey={apiKey}
        selectProps={{
          value: address,
          onChange: onAddresschnaged,
          placeholder: ".  Enter delivery address",
          styles: {
            input: (provided) => ({
              ...provided,
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '1rem',
            }),
            control: (provided) => ({
              ...provided,
              marginBottom: '10px',
            }),
          },
        }}
      />
      {address && (
        <textarea
          className="address-notes"
          placeholder="Additional notes or requests"
          value={notes}
          onChange={(e) => noNotesChanged(e.target.value)}
        />
      )}
    </div>
  );
};

export default AddressSelector;
