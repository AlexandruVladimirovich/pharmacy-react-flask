import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { message} from 'antd';

export default function AddNews() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [imgLink, setImgLink] = useState('');
    const { authToken } = useAuth();

    const handlerTitle = (e) => {
        setTitle(e.target.value);
    };

    const handlerText = (e) => {
        setText(e.target.value);
    };

    const handlerImgLink = (e) => {
        setImgLink(e.target.value);
    };

    const handleSubmitNews = (e) => {
        e.preventDefault();

        const newsData = {
            title: title,
            text: text,
            imgLink: imgLink
        };

        axios
          .post(
            'http://127.0.0.1:5000/add_news',
            newsData,
            { headers: { Authorization: authToken } }
          )
          .then((response) => {
            console.log(response.data.message);
            message.success('News add successfully!');
          })
          .catch((error) => {
            console.error(error);
            message.warning('Failed to add news. Please try again.');
          });
      };
    

    return (
        <aside className='products-aside'>
            <form onSubmit={handleSubmitNews} className='products-aside_form'>
                <h2>Add News:</h2>
                <h3>Title:</h3>
                <input type="text" value={title} onChange={handlerTitle} />
                <h3>Text:</h3>
                <input type="text" value={text} onChange={handlerText} />
                <h3>Img link:</h3>
                <input type="text" value={imgLink} onChange={handlerImgLink} />
                <button type="submit" className='product-aside_btn'>Add</button>
            </form>
        </aside>
        
    );
}
