import { Role } from '../domain/models/Role';

export interface IRoleRepository {
  getAll(): Promise<Role[]>;
  getById(id: string): Promise<Role>;
  create(role: Omit<Role, 'id'>): Promise<Role>;
  update(id: string, role: Partial<Role>): Promise<Role>;
  delete(id: string): Promise<void>;
  assignToUser(roleId: string, userId: string): Promise<void>;
  removeFromUser(roleId: string, userId: string): Promise<void>;
} 