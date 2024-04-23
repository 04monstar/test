import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        await new Promise((resolve, reject) => {
          socket.emit("room:join", { email, room }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
        navigate(`/room/${room}`);
      } catch (error) {
        setError("Failed to join the room. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [email, room, socket, navigate]
  );

  useEffect(() => {
    const handleJoinRoom = (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    };

    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, navigate]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          disabled={loading}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LobbyScreen;
