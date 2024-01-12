import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const QButton = ({ productId, quantity, min = 0, max = 10, authToken }) => {
  const [value, setValue] = useState(quantity);

  const handleIncrease = () => {
    if (value < max) {
      setValue(value + 1);
      updateQuantity(value + 1);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      setValue(value - 1);
      updateQuantity(value - 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = Math.max(parseInt(e.target.value) || min, min);
    setValue(Math.min(newValue, max));
    updateQuantity(newValue);
  };

  const updateQuantity = (newQuantity) => {
    axios.post('http://127.0.0.1:5000/update_cart_item', {
      product_id: productId,
      new_quantity: newQuantity,
    }, {
      headers: { Authorization: authToken },
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div className='QButton'>
      <p onClick={handleDecrease}>-</p>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
      />
      <p onClick={handleIncrease}>+</p>
    </div>
  );
};

export default QButton;
