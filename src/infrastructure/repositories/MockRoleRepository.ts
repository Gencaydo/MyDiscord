import { IRoleRepository } from '@/core/repositories/IRoleRepository';
import { Role } from '@/core/domain/models/Role';

export class MockRoleRepository implements IRoleRepository {
  private roles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      color: '#ff0000',
      permissions: ['MANAGE_ROOMS', 'MANAGE_USERS', 'MANAGE_ROLES'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Moderator',
      color: '#00ff00',
      permissions: ['MANAGE_MESSAGES', 'KICK_USERS'],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  private userRoles: { userId: string; roleId: string; }[] = [];

  async getAll(): Promise<Role[]> {
    return this.roles;
  }

  async getById(id: string): Promise<Role> {
    const role = this.roles.find(r => r.id === id);
    if (!role) throw new Error('Role not found');
    return role;
  }

  async create(role: Omit<Role, 'id'>): Promise<Role> {
    const newRole = {
      id: Math.random().toString(36).substr(2, 9),
      ...role,
    };
    this.roles.push(newRole);
    return newRole;
  }

  async update(id: string, role: Partial<Role>): Promise<Role> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    
    this.roles[index] = { ...this.roles[index], ...role };
    return this.roles[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index !== -1) {
      this.roles.splice(index, 1);
      this.userRoles = this.userRoles.filter(ur => ur.roleId !== id);
    }
  }

  async assignToUser(roleId: string, userId: string): Promise<void> {
    if (!this.roles.find(r => r.id === roleId)) {
      throw new Error('Role not found');
    }
    
    if (!this.userRoles.find(ur => ur.roleId === roleId && ur.userId === userId)) {
      this.userRoles.push({ userId, roleId });
    }
  }

  async removeFromUser(roleId: string, userId: string): Promise<void> {
    const index = this.userRoles.findIndex(
      ur => ur.roleId === roleId && ur.userId === userId
    );
    if (index !== -1) {
      this.userRoles.splice(index, 1);
    }
  }
} 