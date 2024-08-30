import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DiscountForm from '../components/js/DiscountForm';
import ProducerForm from '../components/js/ProducerForm';
import ProductForm from '../components/js/ProductForm';
import SelectInput from '../components/js/SelectInput';
import { FIREBASE_CLLECTIONS_NAMES } from '../constants/firebase';
import { setAccessGranted, setPassword, setSelectedCollection } from '../redux/ducks/admin';
import '../styles/AdminDashboard.css';



function AdminDashboard() {
    const dispatch = useDispatch();
    const COLLECTIONS = FIREBASE_CLLECTIONS_NAMES;
    const CORRECT_PASSWORD = 'admin123';//process.env.REACT_APP_ADMIN_PASSWORD
    const selectedCollection = useSelector(state => state.admin.selectedCollection);
    const password = useSelector(state => state.admin.password);
    const accessGranted = useSelector(state => state.admin.accessGranted);

    const label = 'Select Collection';
    const options = [
        { value: COLLECTIONS.PRODUCTS, label: 'Products' },
        { value: COLLECTIONS.PRODUCERS, label: 'Producers' },
        { value: COLLECTIONS.DISCOUNTS, label: 'Discounts' },
    ];
    
    const handleCollectionChange = (event) => {
        dispatch(setSelectedCollection(event.target.value));
    };

  
    const handlePasswordChange = (e) => {
      dispatch(setPassword(e.target.value));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (password === CORRECT_PASSWORD) {
        dispatch(setAccessGranted(true));
      } else {
        alert('Incorrect password');
      }
    };

    const showForm = () => {
        switch (selectedCollection) {
            case COLLECTIONS.PRODUCTS:
                return <ProductForm />;
            case COLLECTIONS.PRODUCERS:
                return <ProducerForm />;
            case COLLECTIONS.DISCOUNTS:
                return <DiscountForm />;
            default:
                return <ProductForm />;
        }
    };
  
    if (accessGranted) {
        return (
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                <SelectInput label={label} options={options} value={selectedCollection} onChange={handleCollectionChange} />
                {
                    showForm()
            
                }        
            </div>
        );
    }




  return (
        <div className="admin-dashboard">
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter admin password"
                />
                <button type="submit">Submit</button>
            </form>        
        </div>
  );
}

export default AdminDashboard;
