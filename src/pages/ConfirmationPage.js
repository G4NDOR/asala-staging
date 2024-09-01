import React, { useEffect, useState } from 'react';
import { useSelector } from'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Paths from '../constants/navigationPages';
import '../styles/ConfirmationPage.css';
import { useDispatch } from 'react-redux';
import { resetLoading, setCurrentPage, triggerLoading } from '../redux/ducks/appVars';
import LoadingAnimation from '../components/js/LoadingAnimation';
import Messages from '../components/js/Messages';

const ConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10); // Set the timer to 10 seconds
  const homePageVisited = useSelector(state => state.appVars.homePageVisited);
  const success = true;

  useEffect(() => {
    if (homePageVisited){
      dispatch(resetLoading());
    }
  
    return () => {
      dispatch(triggerLoading());
    }
  }, [])

  //navigate function to change pages
  const navigateToPage = (path) => {
    dispatch(setCurrentPage(path));
    navigate(path);
  }  

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer);
          navigateToPage(Paths.HOME);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="confirmation-page">
      <LoadingAnimation/>
      <div className="confirmation-content">
        {success ? (
          <div className="success-message">
            <FaCheckCircle className="icon success-icon" />
            <h1>Order Successful!</h1>
            <p>Thank you for your purchase. Your order is on its way.</p>
          </div>
        ) : (
          <div className="failure-message">
            <FaTimesCircle className="icon failure-icon" />
            <h1>Order Failed</h1>
            <p>Something went wrong. Please try again or contact support.</p>
          </div>
        )}

        <p className="redirect-message">
          Redirecting to the home page in {timeLeft} seconds...
        </p>
        <button className="continue-button" onClick={() => navigateToPage(Paths.HOME)}>
          Continue Shopping
        </button>
      </div>
      <Messages />
    </div>
  );
};

export default ConfirmationPage;
