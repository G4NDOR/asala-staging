import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DEFAULT_VALUES from '../../constants/defaultValues';
import Paths from '../../constants/navigationPages';
import { CART, ONE_ITEM_CHECKOUT } from '../../constants/stateKeys';
import { addDiscount, banDiscount, deselectDiscount, removeDiscount, selectDiscount, setDiscountMessage, setDiscounts, setDiscountsLookedUp, setSelectedDiscounts, setUsedCredit } from '../../redux/ducks/orderManager';
import { loadDiscountsFromFirebase } from '../../utils/firestoreUtils';
import '../css/Discount.css'
import CheckboxGroup from './CheckboxGroup';

export default function Discount({visible=true}) {
    const dispatch = useDispatch();
    const label = "Discounts / Credit";
    const fetchDiscountsLabelInitial = "Find discounts/credit available";
    const fetchDiscountsLabelLoading = "looking...";
    const discounts = useSelector(state => state.orderManager.discounts);
    const message = useSelector(state => state.orderManager.discountMessage);
    const fetched = useSelector(state => state.orderManager.discountsLookedUp);
    const selectedDiscounts = useSelector(state => state.orderManager.selectedDiscounts);
    const bannedDiscountsIds = useSelector(state => state.orderManager.bannedDiscountsIds);
    const customerId = useSelector(state => state.appVars.customerId);
    const currentPage = useSelector(state => state.appVars.currentPage);
    const isInProductPageCheckout = currentPage === Paths.PRODUCT;
    //get a list identifier that is used as a key to get the right list
    //returns a key that gives access to the cart products or to the products list in the product page checkout
    //based on the current page (whether this Discount component is rendered in cart or in product page checkout )
    const getListIdentifier = () => {
        if(isInProductPageCheckout) return ONE_ITEM_CHECKOUT;
        return CART;
      }
    
      const listIdentifier = getListIdentifier();
      const products = useSelector((state) => state['orderManager'][`${listIdentifier}`]);

    const productsIds = products.map(product => product.id);
    const selectedDiscountsIds = selectedDiscounts.map(discount => discount.id);
    const options = discounts.map(discount => ({ value: discount.id, label: discount.name }));
    const customer = useSelector(state => state.appVars.customerDetails);
    console.log('customer: ', customer)
    const credit = customer.credit || null;
    const creditId = 'credit';
    const creditLabel = `$${credit} store credit`;
    const creditOption = { value: creditId, label: creditLabel };
    if (credit && credit > 0) options.push(creditOption);
    const isMobile = useSelector(state => state.appVars.screenWidthIsLessThan480);
    const [fetchDiscountsLabel, setFetchDiscountsLabel] = useState(fetchDiscountsLabelInitial)
    
    const isHomePage = currentPage === Paths.HOME;
    const visibleInHome = isMobile;
    const visibleInCartOrProductPages = true;
    const _visible = isHomePage? visibleInHome : visibleInCartOrProductPages;
    
    const canBeAppliedTogether = (discount1, discount2) => {
        //check if discounts can be applied together
        if ((discount1['opposing-discounts'].length == 0) && (discount2['opposing-discounts'].length == 0)) return true;
        const discount1Id = discount1.id;
        const discount2Id = discount2.id;
        
        const canNotBeAppliedTogether = discount1['opposing-discounts'].includes(discount2Id) || discount2['opposing-discounts'].includes(discount1Id) || discount1['opposing-discounts'].includes('all') || discount2['opposing-discounts'].includes('all');
        const canBeAppliedTogether =!canNotBeAppliedTogether;
        return canBeAppliedTogether;
    }

    const onChange = (discountId) => {
        const deselecting = selectedDiscountsIds.includes(discountId);
        
        let discount = discounts.find(discount => discount.id === discountId);
        if (!discount) discount = {...DEFAULT_VALUES.DISCOUNT, id: creditId, name: creditLabel, value: credit};
        if (deselecting) {
            //deselecting a discount
            //or credit
            if (discount.id == creditId) dispatch(setUsedCredit(0));
            dispatch(deselectDiscount(discount));
        } else if (discount.id == creditId) {
            //selecting credit
            dispatch(setUsedCredit(discount.value));
            dispatch(selectDiscount(discount));
        }else {
            //selecting a discount
            const selectionNotAllowed = selectedDiscounts.find(selectedDiscount => {
                const _canBeAppliedTogether = canBeAppliedTogether(selectedDiscount, discount);
                const canNotApplyTogether = !_canBeAppliedTogether;
                return canNotApplyTogether;
            })
            //bannedDiscountsIds.filter(id => id === discountId).length === 0;
            if(selectionNotAllowed) {
                showMessageToUser(discount);
            } else if(discount.product == 'all') {
                //it is a general discount => it can apply on any product
                //remove it from discounts array and add variants of it based on each product to the discounts array
                dispatch(removeDiscount(discount));
                products.forEach(product => {
                    const newDiscount = {
                        ...discount,
                        product: product.id,
                        id: `${discount.id}_${product.id}`,
                        name: `${discount.name} (${product.name})`,
                        "opposing-discounts": [
                            ...discount['opposing-discounts'],
                            'all'
                        ]
                    };
                    dispatch(addDiscount(newDiscount))
                })

                
            } else {
                //selecting a discount
                //show message what quantity it applies on
                
                dispatch(selectDiscount(discount));                
            }
            
        }
    }

    const load = async () => {
        setFetchDiscountsLabel(fetchDiscountsLabelLoading)

        //fetch discounts from server
        const fetchedDiscounts = await loadDiscountsFromFirebase(customerId, productsIds);
        dispatch(setDiscountsLookedUp(true));
        if (fetchedDiscounts.length === 0) {
            dispatch(setDiscountMessage("No discounts available."));
            setTimeout(() => {
                dispatch(setDiscountMessage(""));
                dispatch(setDiscountsLookedUp(false));
                setFetchDiscountsLabel(fetchDiscountsLabelInitial);
            }, 10000);
            return;
        }
        dispatch(setDiscounts(fetchedDiscounts))
    }


    const showMessageToUser = () => {
        console.log('show message to user');
    }



      
    

  return (
    <div className={`checkout-apply-discount ${(visible && _visible)? '':'invisible'}`}>
        <button onClick={load} className={`fetch-discounts-btn ${(fetched)? 'invisible':''}`}>
            {fetchDiscountsLabel}
        </button>
        {
            fetched && discounts.length > 0?
            <CheckboxGroup label={label} options={options} values={selectedDiscountsIds} onChange={onChange} />:
            null
        }
        <p className={(fetched && discounts.length == 0)? '': 'inisible'}>{message}{fetched}</p>
    </div>
  )
}
