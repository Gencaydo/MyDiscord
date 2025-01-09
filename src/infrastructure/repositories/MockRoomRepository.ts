import { IRoomRepository } from '@/core/repositories/IRoomRepository';
import { Room } from '@/core/domain/models/Room';
import { User } from '@/core/domain/models/User';

export class MockRoomRepository implements IRoomRepository {
  private rooms: Room[] = [];

  async getAll(): Promise<Room[]> {
    return this.rooms;
  }

  async getById(id: string): Promise<Room> {
    const room = this.rooms.find(r => r.id === id);
    if (!room) throw new Error('Room not found');
    return room;
  }

  async create(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom = {
      id: Math.random().toString(36).substr(2, 9),
      ...room,
    };
    this.rooms.push(newRoom);
    return newRoom;
  }

  async update(id: string, room: Partial<Room>): Promise<Room> {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Room not found');
    
    this.rooms[index] = { ...this.rooms[index], ...room };
    return this.rooms[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rooms.splice(index, 1);
    }
  }

  async addMember(roomId: string, user: User): Promise<Room> {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) throw new Error('Room not found');

    if (!room.members.find(m => m.id === user.id)) {
      room.members.push(user);
    }
    return room;
  }

  async removeMember(roomId: string, userId: string): Promise<Room> {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) throw new Error('Room not found');

    room.members = room.members.filter(m => m.id !== userId);
    return room;
  }

  async getMembers(roomId: string): Promise<User[]> {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) throw new Error('Room not found');
    return room.members;
  }
} 