import React, { useState, useCallback,useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../src/context/SocketProvider";
const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

//useCallback

//The React useCallback Hook returns a memoized callback function.
//Think of memoization as caching a value so that it does not need to be recalculated.
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault(); //form autosubmit na ho
      //This sends the user's email and the room number to the server.
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback((data) =>
  {
    const {email,room} = data;
    navigate(`/room/${room}`)
    
  },[navigate]);

  useEffect(() => {
    //This ensures that when the room:join event is received,
    //the handleJoinRoom function is executed
    socket.on("room:join",handleJoinRoom);
  }, [socket]);


  return (
    <div className="text-center p-4 h-50 w-50 border-4 ">
      <h1 className="text-4xl font-bold text-blue-500 p-4">Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID : </label>
        <input
          type="email"
          id="email"
          placeholder="xyz@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <br></br>
        <br></br>
        <label htmlFor="roomno">Room No : </label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        ></input>
        <br></br>
        <br></br>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default LobbyScreen;
