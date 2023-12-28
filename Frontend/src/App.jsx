import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import News from './pages/News';
import Products from './pages/Products';
import Login from './pages/Login';
import Basket from './components/Basket';
import AdminPanel from './pages/AdminPanel';
import Feedback from './pages/Feedback';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import Account from './pages/Account';


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
              <Route path="/Basket" element={<Basket />} />
              <Route path="/AdminPanel" element={<AdminPanel />} />
              <Route path="/Account" element={<Account />} />
            </Routes>
          </div>
        </Router>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
