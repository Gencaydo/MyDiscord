import { User } from "./User";

export interface Room {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
} 