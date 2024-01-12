import React, { useState } from 'react';
import Orders from '../components/Orders'
import AccountDetails from '../components/AccountDetails'
import { useAuth } from '../context/AuthContext';
import Feedback from './Feedback';
import ShoppingCart from '../components/ShoppingCart';

export default function Account() {

  const { firstName } = useAuth();

  const [currentTab, setCurrentTab] = useState('details');

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className='account'>
      <aside className='account-aside'>
        <h2>Hello, {firstName}</h2>
        <p onClick={() => handleTabClick('details')}>Account Details</p>
        <p onClick={() => handleTabClick('shoping-cart')}>Shopping Cart</p>
        <p onClick={() => handleTabClick('orders')}>Orders</p>
        <p onClick={() => handleTabClick('feedback')}>Feedback</p>
      </aside>
      <div className="account-info">
        {currentTab === 'details' && <AccountDetails />}
        {currentTab === 'shoping-cart' && <ShoppingCart />}
        {currentTab === 'orders' && <Orders />}
        {currentTab === 'feedback' && <Feedback />}
      </div>
    </div>
  );
}
