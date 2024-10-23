//RTCPeerConnection interface represents a WebRTC connection between the local computer and a remote peer.
//It provides methods to connect to a remote peer, maintain and monitor the connection,
//and close the connection once it's no longer needed.

//https://webrtc.org/getting-started/peer-connections
class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getOffer(){
      if(this.peer){
          const offer = await this.peer.createOffer();
          await this.peer.setLocalDescription(new RTCSessionDescription(offer));
          return offer;
      }
  }
}

export default new PeerService();
