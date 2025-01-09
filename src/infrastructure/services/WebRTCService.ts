export class WebRTCService {
  private peerConnection: RTCPeerConnection;
  private localStream?: MediaStream;

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
  }

  async joinRoom(roomId: string) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  leaveRoom() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.peerConnection.close();
  }

  startVideo() {
    this.localStream?.getVideoTracks().forEach(track => track.enabled = true);
  }

  stopVideo() {
    this.localStream?.getVideoTracks().forEach(track => track.enabled = false);
  }

  mute() {
    this.localStream?.getAudioTracks().forEach(track => track.enabled = false);
  }

  unmute() {
    this.localStream?.getAudioTracks().forEach(track => track.enabled = true);
  }

  getLocalStream() {
    return this.localStream;
  }
} 