import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { message, FloatButton } from 'antd';

export default function Basket() {
  const { authToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [address, setAddress] = useState('');
  const [telNumber, setTelNumber] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, [authToken]);

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

  const handlePlaceOrder = () => {
    axios.post('http://127.0.0.1:5000/place_order', {
      address,
      telNumber,
      cartItems,
    }, {
      headers: { Authorization: authToken },
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

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
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
                <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, e.target.value)} />
                <button onClick={() => handlerDelBasketItem(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="order-details">
          <form action="">
            <input type="text" placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
            <input type="tel" placeholder='Telephone Number' value={telNumber} onChange={(e) => setTelNumber(e.target.value)} />
          </form>
          <div className="order-details_pay">
            <p>Total amount: {totalAmount} </p>
            <button className='order-details_btn' onClick={handlePlaceOrder}>Place order</button>
          </div>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
