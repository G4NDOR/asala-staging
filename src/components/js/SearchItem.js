import React, { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../../constants/appConstants';
import Paths from '../../constants/navigationPages';
import { resetLoading, triggerLoading } from '../../redux/ducks/appVars';
import { addSearchItems, resetSearching, setLastSearchedDoc, setSearchBarIsOpen, setSearchItems, setSearchTerm, triggerSearching } from '../../redux/ducks/homePageManager';
import { loadSearchResultsProducts } from '../../utils/firestoreUtils';
import '../css/SearchItem.css';

const SearchItem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchTerm = useSelector(state => state.homePageManager.searchTerm);
    const items = useSelector(state => state.homePageManager.items);
    const isOpen = useSelector(state => state.homePageManager.searchBarIsOpen);
    const lastSearchedDoc = useSelector(state => state.homePageManager.lastSearchedDoc);
    const [shake, setShake] = useState(true);

    const toggleSearch = () => {
        if (!isOpen) ; // Stop shaking when opened;
        if (isOpen) {
            //closing search bar
            //dispatch(setLoad)
            dispatch(setSearchTerm(''));
            dispatch(resetSearching());
            navigate(Paths.HOME);
        }  // Reset searching when closed;
        setIsOpen(!isOpen);
        
    };

    useEffect(() => {
        if (!isOpen) {
            const shakeInterval = setInterval(() => {
                setShake(true);
                setTimeout(() => setShake(false), 500); // Shake for 0.5s
            }, 1000); // Shake every 10 seconds

            return () => clearInterval(shakeInterval); // Cleanup interval on unmount
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const searchValue = e.target.value;
        dispatch(setSearchTerm(searchValue));
    };

    const submitSearch = async () => {
        dispatch(triggerLoading());
        const validatedSearchTerm = searchTerm.trim().toLowerCase();
        //console.log('Searching for:', validatedSearchTerm);
        if ( validatedSearchTerm == '') {
            dispatch(resetLoading());
            return;
        }
        //console.log('validatedSearchTerm not empty:', validatedSearchTerm);
        dispatch(triggerSearching());
        //items that have loaded before and are stored locally
        //const searchedList = items.filter(item => item.name.toLowerCase().includes(validatedSearchTerm));
        //console.log('Search results:', searchedList);
        //dispatch(setSearchItems(searchedList));
        const fetchedData = await loadSearchResultsProducts(validatedSearchTerm, lastSearchedDoc);// returns {products: [], lastDoc: doc};
        const fetchedItems = fetchedData.products;
        const lastFetchedSearchedItem = fetchedItems.lastDoc;
        //console.log('fetched items:', fetchedItems);
        //dispatch(addSearchItems(fetchedItems));
        dispatch(setSearchItems(fetchedItems));
        dispatch(setLastSearchedDoc(lastFetchedSearchedItem));
        dispatch(resetLoading());

        navigate(Paths.SEARCH)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitSearch();
        }
    };

    function processText(text) {
        if (typeof text === 'string') {
            return text.toLowerCase();
        }
        return ''; // or handle the error accordingly
    }

    const setIsOpen = (isOpen) => {
        dispatch(setSearchBarIsOpen(isOpen));
    }

    return (
        <div className={`search-container  ${isOpen ? 'open' : 'search-closed'}`} style={{zIndex:`${CONSTANTS.Z_INDEXES.SEARCH_BAR}`}}>
            <div className={`search-icon ${isOpen ? '':'shake'}`} onClick={toggleSearch}>
                {isOpen ? <FaTimes /> : <FaSearch />}
            </div>
            <div className={`search-bar ${isOpen? 'bar-visible' :'bar-invisible'}`}>
                <input
                 type="text" 
                 value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                 placeholder="Search..." 
                />
            </div>
        </div>
    );
};

export default SearchItem;
