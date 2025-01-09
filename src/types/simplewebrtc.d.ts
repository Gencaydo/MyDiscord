declare module 'simplewebrtc' {
  export default class SimpleWebRTC {
    constructor(config: {
      localVideoEl: string;
      remoteVideosEl: string;
      autoRequestMedia?: boolean;
      debug?: boolean;
    });

    joinRoom(roomId: string): void;
    leaveRoom(): void;
    startLocalVideo(): void;
    stopLocalVideo(): void;
    mute(): void;
    unmute(): void;
  }
} 