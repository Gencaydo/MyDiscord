import { defineStore } from 'pinia';
import { Room } from '@/core/domain/models/Room';
import { useAuthStore } from './auth';
import { MockRoomRepository } from '@/infrastructure/repositories/MockRoomRepository';

const roomRepository = new MockRoomRepository();

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [] as Room[],
    currentRoom: null as Room | null,
  }),

  getters: {
    getRooms(): Room[] {
      return this.rooms;
    }
  },

  actions: {
    async createRoom(name: string): Promise<Room> {
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error('User not authenticated');

      // Check for duplicate room name
      const existingRoom = this.rooms.find(r => r.name.toLowerCase() === name.toLowerCase());
      if (existingRoom) {
        throw new Error('A room with this name already exists');
      }

      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        members: [],
        createdBy: authStore.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.rooms.push(newRoom);
      return newRoom;
    },

    async joinRoom(roomId: string): Promise<Room> {
      const room = this.rooms.find(r => r.id === roomId);
      if (!room) throw new Error('Room not found');
      
      const authStore = useAuthStore();
      if (!authStore.user) throw new Error('User not authenticated');
      
      if (!room.members.find(m => m.id === authStore.user?.id)) {
        room.members.push(authStore.user);
      }
      
      this.currentRoom = room;
      return room;
    },

    setCurrentRoom(room: Room | null) {
      this.currentRoom = room;
    },

    leaveCurrentRoom() {
      if (this.currentRoom) {
        const authStore = useAuthStore();
        this.currentRoom.members = this.currentRoom.members.filter(
          m => m.id !== authStore.user?.id
        );
        this.currentRoom = null;
      }
    },

    resetState() {
      this.rooms = [];
      this.currentRoom = null;
    }
  }
}); 