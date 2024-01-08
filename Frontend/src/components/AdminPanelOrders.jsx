import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FloatButton } from 'antd';

export default function AdminPanelOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const { authToken } = useAuth();

  const handleShowProducts = (order) => {
    setAllOrders((prevOrders) => {
      return prevOrders.map((prevOrder) => {
        if (prevOrder.order_id === order.order_id) {
          return { ...prevOrder, showProducts: !prevOrder.showProducts };
        } else {
          return prevOrder;
        }
      });
    });
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get_user_orders', {
      headers: { Authorization: authToken }
    })
      .then(response => {
        console.log(response.data);
        setAllOrders(response.data.orders.map(order => ({ ...order, showProducts: false })));
      })
      .catch(error => {
        console.error(error);
      });
  }, [authToken]);

  return (
    <div className='admin-panel-orders'>
      <h2>All Orders:</h2>
      {allOrders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className='order-list'>
          {allOrders.map(order => (
            <div key={order.order_id} className='order-info'>
              <h4>Order ID: {order.order_id}</h4>
              <p>Date: {order.date}</p>
              <p>Status: {order.status}</p>
              <p>Address: {order.address}</p>
              <p>Telephone Number: {order.tel_number}</p>
              <button onClick={() => handleShowProducts(order)} className='adminPanel-button'>
                {order.showProducts ? 'Hide Products' : 'Show Products'}
              </button>
              {order.showProducts && (
                <div className='order-items'>
                  <h4>Products in Order:</h4>
                    {order.orderItems.map(product => (
                      <div key={product.product_id} className='order-item'>
                        <div className="product-item_img">
                          <img src={product.product_img} alt="" />
                        </div>
                        <div className="product-item_info">
                          <p>Name: {product.product_name}</p>
                          <p>Quantity: {product.quantity}</p>
                          <p>Price: {product.product_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
      <FloatButton.BackTop />
    </div>
  );
}
