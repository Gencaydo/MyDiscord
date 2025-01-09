import { Role } from "./Role";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
} 