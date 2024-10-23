import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../src/context/SocketProvider";
import peer from "../service/peer";
import ReactPlayer from "react-player";

const RoomScreen = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState("");
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

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
  }, [remoteSocketId, socket]);

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("Incoming call", from, offer);
      const ans = await peer.getAnswer(offer);

      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log(`Call Accepted`);

      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted,handleNegoNeedIncoming,handleNegoNeedFinal]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center border-4 border-blue-500 rounded-lg p-4">
        <h1 className="font-bold text-4xl text-blue-900 m-5">Room Page</h1>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        {myStream && <button onClick={sendStreams} type="submit"
            className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send Stream</button>}
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            type="submit"
            className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Call
          </button>
        )}
        <>
          <br></br>

          {myStream && (
            <>
              <h3 className="font-bold text-3xl">My stream</h3>
              <ReactPlayer
                playing
                muted
                height="100px"
                width="200px"
                url={myStream}
              />
            </>
          )}
          {remoteStream && (
            <>
              <h1>Remote Stream</h1>
              <ReactPlayer
                playing
                muted
                height="100px"
                width="200px"
                url={remoteStream}
              />
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default RoomScreen;
