# react-video-chat-app
1. we had made a server folder where we has made a socket connection using event listerner connection in index.js file 
and made a BrowserRouter because we need to initialize routes in client folder which has screens folder 1.LobbyScreen and 2.RoomScreen .

2. In LobbyScreen we have added a form with input of email and room number with a join button
This information need to be send to the backend server using socketProvider.jsx in context folder.If the room number is same different user can join a room 

3. SocketProvider component sets up a WebSocket connection using socket.io and provides the socket instance via a React context.Also we will add the server PORT in provider

4. In Lobby we have added handleSubmitForm using useCallback where the data is send to the server and when the room:join event is recieved useEffect triggers and navigates to RoomPage

5. A event user:join is triggered than room:join event handles the users in the room where a call button is added when user calls a offer is made using RTCPeerConnection in service folder ->peer.js 

6. In this getOffer and getAnswer plays a vital role in connecting P2P where a offer is created then the session description is stored in local and return the offer with an incoming:call event 

7. To aacept this offer getAnswer function is used 