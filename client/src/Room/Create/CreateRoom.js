import { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast'
// import { MdCopyAll } from "react-icons/md";
import './Room.css'

const CreateRoom = () => {
  const [room, setRoom] = useState({
    host: '',
    roomType: '',
    roomId: '',
    roomBio: '',
    emails: '',
    created: false,
  });
  const [error, setError] = useState('')

  const { host, roomType, roomId, roomBio, emails, created } = room;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2002/auth/room', room);
      if (response.status === 200) {
        toast.success('Room created successfully');
        setRoom(prevRoom => ({
         ...prevRoom,
         roomId: response.data.roomId, 
          created: true
        }));
        // reset room
      
          setRoom({
            host: '',
            roomType: '',
            roomId: '',
            roomBio: '',
            emails: '',
            created: false,
          });
       

      } else {
        toast.error('Failed to create room. Please try again later.');
      }
      
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          toast.error(err.response.data.message);
        } else {
          toast.error('An unexpected error occurred. Please try again later.');
        }
      } else if (err.request) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom({
      ...room,
      [name]: value,
    });
  };

  // copy button
  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      toast.success('Copied RoomId to clipboard');
    }).catch(err => {
      toast.error('Failed to copy RoomId. Please try again later.');
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="createRoom">
      <div className="room-container">
        <h1 className='text-header'>Create Room</h1>
        <form onSubmit={handleSubmit} className="room-form">
          <div className="form-group">
            <label>Host Name</label>
            <input
              type="text"
              name="host"
              value={host}
              onChange={handleChange}
              required
            />
          </div>
          <div className="roomType">
            <label>Room Type</label>
            <select
            name="roomType"
            value={roomType}
            onChange={handleChange}
            required
          >
            <option value="">Select Room Type</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          </div>
          <div className="roomBio">
            <label>Room Bio</label>
            <textarea
              name="roomBio"
              placeholder='Enter room Description'
              value={roomBio}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="emails">
            <label>Emails</label>
            <input
              type="email"
              name="emails"
              value={emails}
              placeholder='Enter all members emails'
              onChange={handleChange}
              multiple
              required
            />
          </div>
      {/*     <div className="room-id">
          <label>Room ID</label>
          <div className="room-id-container">
            <input
              type="text"
              name="roomId"
              value={roomId}
              onChange={handleChange}
              readOnly
            />
            <button type="button" className="btn-copy" onClick={copyRoomIdToClipboard}><MdCopyAll /></button>
          </div>
        </div>*/}
          <button type="submit" className="btn">Create Room</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
