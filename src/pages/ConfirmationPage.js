import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Paths from '../constants/navigationPages';
import '../styles/ConfirmationPage.css';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10); // Set the timer to 10 seconds
  const success = false;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer);
          navigate(Paths.HOME);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="confirmation-page">
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
        <button className="continue-button" onClick={() => navigate(Paths.HOME)}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
