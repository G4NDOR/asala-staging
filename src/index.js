import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
// Import CSS
import './index.css';
// Import Redux
import { Provider } from 'react-redux';
import store from './redux/store';
// Import Router components
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
// Import page components
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
// Import paths
import Paths from './constants/navigationPages';
import ConfirmationPage from './pages/ConfirmationPage';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/AdminDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <Routes >
        <Route path={Paths.HOME} element={<Home/>} />
        <Route path={Paths.CART} element={<CartPage/>} />
        <Route path={Paths.PRODUCT} element={<ProductPage/>} />
        <Route path={Paths.CONFIRMATION} element={<ConfirmationPage/>} />
        <Route path={Paths.SEARCH} element={<SearchPage/>} /> 
        <Route path={Paths.ADMIN} element={<AdminDashboard/>} /> 
        {/* You can add more routes here */}
        {/* <Route path="/another-page" element={AnotherPage} /> */}
      </Routes >
    </Router>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
