import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../src/context/SocketProvider";
const RoomScreen = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState("");
  const [myStream,setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined the room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () =>
  {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio:true,
      video:true,
    })
    setMyStream(stream);
  },[])
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center border-4 border-blue-500 rounded-lg p-4">
        <h1 className="font-bold text-4xl text-blue-900 m-5">Room Page</h1>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        <button
          type="submit"
          className=" m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Call
        </button>
      </div>
    </div>
  );
};

export default RoomScreen;

