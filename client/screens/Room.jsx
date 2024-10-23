import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../src/context/SocketProvider";
import peer from "../service/peer";
import ReactPlayer from "react-player";

const RoomScreen = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState("");
  const [myStream, setMyStream] = useState(null);
  const [submit, setSubmit] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined the with ${id}`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
    setSubmit(true);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback((from, offer) => {
    console.log("incoming:call", from, offer);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
    };
  }, [socket, handleUserJoined, handleIncomingCall]);

  return (
    <div>
      {submit ? (
        <>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center border-4 border-blue-500 rounded-lg p-4">
              <h3 className="font-bold text-3xl">My stream</h3>
              <br></br>
              {myStream && (
                <ReactPlayer
                  playing
                  muted
                  className="w-full h-screen"
                  url={myStream}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center border-4 border-blue-500 rounded-lg p-4">
            <h1 className="font-bold text-4xl text-blue-900 m-5">Room Page</h1>
            <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
            {remoteSocketId && (
              <button
                onClick={handleCallUser}
                type="submit"
                className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Call
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomScreen;
