import { Meeting } from '../domain/models/Meeting';

export interface IMeetingRepository {
  getByRoomId(roomId: string): Promise<Meeting[]>;
  create(meeting: Omit<Meeting, 'id'>): Promise<Meeting>;
  update(id: string, meeting: Partial<Meeting>): Promise<Meeting>;
  delete(id: string): Promise<void>;
  endMeeting(id: string): Promise<Meeting>;
  addParticipant(id: string, userId: string): Promise<Meeting>;
  removeParticipant(id: string, userId: string): Promise<Meeting>;
} 