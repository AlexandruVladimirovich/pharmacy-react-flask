import React, { useState } from 'react';
import Orders from '../components/Orders'
import AccountDetails from '../components/AccountDetails'
import Basket from '../components/Basket'
import { useAuth } from '../context/AuthContext';
import Feedback from './Feedback';

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
        <button onClick={() => handleTabClick('details')}>Account Details</button>
        <button onClick={() => handleTabClick('basket')}>Basket</button>
        <button onClick={() => handleTabClick('orders')}>Orders</button>
        <button onClick={() => handleTabClick('feedback')}>Feedback</button>
      </aside>
      <div className="account-info">
        {currentTab === 'details' && <AccountDetails />}
        {currentTab === 'basket' && <Basket />}
        {currentTab === 'orders' && <Orders />}
        {currentTab === 'feedback' && <Feedback />}
      </div>
    </div>
  );
}
