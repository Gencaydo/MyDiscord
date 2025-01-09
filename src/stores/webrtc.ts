import { defineStore } from 'pinia';
import { WebRTCService } from '@/infrastructure/services/WebRTCService';

export const useWebRTCStore = defineStore('webrtc', {
  state: () => ({
    isVideoEnabled: false,
    isAudioEnabled: false,
    webrtcService: new WebRTCService(),
  }),

  actions: {
    async joinRoom(roomId: string) {
      try {
        await this.webrtcService.joinRoom(roomId);
        this.isVideoEnabled = true;
        this.isAudioEnabled = true;
        return this.webrtcService.getLocalStream();
      } catch (error) {
        console.error('Failed to join room:', error);
        throw error;
      }
    },

    leaveRoom() {
      this.webrtcService.leaveRoom();
      this.isVideoEnabled = false;
      this.isAudioEnabled = false;
    },

    toggleVideo() {
      if (this.isVideoEnabled) {
        this.webrtcService.stopVideo();
      } else {
        this.webrtcService.startVideo();
      }
      this.isVideoEnabled = !this.isVideoEnabled;
    },

    toggleAudio() {
      if (this.isAudioEnabled) {
        this.webrtcService.mute();
      } else {
        this.webrtcService.unmute();
      }
      this.isAudioEnabled = !this.isAudioEnabled;
    },

    resetState() {
      this.isVideoEnabled = false;
      this.isAudioEnabled = false;
      this.webrtcService = new WebRTCService();
    }
  }
}); 