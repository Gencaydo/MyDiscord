import { Room } from "./Room";
import { User } from "./User";

export interface Chat {
  id: string;
  content: string;
  room: Room;
  sender: User;
  attachments?: string[];
  reactions?: ChatReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatReaction {
  emoji: string;
  users: User[];
} 