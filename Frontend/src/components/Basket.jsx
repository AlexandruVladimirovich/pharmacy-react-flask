import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { message, FloatButton } from 'antd';


export default function Basket() {
  const { authToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, [authToken]);

  const fetchCartItems = () => {
    axios.get('http://127.0.0.1:5000/get_cart_items', {
      headers: { Authorization: authToken },
    })
      .then(response => {
        console.log(response.data);
        setCartItems(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlerDelBasketItem = (productId) => {
    axios.post('http://127.0.0.1:5000/delete_from_cart', { product_id: productId }, {
      headers: { Authorization: authToken },
    })
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

  return (
    <div className="basket">
      <h2 className='basket-title'>Your Shopping Basket:</h2>
      <div className="basket-wrapper">
        {cartItems.length === 0 ? (
          <p>Your basket is empty :( Go to the catalog and add something.</p>
        ) : (
          <div className='basket-items'>
            {cartItems.map(item => (
              <div className='basket-item' key={item.id}>
                <img src={item.img} alt="" />
                <div className="basket-item-text">
                  <p className='basket-item-title'>{item.name}</p>
                  <p>Price: {item.price} lei</p>
                  <input type="number" value={item.quantity} />
                  <button onClick={() => handlerDelBasketItem(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="order-details">
          <form action="">
            <input type="name" placeholder='First Name' />
            <input type="name" placeholder='Last Name' />
            <input type="text" placeholder='City' />
            <input type="text" placeholder='Address' />
            <input type="tel" placeholder='Telephone Number' />
            <input type="text" placeholder='Promo' />
          </form>
            <div className="order-details_pay">
              <p>Total amount: </p>
              <p>Delivery price: </p>
              <button className='order-details_btn'>Pay</button>
            </div>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
