import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import '../css/Map.css'; // Make sure this path matches your project structure
import DEFAULT_VALUES from '../../constants/defaultValues';
import ButtonsContainer from './ButtonsContainer';
import CONSTANTS from '../../constants/appConstants';
import { addMessage } from '../../redux/ducks/appVars';
import { useDispatch } from'react-redux';
import { MdMyLocation } from "react-icons/md";

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 37.7749,  // Default: San Francisco latitude
  lng: -122.4194, // Default: San Francisco longitude
};

function MapComponent({ onLocationSelect }) {
    const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Geocode the selected location to get address
  const geocodeLatLng = async (latLng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          onLocationSelect(latLng, results[0].formatted_address);
        } else {
          setAddress('No address found');
        }
      } else {
        setAddress('Geocoder failed due to: ' + status);
      }
    });
  };

  const onMapClick = useCallback((event) => {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(latLng);
    geocodeLatLng(latLng);
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(currentLocation);
          setSelectedLocation(currentLocation);
          geocodeLatLng(currentLocation);
        },
        () => {
        //   console.log('Geolocation failed or was denied.');
          dispatch(addMessage({ content: 'Please allow location access on this site to continue.', severity: CONSTANTS.SEVERITIES.ERROR }));
        }
      );
    }
  };  

  const getCurrentLocationButton = {
    activeContent: "Get Current Location",
    generalClassName: "product-page-get-current-location-button",
    activeAction: getCurrentLocation,    
  }

  const buttonsDetails = [
    getCurrentLocationButton
  ]

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={DEFAULT_VALUES.API_KEY}>
        <ButtonsContainer buttonsDetails={buttonsDetails}/>
        {
            // <MdMyLocation />
        }
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={onMapClick}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
      </LoadScript>
      <div className="location-details">
        {selectedLocation && false && (
          <>
            <p>Coordinates: {`Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`}</p>
            <p>Address: {address}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default MapComponent;
