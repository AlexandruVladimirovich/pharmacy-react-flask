import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

export default function Feedback() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    tel_number: '',
    feedback_text: '',
  });

  const handleSubmitFeedback = (e) => {
    e.preventDefault();

    const requestUrl = `http://127.0.0.1:5000/submit_feedback`;
    axios.post(requestUrl, formData) 
      .then((response) => {
        console.log(response.data.message);
        message.success('Your message has been successfully sent.');
      })
      .catch((error) => {
        console.error(error);
        message.warning("There's been a mistake. Try again later.");
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="feedback">
      <h2 className='feedback-title'>Feedback:</h2>
      <form onSubmit={handleSubmitFeedback}>
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
        <input type="tel" name="tel_number" placeholder="Telephone Number" onChange={handleChange} />
        <input className="feedback-text" type="text" name="feedback_text" placeholder="Text" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
