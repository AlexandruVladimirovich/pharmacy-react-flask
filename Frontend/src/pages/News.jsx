import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {

  const [data, setData] = useState([])


    useEffect(() =>{
      axios.get('http://127.0.0.1:5000/getnews')
      .then(response => {
        console.log(response.data)
        setData(response.data)

      })
      .catch(error => {
        console.error(error)
      });
    }, [])

  return (
    <div className='news'>
    {data.map((item, index) => (
      <div key={index} className='news-item'>
        <div className="news-item_img">
          <img src={item.img} alt="" />
        </div>
        <div className="news-item_text">
          <p className='news-title'>{item.title}</p>
          <p>{item.discription}</p>
        </div>
      </div>
    ))}
    </div>
  );
}
