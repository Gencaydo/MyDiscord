import { IUserRepository } from '@/core/repositories/IUserRepository';
import { User } from '@/core/domain/models/User';

export class MockUserRepository implements IUserRepository {
  private users: User[] = [
    {
      id: '1',
      username: 'Test User',
      email: 'test@test.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      status: 'online',
      roles: [],
      isVideoEnabled: false,
      isAudioEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  async getById(id: string): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  async getByEmail(email: string): Promise<User> {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  }
} 