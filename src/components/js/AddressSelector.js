import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import CONSTANTS from '../../constants/appConstants';
import DEFAULT_VALUES from '../../constants/defaultValues';
import { FIREBASE_DOCUMENTS_FEILDS_UNITS } from '../../constants/firebase';
import { addMessage } from '../../redux/ducks/appVars';
import { addAddress, setAddress, setGeoPoint, setNotes } from '../../redux/ducks/productPageManager';
import '../css/AddressSelector.css';
import { haversineDistance, isLocationInRange } from '../../utils/appUtils';
import MapComponent from './Map';

const AddressSelector = ({visible=true}) => {
  const dispatch = useDispatch();
  const address = useSelector(state => state.productPageManager.address);
  const notes = useSelector(state => state.productPageManager.notes);
  const deliveryRange = useSelector(state => state.appVars.deliveryRange);
  const circle = FIREBASE_DOCUMENTS_FEILDS_UNITS.RANGES.TYPE.CIRCLE;
  const rectangle = FIREBASE_DOCUMENTS_FEILDS_UNITS.RANGES.TYPE.RECTANGLE;
  const rangeObj = (deliveryRange?.type == circle)? 
  {
    radius: deliveryRange.radius,
    location: deliveryRange.center
  }: 
  deliveryRange?.type == rectangle?
  {
    bounds: [
      { lat: deliveryRange.south, lng: deliveryRange.west },
      { lat: deliveryRange.north, lng: deliveryRange.east }
    ]
  }:
  {};
  const apiKey = DEFAULT_VALUES.API_KEY;//process.env.GOOGLE_API_KEY
  
  const onAddresschanged = (value) => {
    
    //const selectedLocation = address.value.geometry.location;
    //const deliveryLocation = deliveryRange.center;
    const radiusInMeters = deliveryRange.radius;
    // console.log('value:', value);
    geocodeAddress(value).then((location) => {
      // console.log('Location:', location);
      if (!location) {
        dispatch(addMessage({ content: 'An error occurred. Please try again later.', severity: CONSTANTS.SEVERITIES.ERROR }));
        return;
      }
      const locationIsInRange = isLocationInRange(location, deliveryRange);
  
      if (locationIsInRange) {
        dispatch(setGeoPoint(location))
        dispatch(setAddress(value));
        dispatch(addMessage({ content: `Changed address to: ${value}`, severity: CONSTANTS.SEVERITIES.INFO }));
        dispatch(addAddress(value));
      } else {
        dispatch(addMessage({ content: 'Selected address is out of the delivery range.', severity: CONSTANTS.SEVERITIES.WARNING }));
      }    
    }).catch((error) => {
      console.error('Error geocoding address:', error);
      dispatch(addMessage({ content: 'An error occurred. Please try again later.', severity: CONSTANTS.SEVERITIES.ERROR }));
    })

  }

  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const location = results[0].geometry.location;
          const _lat = location.lat();
          const _long = location.lng();
          resolve({ _lat, _long });
        } else {
          console.error('Geocoding failed:', status);
          reject(new Error('Geocoding failed'));
        }
      });
    });
  };

  const noNotesChanged = (notes)=> {
    dispatch(setNotes(notes));
  }

  

  return (
    <div className={`address-selector ${visible? '':'invisible'}`}>
      <GooglePlacesAutocomplete
        apiKey={apiKey}
        autocompletionRequest={{
          ...rangeObj
        }}        
        selectProps={{
          value: address,
          label: 'Current Address',
          onChange: (address) =>onAddresschanged(address.label),
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
      <MapComponent onLocationSelect={(geopoint, address)=>{onAddresschanged(address)}} />
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
