import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Otp.css'

const Otp = () => {
  const [data, setData] = useState({
    email: '',
    otp: ''
  });

  const { email, otp } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send OTP to server for verification
      const response = await axios.post('http://localhost:2002/auth/register/otp', { email, otp });
      // Handle successful response
      console.log(response.data); 
      toast.success('OTP verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP. Please try again.');
    }
  };

  return (
    <div className="otp-container">
      <h2 className="title"></h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="email">
          <label htmlFor='email' className='email-container'>Email</label>
          <input type="email" name="email" id='email' value={email} onChange={handleChange} required className="input" />
        </div>
        <div className="otp ">
          <label>OTP</label>
          <input type="text" name="otp" id='otp' value={otp} onChange={handleChange} required className="input" />
        </div>
        <button type="submit" className="otp-button">Verify OTP</button>
      </form>
    </div>
  );
};

export default Otp;