  import React, { useState } from 'react';
  import './home.css';
  import { useNavigate } from 'react-router-dom';
  import Logout from '../credRoutes/logout/Logout';



  const Home = () => {
    const navigate = useNavigate()
    
    const handleRoomBtn = (e) =>{
      e.preventDefault();
      navigate('/createRoom')
    }
    
    const handleEnterBtn = (e) =>{
      e.preventDefault();
      navigate('/enterRoom')
    }



    return (
      <div>
        <nav className="navbar">
          <ul className='main-box'>
            <li>
              <button className="btn-CreateRoom" onClick={handleRoomBtn}>Create Room</button>
            </li>
            <li>
              <button className="btn-FindRoom" onClick={handleEnterBtn}>
          Enter Room
              </button>
            </li>
          
            <div className='logout-btn'>
              <Logout />
            </div>     
            </ul>
        </nav>
      </div>
    );
  };

  export default Home;
