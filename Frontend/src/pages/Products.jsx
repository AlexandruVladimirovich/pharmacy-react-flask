import React, {  useEffect } from 'react';
import AsideProducts from '../components/AsideProducts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext' 
import { message, FloatButton } from 'antd';

export default function Products() {

  const { authToken } = useAuth();
  const { products, fetchProducts } = useProducts(); 
  
  useEffect(() => {
    fetchProducts(); 
  }, []);
  
  const handlerAddToCart = (productId) => {  
    axios
      .post(
        'http://127.0.0.1:5000/add_to_cart',
        { product_id: productId },
        { headers: { Authorization: authToken } }
      )
      .then((response) => {
        console.log(response.data.message);
        message.success('Товар успешно добавлен в корзину!');
      })
      .catch((error) => {
        console.error(error);
        message.warning('Не удалось добавить товар в корзину. Пожалуйста, повторите попытку.');
      });
  };
  
  return (
    <div className="products">
      <AsideProducts />
      <div className="products-items">
        {products.map((item, index) => (
          <div key={index} id={item.id} className='products-item'>
            <img src={item.img} alt="" />
            <p>{item.name}</p>
            <p>{item.price} lei</p>
            <button className='product-btn' onClick={() => handlerAddToCart(item.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    <FloatButton.BackTop />
  </div>
  );
}