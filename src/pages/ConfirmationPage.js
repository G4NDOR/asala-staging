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
import { checkOrderStatus } from '../utils/firestoreUtils';
import CONSTANTS from '../constants/appConstants';

const ConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10); // Set the timer to 10 seconds
  const [loaded, setLoaded] = useState(false)
  const homePageVisited = useSelector(state => state.appVars.homePageVisited);
  const paymentMethod = useSelector(state => state.orderManager.paymentMethod);
  const [success, setSuccess] = useState(false)

  const load = async () => {
    //if (paymentMethod == CONSTANTS.PAYMENT_METHODS.CASH) {
    //  setSuccess(true)
    //  dispatch(resetLoading())
    //  return
    //}
    const orderId = new URLSearchParams(window.location.search).get('orderId');
    if (!orderId ) {
      //user navigated to the page in a wrong way
      //send him back to the home page
      navigateToPage(Paths.HOME);
      return
    } else if (orderId == 'none') {
      //in person payment
      //order alredy placed
      setSuccess(true)
      setLoaded(true)
      dispatch(resetLoading())
      return
    }
    const order = await checkOrderStatus(orderId);
    if (order == null) {
      //there was an error retrieving the order, or the order doesn't exist
      //show error message and go to error page
      navigateToPage(Paths.ERROR);//TODO: show error message
    } else if (order.status == 'pending') {
      //order has been created in the database but not yet placed for the producer to process
      //probably because it is an online payment order and the payment is not completed yet
      setSuccess(false)
    } else {
      //order has been placed successfully wait for preparation and delivery
      setSuccess(true)
    }
    setLoaded(true)
    dispatch(resetLoading())
  }

  useEffect(() => {
    dispatch(setCurrentPage(Paths.CONFIRMATION));
    if (!loaded) load();
  
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
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    //Navigate to home page after timer finishes
    if (timeLeft <= 1) {
      navigateToPage(Paths.HOME);
    }

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

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
