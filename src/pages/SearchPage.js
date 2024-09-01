import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import DEFAULT_VALUES from '../constants/defaultValues';
import Paths from '../constants/navigationPages';
import { resetLoading, triggerLoading } from '../redux/ducks/appVars';
import '../styles/SearchPage.css'
import LoadingAnimation from '../components/js/LoadingAnimation';
import ProductCard from '../components/js/ProductCard';
import ProductsContainer from '../components/js/ProductsContainer'
import SearchItem from '../components/js/SearchItem';
import Messages from '../components/js/Messages';

export default function SearchPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchItems = useSelector(state => state.homePageManager.searchItems);
    const loading = useSelector(state => state.appVars.loading);
    const homePageVisited = useSelector(state => state.appVars.homePageVisited);
    const homePageNotVisited = !homePageVisited;

    useEffect(() => {
        
        if (homePageVisited) load();
      
        return () => {
          dispatch(triggerLoading());
        }
    }, [])

    useEffect(() => {
        if (homePageNotVisited) {
          navigate(Paths.HOME);
        }
      }, [navigate]);

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
        <Messages />
    </div>
  )
}
