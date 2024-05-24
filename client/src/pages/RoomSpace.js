import React from "react";
import { useNavigate } from 'react-router-dom';

const ChatPage = () =>{
    const navigate = useNavigate()
    
    const handleRoomBtn = (e) =>{
      e.preventDefault();
      navigate('/Chatbox')
    }
    
    // const handleEnterBtn = (e) =>{
    //   e.preventDefault();
    //   navigate('/enterRoom')
    // }


    return(
        <div className="home-container">
        <div className="toggle-chat">
        <button className="btn-CreateRoom" onClick={handleRoomBtn}>chatBox</button>
        </div>
        </div>
    )
}
export default ChatPage