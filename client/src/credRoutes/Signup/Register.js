import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { BiSolidHide } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [data, setData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { first_name, last_name, email, password } = data;

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        let errors = [];
    
        if (value.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!/[A-Z]/.test(value)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(value)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/\d/.test(value)) {
            errors.push('Password must contain at least one digit.');
        }
        if (/\s/.test(value)) {
            errors.push(`Password must not contain spaces.`);
        }
    
        if (errors.length > 0) {
            setError(errors.join(' '));
        } else {
            setError('');
        }
    
        setData({
            ...data,
            password: value
        });
    };
    const handleEmailChange = (e) => {
        const { value } = e.target;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    
        if (!isValidEmail) {
            setError('Please enter a valid email address.');
        } else {
            setError('');
        }
    
        setData({
            ...data,
            email: value
        });
    };
    
    

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
            const response = await axios.post('http://localhost:2002/auth/register', data);
            if (response.data.err) {
                toast.error(response.data.err);
            } else {
                toast.success(response.data.msg);
                navigate('/register/otp');
            }
        } catch (err) {
            setError('Failed to register. Please try again.');
        }
    };

    // show and hide password
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
      <div className="register-container">
        <div className="main">
          <h1 className="name"></h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                className="first-name"
                type="text"
                id="first_name"
                name="first_name"
                value={first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="password">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                className="password-toggle-button"
                onClick={toggleShowPassword}
              >
                {showPassword ? <BsFillEyeFill /> : <BiSolidHide />}
              </button>
            </div>
            {password && (
              <div>
              <div className="requirements">
                {password.length < 8 && (
                  <p className="unfulfilled">At least 8 characters</p>
                )}
                {!/[A-Z]/.test(password) && (
                  <p className="unfulfilled">use uppercase letter</p>
                )}
                {!/[a-z]/.test(password) && (
                  <p className="unfulfilled">use lowercase letter</p>
                )}
                {!/\d/.test(password) && (
                  <p className="unfulfilled">use digit</p>
                )}
                {/\s/.test(password) && (
                  <p className="unfulfilled">No spaces</p>
                )}
              </div>
            </div>
            
            )}

            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
          <div className="login-link">
          <span className="login-text">ALREADY HAVE AN ACCOUNT?
          <Link className='link-box' to="/">Login</Link></span>
          </div>
        </div>
      </div>
    );
}

export default Register;
