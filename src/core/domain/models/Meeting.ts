import { Room } from "./Room";
import { User } from "./User";

export interface Meeting {
  id: string;
  room: Room;
  participants: User[];
  startTime: Date;
  endTime?: Date;
  type: 'voice' | 'video';
  status: 'active' | 'ended';
} 