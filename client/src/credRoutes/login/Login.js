import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { BiSolidHide } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import './Login.css';

const Login = () => {
    const [error, setError] = useState('');
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = data;
    const navigate = useNavigate();

    // show and hide password
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        let timer;
        if (error) {
          timer = setTimeout(() => {
            setError(''); 
          }, 4000);
        }
        return () => clearTimeout(timer); 
      }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:2002/auth/login', { email, password });
            console.log(response.data); 
            
            if (response.data.value) {
                localStorage.setItem('value', response.data.value);
                // Redirect to the home page upon successful login
                navigate('/home');
            }

            toast.success('Login successful!');
            
        } catch (error) {
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value
        });
    };

    return (
        <div className="Login-container">
            <div className='main'>
                <h2 className='login'></h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className='email'>
                        <label htmlFor='email'>Email</label>
                        <input type="text" name="email" id='email' value={email} onChange={handleChange} required />
                    </div>
                    <div className='password'>
                        <label>Password</label>
                        <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={handleChange} required />
                        <button className="password-toggle-button" onClick={toggleShowPassword}>
                        {showPassword ? <BsFillEyeFill /> : <BiSolidHide /> }
                    </button>
                        </div>
                    <button className='submit-button' type="submit">Login</button>
                    <div> {error && <p className="error-message">{error}</p>}</div>
                </form>
                <p className='sign-up'>
                 <Link to="/register">signUp</Link>
                </p>
            </div>
            <Toaster />
        </div>
    );
};

export default Login;
