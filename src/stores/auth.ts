import { defineStore } from 'pinia';
import { User } from '@/core/domain/models/User';
import { useRoomStore } from './room';
import { useWebRTCStore } from './webrtc';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async login(email: string, password: string) {
      // Mock login
      if (email === 'test@test.com' && password === 'password123') {
        const user = {
          id: '1',
          email,
          username: 'Test User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
          status: 'online' as const,
          isVideoEnabled: false,
          isAudioEnabled: false,
          roles: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const token = `fake-jwt-${Math.random().toString(36).substring(7)}`;
        
        this.user = user;
        this.token = token;
        this.isAuthenticated = true;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { user, token };
      }
      throw new Error('Invalid credentials');
    },

    logout() {
      const roomStore = useRoomStore();
      const webrtcStore = useWebRTCStore();

      // Clear room state
      roomStore.leaveCurrentRoom();
      roomStore.resetState();

      // Clear WebRTC state
      webrtcStore.leaveRoom();
      webrtcStore.resetState();

      // Clear auth state
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
}); 