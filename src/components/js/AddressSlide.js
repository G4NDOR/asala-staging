import React, { useEffect } from 'react'
import '../css/AddressSlide.css'
import { useSelector, useDispatch } from'react-redux'
import { setAddress, setSelectedAddressId } from '../../redux/ducks/productPageManager';
import DEFAULT_VALUES from '../../constants/defaultValues';
import CONSTANTS from '../../constants/appConstants';
import { addMessage } from '../../redux/ducks/appVars';

export default function AddressSlide({address, id}) {
  const dispatch = useDispatch();
  const stateAddress = useSelector(state => state.productPageManager.address);
  const selectedAddressId = useSelector(state => state.productPageManager.selectedAddressId);
  const selected = stateAddress == address;

  useEffect(() => {
    console.log('address changed', stateAddress, id);
    ////if(selected) selectAddress();
    //else deselectAddress();
  
    return () => {
      
    }
  }, [stateAddress])
  

  const selectAddress = () => {
    if (address !== stateAddress) {
      dispatch(setAddress(address));
      const message = { content: `Changed address to: ${address}`, severity: CONSTANTS.SEVERITIES.INFO };
      dispatch(addMessage(message))         
    }
  }

  const deselectAddress = () => {
    dispatch(setSelectedAddressId(DEFAULT_VALUES.SELECTED_ADDRESS_ID));
  }

  return (
    <div onClick={selectAddress} className={`address-slide ${selected? 'selected':''}`} >{address}</div>
  )
}
