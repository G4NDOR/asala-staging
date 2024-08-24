import React, { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Paths from '../../constants/navigationPages';
import { triggerLoading } from '../../redux/ducks/appVars';
import { resetSearching, setSearchBarIsOpen, setSearchItems, setSearchTerm, triggerSearching } from '../../redux/ducks/homePageManager';
import '../css/SearchItem.css';

const SearchItem = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchTerm = useSelector(state => state.homePageManager.searchTerm);
    const items = useSelector(state => state.homePageManager.items);
    const isOpen = useSelector(state => state.homePageManager.searchBarIsOpen);
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

    const submitSearch = () => {
        dispatch(triggerLoading());
        const validatedSearchTerm = searchTerm.trim();
        console.log('Searching for:', validatedSearchTerm);
        if ( validatedSearchTerm == '') return;
        console.log('Searching for:', validatedSearchTerm);
        dispatch(triggerSearching());
        const searchedList = items.filter(item => item.name.toLowerCase().includes(validatedSearchTerm.toLowerCase()));
        console.log('Search results:', searchedList);
        dispatch(setSearchItems(searchedList));

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
        <div className={`search-container  ${isOpen ? 'open' : 'search-closed'}`}>
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
