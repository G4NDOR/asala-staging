import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import DEFAULT_VALUES from '../../constants/defaultValues';
import { resetLoading, triggerLoading } from '../../redux/ducks/appVars';
import '../css/SearchPage.css'
import LoadingAnimation from './LoadingAnimation';
import ProductCard from './ProductCard';
import ProductsContainer from './ProductsContainer'
import SearchItem from './SearchItem';

export default function SearchPage() {
    const dispatch = useDispatch();
    const searchItems = useSelector(state => state.homePageManager.searchItems);
    const loading = useSelector(state => state.appVars.loading);

    useEffect(() => {
        load();
      
        return () => {
          dispatch(triggerLoading());
        }
    }, [])

    const load = async () => {
        //behind scenes work

        //done with behind scenes work
        dispatch(resetLoading());
    }
  
  
    return (
    <div className='search-window' >
        <LoadingAnimation/>
        <SearchItem/>
        {
            (searchItems.length > 0)?
            
            <ProductsContainer />
            :
            <p style={{position:'absolute',top:'40%'}} >No items Found</p>
            
        }
    </div>
  )
}
