import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import News from './pages/News';
import Products from './pages/Products';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import AddNews from './components/AddNews';
import AdminPanelOrders from './components/AdminPanelOrders';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import Account from './pages/Account';
import ShoppingCart from './components/ShoppingCart';
import Orders from './components/Orders'
import Feedback from './pages/Feedback';
import AccountDetails from './components/AccountDetails';


function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Router>
          <div className="wrapper">
            <Header />
            <Routes>
              <Route path="/" element={<News />} />
              <Route path="/Products" element={<Products />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/AdminPanel" element={<AdminPanel />} />
              <Route path='/AddNews' element={<AddNews />} />
              <Route path="/Account" element={<Account />} />
              <Route path="/ShoppingCart" element={<ShoppingCart />} />
              <Route path="/AdminPanelOrders" element={<AdminPanelOrders />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/Feedback" element={<Feedback />} />
              <Route path="/AccountDetails" element={<AccountDetails />} />
            </Routes>
          </div>
        </Router>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
