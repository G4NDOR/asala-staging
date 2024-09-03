import React from 'react'
import '../css/ChargeInfo.css'
import CONSTANTS from '../../constants/appConstants';

const ChargeInfo = ({ charge, visible = true }) => {

    const CHARGE_INFO_TYPES = CONSTANTS.CHARGE_INFO_TYPES;
    const { SUBTOTAL, DISCOUNT, DELIVERY, TAX, TOTAL, SAVINGS } = CHARGE_INFO_TYPES;
    const chargeType = charge.type;
    const chargeValue = charge.value;


    const getChargeInfoTitleString = (type) => {
        let chargeInfoTitleString = '';
        switch (type) {
            case SUBTOTAL:
                chargeInfoTitleString = "Subtotal:";
                break;
            case DISCOUNT:
                chargeInfoTitleString = "Discount:";
                break;
            case DELIVERY:
                chargeInfoTitleString = "Delivery:";
                break;
            case TAX:
                chargeInfoTitleString = "Tax:";
                break;
            case TOTAL:
                chargeInfoTitleString = "Total:";
                break;
            case SAVINGS:
                chargeInfoTitleString = "Total Savings:";
                break;

            default:
                break;
        }
        return chargeInfoTitleString;
    }

    const getChargeInfoValueString = (type, value) => {
        let chargeInfoValueString = '';
        switch (type) {
            case SUBTOTAL:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case DISCOUNT:
                chargeInfoValueString = `-$${value.toFixed(2)}`;
                break;
            case DELIVERY:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case TAX:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case TOTAL:
                chargeInfoValueString = `$${value.toFixed(2)}`;
                break;
            case SAVINGS:
                chargeInfoValueString = `-$${value.toFixed(2)}`;
                break;
            default:
                break;
        }
        return chargeInfoValueString;
    }

    const getClassNameString = (type, invisible) => {
        const notInvisible = !invisible;
        let classNameString = '';
        switch (type) {
            case SUBTOTAL:
                classNameString = `receipt-subtotal ${visible && notInvisible? '': 'invisible'}`;
                break;
            case DISCOUNT:
                classNameString = `receipt-discount ${visible && notInvisible? '': 'invisible'}`;
                break;
            case DELIVERY:
                classNameString = `receipt-delivery ${visible && notInvisible? '': 'invisible'}`;
                break;
            case TAX:
                classNameString = `receipt-tax ${visible && notInvisible? '': 'invisible'}`;
                break;
            case TOTAL:
                classNameString = `receipt-total ${visible && notInvisible? '': 'invisible'}`;
                break;
            case SAVINGS:
                classNameString = `receipt-savings ${visible && notInvisible? '': 'invisible'}`;
                break;
            default:
                break;
        }
        return classNameString;
    }

    const getChargeInvisibility = (type) => {
        return (type === SAVINGS) && (chargeValue === 0);
    }

    const chargeInvisibility = getChargeInvisibility(chargeType);

    const chargeInfoTitleString = getChargeInfoTitleString(chargeType);
    const chargeInfoValueString = getChargeInfoValueString(chargeType, chargeValue);
    const classNameString = getClassNameString(chargeType, chargeInvisibility);

    return (
        <div className={classNameString}>
          <span>{chargeInfoTitleString}</span>
          <span>{chargeInfoValueString}</span>
        </div>
    );
}

export default ChargeInfo;
