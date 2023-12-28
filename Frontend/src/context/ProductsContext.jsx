import React, { createContext, useState, useEffect, useContext } from 'react'; 
import axios from 'axios';

const ProductsContext = createContext();

export const ProductsProvider = ({ children, initialParams }) => {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useState(initialParams || {});
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/getproducts', { params });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params]);
  
  return (
    <ProductsContext.Provider value={{ products, fetchProducts, params, setParams }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductsContext);
};