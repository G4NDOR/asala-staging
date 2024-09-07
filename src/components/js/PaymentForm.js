import React from 'react'
import '../css/PaymentForm.css'
import TextInput from './TextInput'
import EmailInput from './EmailInput'
import PhoneNumberInput from './PhoneNumberInput'
import { useDispatch, useSelector } from'react-redux';
import Paths from '../../constants/navigationPages';
import { setEmail, setName, setPhone } from '../../redux/ducks/orderManager';

export default function PaymentForm({visible}) {
    const dispatch = useDispatch();
    const isMobile = useSelector(state => state.appVars.screenWidthIsLessThan480)
    const isNotMobile = !isMobile;
    const currentPage = useSelector(state => state.appVars.currentPage);
    const isInHomePage = currentPage === Paths.HOME;
    const isInCartComponentInHomePage = isInHomePage && isNotMobile;
    const name = useSelector(state => state.orderManager.name);
    const email = useSelector(state => state.orderManager.email);
    const phone = useSelector(state => state.orderManager.phone);
    const classNameString = `payment-form ${(isInCartComponentInHomePage || !visible)? 'invisible' : ''}`;

    const headerString = 'Checkout Information';
    const nameLabel = 'Name';
    const phoneLabel = 'Phone';
    const emailLabel = 'Email';

    const onChangeName = (name) => {
        console.log('name changed: ', name);
        dispatch(setName(name));
    }

    const onChangePhone = (phone) => {
        console.log('phone changed: ', phone);
        dispatch(setPhone(phone));
    }

    const onChangeEmail = (email) => {
        console.log('email changed: ', email);
        dispatch(setEmail(email));
    }


  return (
    <div className={classNameString} >
        <span className='payment-form-header'>{headerString}</span>
        <TextInput label={'name'} value={name} onChange={onChangeName} />
        <EmailInput label={'email'} value={email} onChange={onChangeEmail} />
        <PhoneNumberInput label={'phone'} value={phone} onChange={onChangePhone} />
    </div>
  )
}
