import React, { useState, useEffect } from 'react';
import Filters from './select/Filters';
import { useProducts } from '../context/ProductsContext';

export default function AsideProducts() {
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [category, setCategory] = useState('vitamine');

  const { params, setParams } = useProducts();

  const categories = ["vitamin", "antivirals", "hygiene"];

  const handlerPriceFrom = (e) => {
    setPriceFrom(e.target.value);
  };

  const handlerPriceTo = (e) => {
    setPriceTo(e.target.value);
  };

  const handlerCategory = (e) => {
    setCategory(e.target.value);
  };

  const handlerAsider = (e) => {
    e.preventDefault();

    const newParams = {
      priceFrom,
      priceTo,
      category,
    };

    setParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  };


  return (
    <aside className='products-aside'>
      <form action="" className='products-aside_form' onSubmit={handlerAsider}>
        <h2>Filters: </h2>
        <h3>Price from:</h3>
        <input type="number" placeholder='0 lei' value={priceFrom} onChange={handlerPriceFrom} />
        <h3>Price to:</h3>
        <input type="number" placeholder='0 lei' value={priceTo} onChange={handlerPriceTo} />
        <Filters header='Category: ' item={category} options={categories} handler={handlerCategory} />
        <button type="submit" className='product-aside_btn'>
          Search
        </button>
      </form>
    </aside>
  );
}
