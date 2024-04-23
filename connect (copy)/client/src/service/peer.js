class PeerService {
  constructor() {
    try {
      // Create a new RTCPeerConnection instance with ICE servers configuration
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
    } catch (error) {
      console.error("Error creating RTCPeerConnection:", error);
      this.peer = null; // Set peer to null if initialization fails
    }
  }

  // Method to generate an answer to an offer
  async getAnswer(offer) {
    try {
      if (!this.peer) {
        throw new Error("Peer connection not initialized.");
      }
      // Set remote description from the offer
      await this.peer.setRemoteDescription(offer);
      // Create an answer
      const ans = await this.peer.createAnswer();
      // Set local description with the answer
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    } catch (error) {
      console.error("Error generating answer:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  // Method to set local description (answer)
  async setLocalDescription(ans) {
    try {
      if (!this.peer) {
        throw new Error("Peer connection not initialized.");
      }
      // Set remote description from the answer
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    } catch (error) {
      console.error("Error setting local description:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  // Method to generate an offer
  async getOffer() {
    try {
      if (!this.peer) {
        throw new Error("Peer connection not initialized.");
      }
      // Create an offer
      const offer = await this.peer.createOffer();
      // Set local description with the offer
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    } catch (error) {
      console.error("Error generating offer:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  // Method to disconnect from the peer
  disconnect() {
    try {
      if (this.peer && this.peer.connectionState !== "closed") {
        this.peer.close();
        console.log("Peer disconnected.");
      }
    } catch (error) {
      console.error("Error disconnecting from peer:", error);
    }
  }
}

export default new PeerService();
