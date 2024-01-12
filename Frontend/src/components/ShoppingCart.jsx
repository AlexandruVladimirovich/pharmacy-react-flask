import React, { useEffect, useState } from 'react';
import QButton from './QButton';
import axios from 'axios';
import { message, FloatButton } from 'antd';
import { useAuth } from '../context/AuthContext';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const { authToken } = useAuth();


  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    axios.get('http://127.0.0.1:5000/get_cart_items', {
      headers: { Authorization: authToken },
    })
      .then(response => {
        console.log(response.data);
        setCartItems(response.data.cart_items);
        setTotalAmount(response.data.total_amount);
      })
      .catch(error => {
        console.error(error);
      });
  };

 

  const handlerDelBasketItem = (productId) => {
    axios.post('http://127.0.0.1:5000/delete_from_cart', 
      { product_id: productId }, 
      { headers: { Authorization: authToken } }
      )
      .then(response => {
        console.log(response.data);
        fetchCartItems();
        message.success('Товар удален из корзины.');
      })
      .catch(error => {
        console.error(error);
        message.error('Error deleting item from cart. Check console for details.');
      });
  };

  const handlePlaceOrder = () => {
    axios.post('http://127.0.0.1:5000/place_order', {
      address,
      telNumber,
      cartItems,
    }) 
      .then(response => {
        console.log(response.data);
        message.success('Заказ успешно оформлен.');
      })
      .catch(error => {
        console.error(error);
        message.error('Ошибка при оформлении заказа. Проверьте консоль для деталей.');
      });
  };


  return (
    <div className="shoppingCart">
      <div className="shoppingCart-title">
        <h2>Your Shopping Cart:</h2>
      </div>
      <div className="shoppingCart-header">
        <div className="item"></div>
        <div className="shoppingCart-title">
          <p>Name</p>
        </div>
        <div className="shoppingCart-quantity">
          <p>Quantity</p>
        </div>
        <div className="shoppingCart-price">
          <p>Price</p>
        </div>
        <div className='shoppingCart-del'></div>
      </div>

      <div className="shoppingCart-items">
        {cartItems.map(item => (
          <div className="shoppingCart-items_item" key={item.id}>
            <div className="item-img">
              <img src={item.img} alt="" />
            </div>
            <div className="shoppingCart-item-title">
              <p>{item.name}</p>
            </div>
            <div className="shoppingCart-quantity">
              <QButton quantity={item.quantity} productId={item.id} authToken={authToken} />
            </div>
            <div className="shoppingCart-item-price">
              {item.price}
            </div>
            <div className='shoppingCart-item-del'>
              <button onClick={() => handlerDelBasketItem(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="shoppingCart-items_item">
        <div className="item-img"></div>
        <div className="shoppingCart-item-title"></div>
        <div className="shoppingCart-quantity"></div>
        <div className="shoppingCart-item-price">
          Total: {totalAmount} lei
        </div>
        <div className='shoppingCart-item-del'>
          <button onClick={handlePlaceOrder}>Check Out</button>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
