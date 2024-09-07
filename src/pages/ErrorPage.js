import React, { useEffect } from 'react';
import '../styles/ErrorPage.css';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import Messages from '../components/js/Messages';
import Paths from '../constants/navigationPages';
import { setCurrentPage } from '../redux/ducks/appVars';
import { useDispatch } from 'react-redux';

const ErrorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setCurrentPage(Paths.ERROR));
  
    return () => {
      
    }
  }, [])
  

  const handleGoHome = () => {
    navigate('/'); // Redirect to the home page or any other route
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">Oops!</h1>
        <p className="error-message">Something went wrong. Please try again later.</p>
        <button className="error-button" onClick={handleGoHome}>Go Home</button>
      </div>
      <Messages />
    </div>
  );
};

export default ErrorPage;
