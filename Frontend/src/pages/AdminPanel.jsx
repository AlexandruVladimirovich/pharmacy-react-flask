import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { message, FloatButton } from 'antd';

export default function AdminPanel() {
  const { authToken } = useAuth();
  const { products, fetchProducts } = useProducts();

  const [newProductData, setNewProductData] = useState({
    id: '',
    name: '',
    discription: '',
    price: '',
    img: '',
    category: '',
    quantity: '',
  });
  
  

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    if (isUpdateMode) {
      setNewProductData({
        id: '',
        name: '',
        discription: '',
        price: 0,
        img: '',
        category: '',
        quantity: 0,
      });
    } else{
      setNewProductData({
        id:'1'
      })
    }
  }, [isUpdateMode]);

  const handlerDelProduct = (productId) => {
    axios
      .post(
        'http://127.0.0.1:5000/del_product',
        { product_id: productId },
        { headers: { Authorization: authToken } }
      )
      .then((response) => {
        console.log(response.data.message);
        message.success('The item has been successfully deleted!');

        fetchProducts();
      })
      .catch((error) => {
        console.error(error);
        message.warning('Failed to remove item. Please try again.');
      });
  };


  const isDataValid = (data) => {
    for (const key in data) {
      if (typeof data[key] === 'string' && data[key].trim() === '') {
        return false;
      } else if (typeof data[key] === 'number' && data[key] === 0) {
        return false;
      }
    }
    return true;
  };
  

  const handlerAddProduct = () => {
    if (!isDataValid(newProductData)) {
      message.warning('Fill in all fields before adding an item.');
      return;
    }
  
    const requestUrl = 'http://127.0.0.1:5000/add_product';
  
    axios.post(
      requestUrl,
      { product: { ...newProductData } },
      { headers: { Authorization: authToken } }
    )
      .then((response) => {
        console.log(response.data.message);
        message.success('Product has been successfully added!');
        setNewProductData({
          id: '',
          name: '',
          discription: '',
          price: '',
          img: '',
          category: '',
          quantity: '',
        });
        fetchProducts();
      })
      .catch((error) => {
        console.error(error);
        message.warning('Failed to add item. Please try again.');
      });
  };
  
  const handleUpdateProduct = () => {
    if (!isDataValid(newProductData)) {
      message.warning('Fill in all fields before updating an item.');
      return;
    }
  
    const requestUrl = `http://127.0.0.1:5000/update_product`;
    axios.put(
      requestUrl,
      { updated_product: { ...newProductData } },
      { headers: { Authorization: authToken } }
    )
      .then((response) => {
        console.log(response.data.message);
        message.success('Product has been successfully updated!');
        setNewProductData({
          id: '',
          name: '',
          discription: '',
          price: 0,
          img: '',
          category: '',
          quantity: 0,
        });
        fetchProducts();
      })
      .catch((error) => {
        console.error(error);
        message.warning('Failed to update item. Please try again.');
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleToggleMode = () => {
    setIsUpdateMode((prevMode) => !prevMode);
    setNewProductData({
      name: '',
      discription: '',
      price: 0,
      img: '',
      category: '',
      quantity: 0,
    });
  };

  const selectItem = (selectedProduct) => {
    setIsUpdateMode(true);
  
    if (selectedProduct) {
      setNewProductData({
        id: selectedProduct.id,
        name: selectedProduct.name,
        discription: selectedProduct.discription,
        price: selectedProduct.price,
        img: selectedProduct.img,
        category: selectedProduct.category,
        quantity: selectedProduct.quantity,
      });
    } else {
      setNewProductData({
        id: '',
        name: '',
        discription: '',
        price: 0,
        img: '',
        category: '',
        quantity: 0,
      });
    }
  };
  
  

  return (
    <div className="admin-panel">
      <div className="admin-panel_change">
        <button onClick={handleToggleMode}>
          {isUpdateMode ? 'Switch to Add Mode' : 'Switch to Update Mode'}
        </button>
        <input
          type="id"
          name="id"
          placeholder="id"
          value={newProductData.id}
          onChange={handleInputChange}
          style={{ display: (isUpdateMode ? '' : 'none')}}
        />
        <input
          type="text"
          name="name"
          placeholder="Title"
          value={newProductData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="discription"
          placeholder="discription"
          value={newProductData.discription}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProductData.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="img"
          placeholder="Image link"
          value={newProductData.img}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProductData.category}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newProductData.quantity}
          onChange={handleInputChange}
        />
        <button onClick={isUpdateMode ? handleUpdateProduct : handlerAddProduct}>
          {isUpdateMode ? 'Update product' : 'Add new product'}
        </button>
      </div>

      <div className="admin-panel_products">
        {products.map((item, index) => (
          <div key={index} id={item.id} className="admin-panel_item" onClick={() => selectItem(item)}>
            <img src={item.img} alt="" />
            <p>ID: {item.id}</p>
            <p>Title: {item.name}</p>
            <p>Discription: {item.discription}</p>
            <p>Price: {item.price}</p>
            <p>Category: {item.category}</p>
            <p>Quantity: {item.quantity}</p>
            <button className="product-btn" onClick={() => handlerDelProduct(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
