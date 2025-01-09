import { User } from '../domain/models/User';

export interface IUserRepository {
  getById(id: string): Promise<User>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  getByEmail(email: string): Promise<User>;
} 