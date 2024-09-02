import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import DEFAULT_VALUES from '../../constants/defaultValues';
import { addMessage } from '../../redux/ducks/appVars';
import { addAddress, setAddress, setNotes } from '../../redux/ducks/productPageManager';
import '../css/AddressSelector.css';

const AddressSelector = ({visible=true}) => {
  const dispatch = useDispatch();
  const address = useSelector(state => state.productPageManager.address);
  const notes = useSelector(state => state.productPageManager.notes);
  const apiKey = DEFAULT_VALUES.API_KEY;//process.env.GOOGLE_API_KEY
  
  const onAddresschnaged = (address) => {
    const value = address.label;
    const message = { content: `Changed address to: ${value}`, severity: CONSTANTS.SEVERITIES.INFO };
    dispatch(setAddress(value));
    dispatch(addMessage(message))
    dispatch(addAddress(value));
  }

  const noNotesChanged = (notes)=> {
    dispatch(setNotes(notes));
  }

  return (
    <div className={`address-selector ${visible? '':'invisible'}`}>
      <GooglePlacesAutocomplete
        apiKey={apiKey}
        selectProps={{
          value: address,
          label: 'Current Address',
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
