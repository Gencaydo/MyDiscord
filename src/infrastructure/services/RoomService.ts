import { Room } from '@/core/domain/models/Room';

export class RoomService {
  private rooms: Room[] = [];

  async createRoom(name: string): Promise<Room> {
    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      members: [],
      createdBy: {
        id: '1',
        username: 'Current User',
        email: 'user@example.com',
        status: 'online',
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.rooms.push(newRoom);
    return newRoom;
  }

  async joinRoom(roomId: string): Promise<Room> {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  async getRooms(): Promise<Room[]> {
    return this.rooms;
  }
} 