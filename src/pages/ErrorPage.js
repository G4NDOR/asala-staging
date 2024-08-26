import React from 'react';
import '../styles/ErrorPage.css';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const ErrorPage = () => {
  const navigate = useNavigate();

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
    </div>
  );
};

export default ErrorPage;
