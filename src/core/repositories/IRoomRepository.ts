import { Room } from '../domain/models/Room';
import { User } from '../domain/models/User';

export interface IRoomRepository {
  getAll(): Promise<Room[]>;
  getById(id: string): Promise<Room>;
  create(room: Omit<Room, 'id'>): Promise<Room>;
  update(id: string, room: Partial<Room>): Promise<Room>;
  delete(id: string): Promise<void>;
  addMember(roomId: string, user: User): Promise<Room>;
  removeMember(roomId: string, userId: string): Promise<Room>;
  getMembers(roomId: string): Promise<User[]>;
} 