import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../hooks/Socket';
import './GetRoom.css';

const EnterRoom = () => {
  const [roomId, setRoomId] = useState(localStorage.getItem('roomId') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (roomId.trim() !== '' && username.trim() !== '') {
          socket.emit('joinRoom', { roomId, participants: username });
          toast.success('Joined the room successfully');
          localStorage.setItem('roomId', roomId);
          localStorage.setItem('username', username);
          localStorage.setItem('joinedRoom', 'true');
          navigate(`/room/${roomId}/${username}`);
        } else {
          toast.error('Room ID and username are required');
        }
      } catch (error) {
        console.error('Failed to join the room:', error);
        toast.error('An error occurred while joining the room');
      } finally {
        setLoading(false);
      }
    },
    [roomId, username, socket, navigate]
  );

  useEffect(() => {
    return () => {
      socket.off('joinRoom');
    };
  }, [socket]);

  return (
    <div className="socket-join">
      <div className="get-container">
        <h1 className="text-body">Chat App</h1>
        <form onSubmit={handleSubmit}>
          <div className="search-roomId">
            <label htmlFor="room-id">Room ID:</label>
            <input
              type="text"
              id="room-id"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <div className="username">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit" className="join-btn" disabled={loading}>
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterRoom;
