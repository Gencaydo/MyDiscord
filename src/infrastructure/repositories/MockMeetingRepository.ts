import { IMeetingRepository } from '@/core/repositories/IMeetingRepository';
import { Meeting } from '@/core/domain/models/Meeting';

export class MockMeetingRepository implements IMeetingRepository {
  private meetings: Meeting[] = [];

  async getByRoomId(roomId: string): Promise<Meeting[]> {
    return this.meetings.filter(meeting => meeting.room.id === roomId);
  }

  async create(meeting: Omit<Meeting, 'id'>): Promise<Meeting> {
    const newMeeting = {
      id: Math.random().toString(36).substr(2, 9),
      ...meeting,
    };
    this.meetings.push(newMeeting);
    return newMeeting;
  }

  async update(id: string, meeting: Partial<Meeting>): Promise<Meeting> {
    const index = this.meetings.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    
    this.meetings[index] = { ...this.meetings[index], ...meeting };
    return this.meetings[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.meetings.findIndex(m => m.id === id);
    if (index !== -1) {
      this.meetings.splice(index, 1);
    }
  }

  async endMeeting(id: string): Promise<Meeting> {
    const meeting = this.meetings.find(m => m.id === id);
    if (!meeting) throw new Error('Meeting not found');

    meeting.status = 'ended';
    meeting.endTime = new Date();
    return meeting;
  }

  async addParticipant(id: string, userId: string): Promise<Meeting> {
    const meeting = this.meetings.find(m => m.id === id);
    if (!meeting) throw new Error('Meeting not found');

    if (!meeting.participants.find(p => p.id === userId)) {
      meeting.participants.push({ id: userId } as any);
    }
    return meeting;
  }

  async removeParticipant(id: string, userId: string): Promise<Meeting> {
    const meeting = this.meetings.find(m => m.id === id);
    if (!meeting) throw new Error('Meeting not found');

    meeting.participants = meeting.participants.filter(p => p.id !== userId);
    return meeting;
  }
} 